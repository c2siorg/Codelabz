import * as actions from "./actionTypes";
import Elasticlunr from "../../helpers/elasticlunr";
import {
  checkOrgHandleExists,
  checkUserHandleExists,
  isUserSubscribed
} from "./";
import _ from "lodash";

const tutorials_index = new Elasticlunr(
  "tutorial_id",
  "owner",
  "tutorial_id",
  "title",
  "summary"
);

export const fetchAndIndexTutorials = () => async (firebase, firestore) => {
  try {
    const snapshot = await firestore.collection("tutorials").get();
    snapshot.forEach(doc => {
      const data = doc.data();
      const tutorial = { id: doc.id, ...data };
      // console.log("Adding tutorial to index:", tutorial);
      tutorials_index.addDocToIndex(tutorial);
    });

    // console.log("All docs in index:", tutorials_index.getAllDocs());
  } catch (error) {
    console.error("Error fetching or indexing tutorials:", error);
  }
};

export const searchFromTutorialsIndex = query => {
  const results = tutorials_index.searchFromIndex(query);
  // console.log("searchFromIndex", query, results);
  return results;
};

// Gets all the tutorials with this user having edit access
export const getUserTutorialsBasicData =
  user_handle => async (firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_USER_TUTORIALS_BASIC_START });
      let index = [];
      const userTutorialsQuerySnapshot = await firestore
        .collection("tutorials")
        .where("editors", "array-contains", user_handle)
        .get();

      if (userTutorialsQuerySnapshot.empty) {
        index = [];
      } else {
        index = userTutorialsQuerySnapshot.docs.map(doc => {
          const new_doc = {
            owner: user_handle,
            tutorial_id: doc.id,
            title: doc.get("title") || "",
            summary: doc.get("summary") || "",
            featured_image: doc.get("featured_image") || "",
            icon: doc.get("icon") || "",
            isPublished: doc.get("isPublished") || false
          };

          tutorials_index.addDocToIndex(new_doc);
          return new_doc;
        });
      }

      dispatch({
        type: actions.GET_USER_TUTORIALS_BASIC_SUCCESS,
        payload: { owner: user_handle, tutorials: index }
      });
    } catch (e) {
      dispatch({
        type: actions.GET_USER_TUTORIALS_BASIC_FAIL,
        payload: e.message
      });
    }
  };

// Gets the basic data of all the tutorials of the organizations that the user is a part of
export const getOrgTutorialsBasicData =
  organizations => async (firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_ORG_TUTORIALS_BASIC_START });
      let index = [];

      const getFinalData = async handle => {
        let temp_array;
        const orgTutorialsQuerySnapshot = await firestore
          .collection("tutorials")
          .where("owner", "==", handle)
          .get();

        if (orgTutorialsQuerySnapshot.empty) {
          temp_array = [];
        } else {
          temp_array = orgTutorialsQuerySnapshot.docs.map(doc => {
            const new_doc = {
              owner: handle,
              tutorial_id: doc.id,
              title: doc.get("title") || "",
              summary: doc.get("summary") || "",
              featured_image: doc.get("featured_image") || "",
              icon: doc.get("icon") || ""
            };
            tutorials_index.addDocToIndex(new_doc);
            return new_doc;
          });
        }

        return temp_array;
      };

      if (organizations.length > 0) {
        const promises = organizations.map(async org_handle => {
          const tutorials = await getFinalData(org_handle);
          return {
            owner: org_handle,
            tutorials
          };
        });

        index = await Promise.all(promises);
      }

      dispatch({
        type: actions.GET_ORG_TUTORIALS_BASIC_SUCCESS,
        payload: index.flat()
      });
    } catch (e) {
      dispatch({
        type: actions.GET_ORG_TUTORIALS_BASIC_FAIL,
        payload: e.message
      });
    }
  };

export const clearTutorialsBasicData = () => dispatch =>
  dispatch({ type: actions.CLEAR_TUTORIALS_BASIC_STATE });

