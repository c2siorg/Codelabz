import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { addUserFollower, removeUserFollower } from "../../../../store/actions";
import { Button } from "@mui/material";

export function FollowUnfollowButton({ isFollowing: initialFollowingStatus }) {
  const [followDisable, setFollowDisable] = useState(false);
  const profileData = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );
  const [isFollowing, setIsFollowing] = useState(initialFollowingStatus);
  const currentProfileData = useSelector(
    ({ firebase: { profile } }) => profile
  );

  const firestore = useFirestore();
  const addFollower = async e => {
    e.preventDefault();
    setFollowDisable(true);
    await addUserFollower(currentProfileData, profileData, firestore);
    setIsFollowing(true);
    setFollowDisable(false);
  };

  const removeFollower = async e => {
    e.preventDefault();
    setFollowDisable(true);
    await removeUserFollower(currentProfileData, profileData, firestore);
    setIsFollowing(false);
    setFollowDisable(false);
  };
  return (
    <Button
      variant={isFollowing ? "outlined" : "contained"}
      onClick={isFollowing ? removeFollower : addFollower}
      disabled={followDisable}
      startIcon={isFollowing ? null : null}
      data-testId="user_profile_card_one_buttonGroup_followButton"
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
