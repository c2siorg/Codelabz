import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import FollowerButton from "./FollowerButton";
import FollowingButton from "./FollowingButton";

export default function FollowersAndFollowings({
  initialFollowers = 0,
  initialFollowings = 0
}) {
  const profileData = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );
  const currentProfileData = useSelector(
    ({ firebase: { profile } }) => profile
  );
  const firestore = useFirestore();
  const [followersCount, setFollowersCount] = useState(initialFollowers);
  const [followingCount, setFollowingCount] = useState(initialFollowings);

  // Fetch followers and following data
  useEffect(() => {
    if (!profileData?.uid) return;

    const userDocUnsubscribe = firestore
      .collection("cl_user")
      .doc(profileData.uid)
      .onSnapshot(snap => {
        const data = snap.data();
        setFollowersCount(data?.followerCount || 0);
        setFollowingCount(data?.followingCount || 0);
      });

    return () => {
      userDocUnsubscribe();
    };
  }, [profileData, currentProfileData, firestore]);

  return (
    <React.Fragment>
      <Grid item container direction="row">
        <FollowerButton followersCount={followersCount} />
        <FollowingButton followingsCount={followingCount} />
      </Grid>
    </React.Fragment>
  );
}