export const createTutorial =
  tutorialData => async (firebase, firestore, dispatch, history) => {
    try {
      dispatch({ type: actions.CREATE_TUTORIAL_START });
      const { title, summary, owner, created_by, is_org, tags } = tutorialData;

      const setData = async () => {
        const document = firestore.collection("tutorials").doc();

        const documentID = document.id;
        const step_id = `${documentID}_${new Date().getTime()}`;

        await document.set({
          created_by,
          editors: [created_by],
          isPublished: false,
          owner,
          summary,
          title,
          tutorial_id: documentID,
          featured_image: "",
          icon: "",
          tut_tags: tags,
          url: "",
          bookmarked:false,
          background_color: "#ffffff",
          text_color: "#000000",
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp()
        });

        // Adds first step when a tutorial is created
        await addNewTutorialStep({
          owner,
          tutorial_id: documentID,
          title: "Step One",
          time: 5,
          id: step_id
        })(firebase, firestore, dispatch);

        return documentID;
      };

      await updateTagFrequencies(tags)(firebase, firestore);

      if (is_org) {
        const documentID = await setData("organization");
        history.push(`/tutorials/${owner}/${documentID}`);
      } else {
        const documentID = await setData("user");
        history.push(`/tutorials/${owner}/${documentID}`);
      }
      dispatch({ type: actions.CREATE_TUTORIAL_SUCCESS });
    } catch (e) {
      console.error("CREATE_TUTORIAL_FAIL", e);
      dispatch({ type: actions.CREATE_TUTORIAL_FAIL, payload: e.message });
    }
  };

export const updateTagFrequencies = (tags) => async (firebase, firestore) => {
  const tagCollectionRef = firestore.collection('tag_frequencies')

  for (const tag of tags) {
    const tagDocRef = tagCollectionRef.doc(tag);
    await firestore.runTransaction(async (transaction) => {
      const tagDoc = await transaction.get(tagDocRef);
      if (tagDoc.exists) {
        const newCount = (tagDoc.data().count || 0) + 1;
        transaction.update(tagDocRef, { count: newCount });
      } else {
        transaction.set(tagDocRef, { count: 1 });
      }
    });
  }
};

export const getTutorialsByTopTags = (limit = 10) => async (firebase, firestore) => {
  const tutorialCollectionRef = firestore.collection('tutorials');
  const tagCollectionRef = firestore.collection('tag_frequencies');

  const tagSnapshot = await tagCollectionRef.orderBy('count', 'desc').limit(limit).get();
  const topTags = tagSnapshot.docs.map(doc => doc.id);
  // console.log("topTags", topTags);

  // Query tutorials that contain any of the top tags
  const tutorialSnapshot = await tutorialCollectionRef.where('tut_tags', 'array-contains-any', topTags).get();
  const tutorials = tutorialSnapshot.docs.map(doc => doc.data());

  return tutorials;
};

export const checkUserOrOrgHandle = handle => async (firebase, firestore) => {
  const userHandleExists = await checkUserHandleExists(handle)(firebase);
  const orgHandleExists = await checkOrgHandleExists(handle)(firestore);

  if (userHandleExists && !orgHandleExists) {
    return "user";
  } else if (!userHandleExists && orgHandleExists) {
    return "organization";
  } else {
    throw Error("Internal server error");
  }
};

export const getCurrentTutorialData =
  (owner, tutorial_id) => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_CURRENT_TUTORIAL_START });

      const tutorialDoc = await firestore
        .collection("tutorials")
        .doc(tutorial_id)
        .get();

      const stepsRef = firestore
        .collection("tutorials")
        .doc(tutorial_id)
        .collection("steps");

      const stepsQuerySnapshot = await stepsRef.get();
      const steps_obj = {};
      stepsQuerySnapshot.forEach(step => {
        steps_obj[step.id] = step.data();
        // console.log(step.id, step.data())
      });

      const steps = _.orderBy(
        Object.keys(steps_obj).map(step => steps_obj[step]),
        ["id"],
        ["asc"]
      );

      const tutorialData = {
        ...tutorialDoc.data(),
        steps: steps.filter(x => !x.deleted),
        tutorial_id
      };

      dispatch({
        type: actions.GET_CURRENT_TUTORIAL_SUCCESS,
        payload: tutorialData
      });

      return tutorialData;
    } catch (e) {
      console.log("GET_CURRENT_TUTORIAL_FAIL", e);
      window.location.href = "/";
      dispatch({ type: actions.GET_CURRENT_TUTORIAL_FAIL, payload: e.message });
      return null;
    }
  };

