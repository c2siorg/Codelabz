import React, { useState, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import firebase from "../../config/index";

const CommentLikesDislikes = ({ comment_id }) => {
  const [userChoice, setUserChoice] = useState(null);
  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);
  const db = firebase.firestore();

  useEffect(() => {
    const userId = firebase.auth().currentUser?.uid;

    if (!userId) {
      // User not authenticated
      return;
    }

    const commentDocRef = db.collection("cl_comments").doc(comment_id);
    const userChoiceRef = db
      .collection("comment_likes")
      .doc(`${comment_id}_${userId}`);

    // Fetch initial data and set up real-time listeners
    const fetchData = async () => {
      try {
        const commentDoc = await commentDocRef.get();
        if (!commentDoc.exists) {
          throw new Error("Comment not found");
        }

        // Fetch existing choice of user (if any)
        const userChoiceDoc = await userChoiceRef.get();
        if (userChoiceDoc.exists) {
          const existingChoice = userChoiceDoc.data().value;
          setUserChoice(existingChoice === 1 ? "like" : "dislike");
        } else {
          setUserChoice(null);
        }

        // Subscribe to real-time updates for likes and dislikes
        const unsubscribeLikes = db
          .collection("comment_likes")
          .where("comment_id", "==", comment_id)
          .where("value", "==", 1)
          .onSnapshot(snapshot => {
            setUpVotes(snapshot.size);
            commentDocRef.update({ upVotes: snapshot.size });
          });

        const unsubscribeDislikes = db
          .collection("comment_likes")
          .where("comment_id", "==", comment_id)
          .where("value", "==", -1)
          .onSnapshot(snapshot => {
            setDownVotes(snapshot.size);
            commentDocRef.update({ downVotes: snapshot.size });
          });

        // Cleanup function to unsubscribe from listeners when component unmounts
        return () => {
          unsubscribeLikes();
          unsubscribeDislikes();
        };
      } catch (error) {
        console.error("Error fetching comment data:", error);
      }
    };

    fetchData();
  }, [comment_id, db]);

  const handleUserChoice = async (event, newChoice) => {
    if (userChoice === newChoice) return;

    const userId = firebase.auth().currentUser?.uid;
    if (!userId) return;

    try {
      const userChoiceRef = db
        .collection("comment_likes")
        .doc(`${comment_id}_${userId}`);

      if (newChoice) {
        const value = newChoice === "like" ? 1 : -1;
        await userChoiceRef.set(
          { uid: userId, comment_id, value },
          { merge: true }
        );
      } else {
        await userChoiceRef.delete();
      }

      setUserChoice(newChoice);
    } catch (error) {
      console.error("Error setting user choice:", error);
    }
  };

  return (
    <ToggleButtonGroup
      size="small"
      value={userChoice}
      exclusive
      onChange={handleUserChoice}
      aria-label="like dislike"
    >
      <ToggleButton
        style={{
          display: "flex",
          gap: "4px"
        }}
        value="like"
        aria-label="like"
      >
        <ThumbUp />
        <Typography variant="body2">{upVotes}</Typography>
      </ToggleButton>
      <ToggleButton
        style={{
          display: "flex",
          gap: "4px"
        }}
        value="dislike"
        aria-label="dislike"
      >
        <ThumbDown />
        <Typography variant="body2">{downVotes}</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default CommentLikesDislikes;
