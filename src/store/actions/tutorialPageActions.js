import * as actions from "./actionTypes";
import { chunkedIn } from "../../helpers/firestoreQuery";

// How many tutorials one pass of the feed returns.
const FEED_PAGE_LIMIT = 20;

export const getTutorialFeedIdArray =
  (uid, max = FEED_PAGE_LIMIT) =>
  async (_, firestore) => {
    try {
      let followedHandles = [];

      if (uid) {
        // The isPublished filter that used to sit on this query matched
        // nothing: user_followers documents only ever carry followingId
        // and followerId, so the personalised half of the feed never ran.
        const followingSnapshot = await firestore
          .collection("user_followers")
          .where("followerId", "==", uid)
          .get();

        const followedIds = followingSnapshot.docs.map(doc =>
          doc.get("followingId")
        );

        // One chunked query rather than a document read per followed user.
        const followedUsers = await chunkedIn(
          firestore.collection("cl_user"),
          "uid",
          followedIds
        );

        followedHandles = followedUsers
          .map(doc => doc.get("handle"))
          .filter(Boolean);
      }

      const publishedTutorials = firestore
        .collection("tutorials")
        .where("isPublished", "==", true);

      // Tutorials by people this user follows. The limit is applied per
      // chunk so a user following prolific authors cannot pull the whole
      // collection; the dedupe and slice below trim the rest.
      const followedDocs = await chunkedIn(
        publishedTutorials.limit(max),
        "created_by",
        followedHandles
      );

      // Top up the page with recent tutorials. The previous not-in query is
      // gone: it is the most expensive operator Firestore offers, and the
      // dedupe below achieves the same result.
      const recentSnapshot = await publishedTutorials
        .orderBy("createdAt", "desc")
        .limit(max)
        .get();

      const ids = [
        ...followedDocs.map(doc => doc.id),
        ...recentSnapshot.docs.map(doc => doc.id)
      ];

      return [...new Set(ids)].slice(0, max);
    } catch (e) {
      console.log(e);
      return [];
    }
  };

export const getTutorialFeedData =
  tutorialIdArray => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_TUTORIAL_FEED_START });
      const tutorialDocs = await chunkedIn(
        firestore.collection("tutorials"),
        "tutorial_id",
        tutorialIdArray
      );
      if (tutorialDocs.length === 0) {
        dispatch({ type: actions.GET_TUTORIAL_FEED_SUCCESS, payload: [] });
      } else {
        const feed = tutorialDocs.map(doc => {
          const tutorial = doc.data();
          const tutorialData = {
            tutorial_id: tutorial?.tutorial_id,
            title: tutorial?.title,
            summary: tutorial?.summary,
            owner: tutorial?.owner,
            created_by: tutorial?.created_by,
            createdAt: tutorial?.createdAt,
            featured_image: tutorial?.featured_image,
            tut_tags: tutorial?.tut_tags,
            upVotes: tutorial?.upVotes || 0,
            downVotes: tutorial?.downVotes || 0,
          };
          return tutorialData;
        });
        dispatch({ type: actions.GET_TUTORIAL_FEED_SUCCESS, payload: feed });
      }
    } catch (e) {
      dispatch({ type: actions.GET_TUTORIAL_FEED_FAILED, payload: e });
    }
  };

export const getTutorialData =
  tutorialID => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_POST_DATA_START });
      const data = await firestore
        .collection("tutorials")
        .doc(tutorialID)
        .get();
      const tutorial = data.data();
      if (tutorial.comments && Array.isArray(tutorial.comments)) {
        tutorial.comments.reverse();
      }
      dispatch({ type: actions.GET_POST_DATA_SUCCESS, payload: tutorial });
    } catch (e) {
      dispatch({ type: actions.GET_POST_DATA_FAIL });
      console.log(e);
    }
  };

export const getTutorialSteps =
  tutorialID => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_STEPS_DATA_START });
      const data = await firestore
        .collection("tutorials")
        .doc(tutorialID)
        .collection("steps")
        .get()
        .then(querySnapshot => {
          let steps = [];
          querySnapshot.forEach(doc => {
            steps.push(doc.data());
          });
          return steps;
        });
      dispatch({ type: actions.GET_STEPS_DATA_SUCCESS, payload: data });
    } catch (e) {
      dispatch({ type: actions.GET_STEPS_DATA_FAIL, payload: e });
      console.log(e);
    }
  };

export const getCommentData =
  commentId => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_COMMENT_DATA_START });
      const data = await firestore
        .collection("cl_comments")
        .doc(commentId)
        .get();
      const comment = data.data();
      dispatch({ type: actions.GET_COMMENT_DATA_SUCCESS, payload: comment });
    } catch (e) {
      dispatch({ type: actions.GET_COMMENT_DATA_FAIL });
      console.log(e);
    }
  };

export const getCommentReply =
  commentId => async (firebase, firestore, dispatch) => {
    try {
      console.log("commentId", commentId);
      dispatch({ type: actions.GET_REPLIES_START });
      console.log("Get replies");
      const replies = await firestore
        .collection("cl_comments")
        .where("replyTo", "==", commentId)
        .get()
        .then(querySnapshot => {
          let data = [];
          querySnapshot.forEach(doc => {
            data.push(doc.data().comment_id);
          });
          return data;
        });
      dispatch({
        type: actions.GET_REPLIES_SUCCESS,
        payload: { replies, comment_id: commentId }
      });
    } catch (e) {
      console.log(e);
    }
  };

export const addComment = comment => async (firebase, firestore, dispatch) => {
  try {
    dispatch({ type: actions.ADD_COMMENT_START });

    const docref = await firestore.collection("cl_comments").add(comment);

    await firestore.collection("cl_comments").doc(docref.id).update({
      comment_id: docref.id
    });

    if (comment.replyTo === comment.tutorial_id) {
      await firestore
        .collection("tutorials")
        .doc(comment.tutorial_id)
        .update({
          comments: firebase.firestore.FieldValue.arrayUnion(docref.id)
        });
    }

    dispatch({ type: actions.ADD_COMMENT_SUCCESS });
    return docref.id
  } catch (e) {
    dispatch({ type: actions.ADD_COMMENT_FAILED, payload: e.message });
  }
};

export const getRecommendedTutorials = currentTutorialTags => async (firebase, firestore) => {
  try {
    const tutorialsRef = firestore.collection("tutorials");

    // Fetch tutorials with matching tags
    const querySnapshot = await tutorialsRef
      .where("tut_tags", "array-contains-any", currentTutorialTags)
      .get();

    // Calculate relevance score based on matching tags
    const recommendedTutorials = querySnapshot.docs
      .map(doc => {
        const tutorial = doc.data();

        // Skip unpublished tutorials
        if (!tutorial.isPublished) return null;

        const matchingTags = tutorial.tut_tags.filter(tag => currentTutorialTags.includes(tag));
        return {
          ...tutorial,
          relevanceScore: matchingTags.length
        };
      })
      .filter(tutorial => tutorial !== null);  // Remove null values from the array

    recommendedTutorials.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return recommendedTutorials;
  } catch (error) {
    console.error("Error fetching recommended tutorials:", error);
    return [];
  }
};