export const addNewTutorialStep =
  ({ owner, tutorial_id, title, time, id }) =>
    async (firebase, firestore, dispatch) => {
      try {
        dispatch({ type: actions.CREATE_TUTORIAL_STEP_START });

        await firestore
          .collection("tutorials")
          .doc(tutorial_id)
          .collection("steps")
          .doc(id)
          .set({
            content: `Switch to editor mode to begin <b>${title}</b> step`,
            id,
            time,
            title,
            visibility: true,
            deleted: false
          });

        await getCurrentTutorialData(owner, tutorial_id)(
          firebase,
          firestore,
          dispatch
        );

        dispatch({ type: actions.CREATE_TUTORIAL_STEP_SUCCESS });
      } catch (e) {
        console.log("CREATE_TUTORIAL_STEP_FAIL", e.message);
        dispatch({ type: actions.CREATE_TUTORIAL_STEP_FAIL, payload: e.message });
      }
    };

export const clearCreateTutorials = () => dispatch =>
  dispatch({ type: actions.CLEAR_CREATE_TUTORIALS_STATE });

export const getCurrentStepContentFromFirestore =
  (tutorial_id, step_id) => async (firestore, dispatch) => {
    try {
      const stepContent = await firestore
        .collection("tutorials")
        .doc(tutorial_id)
        .collection("steps")
        .doc(step_id)
        .get();

      dispatch({
        type: actions.SET_EDITOR_DATA,
        payload: stepContent.data().content
      });
    } catch (e) {
      console.log(e.message);
    }
  };

export const setCurrentStepContent =
  (tutorial_id, step_id, content) => async (firestore, dispatch) => {
    try {
      const stepDoc = firestore
        .collection("tutorials")
        .doc(tutorial_id)
        .collection("steps")
        .doc(step_id);

      await stepDoc.update({
        ["content"]: content,
        updatedAt: firestore.FieldValue.serverTimestamp()
      });

      dispatch({ type: actions.SET_EDITOR_DATA, payload: content });
    } catch (e) {
      console.log(e);
    }
  };

export const hideUnHideStep =
  (owner, tutorial_id, step_id, visibility) =>
    async (firebase, firestore, dispatch) => {
      try {
        /* not being used */
        // const type = await checkUserOrOrgHandle(owner)(firebase);
        await firestore
          .collection("tutorials")
          .doc(tutorial_id)
          .collection("steps")
          .doc(step_id)
          .update({
            [`visibility`]: !visibility,
            updatedAt: firestore.FieldValue.serverTimestamp()
          });

        await getCurrentTutorialData(owner, tutorial_id)(
          firebase,
          firestore,
          dispatch
        );
      } catch (e) {
        console.log(e.message);
      }
    };

export const publishUnpublishTutorial =
  (owner, tutorial_id, isPublished) =>
    async (firebase, firestore, dispatch) => {
      try {
        await firestore
          .collection("tutorials")
          .doc(tutorial_id)
          .update({
            ["isPublished"]: !isPublished
          });

        const { title, created_by } = await getCurrentTutorialData(
          owner,
          tutorial_id
        )(firebase, firestore, dispatch);

        if (!isPublished) {
          console.log("!isPublished", !isPublished);
          addNotification(
            tutorial_id,
            title,
            created_by,
            owner
          )(firebase, firestore, dispatch);
        }
      } catch (e) {
        console.log(e.message);
      }
    };

