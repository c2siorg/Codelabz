import React, { useState, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import firebase from "../../config/index";

const TutorialLikesDislikes = ({ tutorial_id }) => {
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

    const tutorialDocRef = db.collection("tutorials").doc(tutorial_id);
    const userChoiceRef = db
      .collection("tutorial_likes")
      .doc(`${tutorial_id}_${userId}`);

    // Fetch initial data and set up real-time listeners
    const fetchData = async () => {
      try {
        const tutorialDoc = await tutorialDocRef.get();
        if (!tutorialDoc.exists) {
          throw new Error("Tutorial not found");
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
          .collection("tutorial_likes")
          .where("tut_id", "==", tutorial_id)
          .where("value", "==", 1)
          .onSnapshot(snapshot => {
            setUpVotes(snapshot.size);
            tutorialDocRef.update({ upVotes: snapshot.size });
          });

        const unsubscribeDislikes = db
          .collection("tutorial_likes")
          .where("tut_id", "==", tutorial_id)
          .where("value", "==", -1)
          .onSnapshot(snapshot => {
            setDownVotes(snapshot.size);
            tutorialDocRef.update({ downVotes: snapshot.size });
          });

        // Cleanup function to unsubscribe from listeners when component unmounts
        return () => {
          unsubscribeLikes();
          unsubscribeDislikes();
        };
      } catch (error) {
        console.error("Error fetching tutorial data:", error);
      }
    };

    fetchData();
  }, [tutorial_id, db]);

  const handleUserChoice = async (event, newChoice) => {
    if (userChoice === newChoice) return;

    const userId = firebase.auth().currentUser?.uid;
    if (!userId) return;

    try {
      const userChoiceRef = db
        .collection("tutorial_likes")
        .doc(`${tutorial_id}_${userId}`);

      if (newChoice) {
        const value = newChoice === "like" ? 1 : -1;
        await userChoiceRef.set(
          { uid: userId, tut_id: tutorial_id, value },
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
      <ToggleButton value="like" aria-label="like">
        <ThumbUp />
        <Typography variant="body2">{upVotes}</Typography>
      </ToggleButton>
      <ToggleButton value="dislike" aria-label="dislike">
        <ThumbDown />
        <Typography variant="body2">{downVotes}</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default TutorialLikesDislikes;