export const removeStep =
  (owner, tutorial_id, step_id, current_step_no) =>
    async (firebase, firestore, dispatch) => {
      try {
        await firestore
          .collection("tutorials")
          .doc(tutorial_id)
          .collection("steps")
          .doc(step_id)
          .delete();

        // const data = await firestore
        //   .collection("tutorials")
        //   .doc(tutorial_id)
        //   .collection("steps")
        //   .doc(step_id)
        //   .get();

        await setCurrentStepNo(
          current_step_no > 0 ? current_step_no - 1 : current_step_no
        )(dispatch);

        await getCurrentTutorialData(owner, tutorial_id)(
          firebase,
          firestore,
          dispatch
        );
      } catch (e) {
        console.log(e.message);
      }
    };

export const setCurrentStep = data => async dispatch =>
  dispatch({ type: actions.SET_EDITOR_DATA, payload: data });

export const setCurrentStepNo = data => async dispatch =>
  dispatch({ type: actions.SET_CURRENT_STEP_NO, payload: data });

export const uploadTutorialImages =
  (owner, tutorial_id, files) => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.TUTORIAL_IMAGE_UPLOAD_START });
      const type = await checkUserOrOrgHandle(owner)(firebase, firestore);
      const storagePath = `tutorials/${type}/${owner}/${tutorial_id}`;
      const dbPath = `tutorials`;
      await firebase.uploadFiles(storagePath, files, dbPath, {
        metadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
          return {
            imageURLs: firebase.firestore.FieldValue.arrayUnion({
              name: metadata.name,
              url: downloadURL
            })
          };
        },
        documentId: tutorial_id
      });

      await getCurrentTutorialData(owner, tutorial_id)(
        firebase,
        firestore,
        dispatch
      );

      dispatch({
        type: actions.TUTORIAL_IMAGE_UPLOAD_SUCCESS
      });
    } catch (e) {
      dispatch({
        type: actions.TUTORIAL_IMAGE_UPLOAD_FAIL,
        payload: e.message
      });
    }
  };

export const clearTutorialImagesReducer = () => dispatch =>
  dispatch({ type: actions.CLEAR_TUTORIAL_IMAGES_STATE });

export const remoteTutorialImages =
  (owner, tutorial_id, name, url) => async (firebase, firestore, dispatch) => {
    try {
      dispatch({
        type: actions.TUTORIAL_IMAGE_DELETE_START
      });
      const type = await checkUserOrOrgHandle(owner)(firebase, firestore);

      const storagePath = `tutorials/${type}/${owner}/${tutorial_id}/${name}`;
      const dbPath = `tutorials`;
      await firebase.deleteFile(storagePath);

      await firestore
        .collection(dbPath)
        .doc(tutorial_id)
        .update({
          imageURLs: firebase.firestore.FieldValue.arrayRemove({
            name,
            url
          })
        });

      await getCurrentTutorialData(owner, tutorial_id)(
        firebase,
        firestore,
        dispatch
      );

      dispatch({
        type: actions.TUTORIAL_IMAGE_DELETE_SUCCESS
      });
    } catch (e) {
      dispatch({
        type: actions.TUTORIAL_IMAGE_DELETE_FAIL,
        payload: e.message
      });
    }
  };

export const updateStepTitle =
  (owner, tutorial_id, step_id, step_title) =>
    async (firebase, firestore, dispatch) => {
      try {
        const dbPath = `tutorials/${tutorial_id}/steps`;
        await firestore
          .collection(dbPath)
          .doc(step_id)
          .update({
            [`title`]: step_title,
            updatedAt: firestore.FieldValue.serverTimestamp()
          });

        await getCurrentTutorialData(owner, tutorial_id)(
          firebase,
          firestore,
          dispatch
        );
      } catch (e) {
        console.log(e);
      }
    };

export const updateStepTime =
  (owner, tutorial_id, step_id, step_time) =>
    async (firebase, firestore, dispatch) => {
      try {
        const dbPath = `tutorials/${tutorial_id}/steps`;

        await firestore
          .collection(dbPath)
          .doc(step_id)
          .update({
            [`time`]: step_time,
            updatedAt: firestore.FieldValue.serverTimestamp()
          });

        await getCurrentTutorialData(owner, tutorial_id)(
          firebase,
          firestore,
          dispatch
        );
      } catch (e) {
        console.log(e.message);
      }
    };

export const setTutorialTheme =
  ({ tutorial_id, owner, bgColor, textColor }) =>
    async (firebase, firestore, dispatch) => {
      try {
        const dbPath = `tutorials`;

        await firestore.collection(dbPath).doc(tutorial_id).update({
          text_color: textColor,
          background_color: bgColor,
          updatedAt: firestore.FieldValue.serverTimestamp()
        });

        await getCurrentTutorialData(owner, tutorial_id)(
          firebase,
          firestore,
          dispatch
        );
      } catch (e) {
        console.log(e.message);
      }
    };

export const addNotification =
  (tutorial_id, tutorialTitle, created_by, owner) =>
    async (firebase, firestore, dispatch) => {
      try {
        dispatch({ type: actions.ADD_NOTIFICATION_START });

        const querySnapshot = await firestore
          .collection("notifications")
          .where("tutorial_id", "==", tutorial_id)
          .get();

        const isSubscribed = await isUserSubscribed(owner, firebase, firestore);

        if (querySnapshot.empty && isSubscribed) {
          const document = firestore.collection("notifications").doc();
          const documentID = document.id;

          const notification = {
            notification_id: documentID,
            content: `Posted new Tutorial ${tutorialTitle}. Learn the best practices followed in the industry in this tutorial.`,
            createdAt: firestore.FieldValue.serverTimestamp(),
            isRead: false,
            username: created_by,
            org: owner,
            tutorial_id
          };
          await document.set(notification);
        }
        dispatch({ type: actions.ADD_NOTIFICATION_SUCCESS });
      } catch (e) {
        console.error("ADD_NOTIFICATION_FAILED", e);
        dispatch({ type: actions.ADD_NOTIFICATION_FAILED, payload: e.message });
      }
    };

export const getNotificationData =
  () => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_NOTIFICATION_DATA_START });
      const notificationsSnapshot = await firestore
        .collection("notifications")
        .orderBy("createdAt", "desc")
        .get();

      const notifications = notificationsSnapshot.docs.map(doc => doc.data());

      dispatch({
        type: actions.GET_NOTIFICATION_DATA_SUCCESS,
        payload: notifications
      });
    } catch (e) {
      console.log(e);
      dispatch({
        type: actions.GET_NOTIFICATION_DATA_FAIL,
        payload: e.message
      });
    }
  };

export const readNotification =
  notification_id => async (firebase, firestore, dispatch) => {
    try {
      await firestore.collection("notifications").doc(notification_id).update({
        isRead: true
      });
      dispatch({ type: actions.READ_NOTIFICATION, payload: notification_id });
    } catch (e) {
      console.log(e.message);
    }
  };

export const deleteNotification =
  notification_id => async (firebase, firestore, dispatch) => {
    try {
      await firestore.collection("notifications").doc(notification_id).delete();
      dispatch({ type: actions.DELETE_NOTIFICATION, payload: notification_id });
    } catch (e) {
      console.log(e.message);
    }
  };

export const toggleTutorialBookmark = (tutorial_id, user_id) => async (firebase, firestore, dispatch) => {
  try {
    const userRef = firestore.collection("cl_user").doc(user_id);
    const userDoc = await userRef.get();
    
    const currBookmarkedArr = userDoc.exists && userDoc.data().bookmarked ? userDoc.data().bookmarked : [];

    const newBookmarkedArr = currBookmarkedArr.includes(tutorial_id)
      ? currBookmarkedArr.filter(id => id !== tutorial_id) // remove
      : [...currBookmarkedArr, tutorial_id]; // add

    await userRef.set({ bookmarked: newBookmarkedArr }, { merge: true });
    
  } catch (error) {
    console.error("TOGGLE_TUTORIAL_BOOKMARK_FAIL", error);
  }
};
  