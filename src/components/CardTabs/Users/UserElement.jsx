import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import AddUser from "../../../assets/images/add-user.svg";
import CheckUser from "../../../assets/images/square-check-regular.svg";
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import {
  isUserFollower,
  addUserFollower,
  removeUserFollower
} from "../../../store/actions";

const UserElement = ({ user, index, useStyles }) => {
  const classes = useStyles();
  const firestore = useFirestore();

  const profileData = user;
  const currentProfileData = useSelector(
    ({ firebase: { profile } }) => profile
  );
  const followerId = currentProfileData.uid;
  const followingId = profileData.uid;
  const [followed, setFollowed] = useState(false);

  const handleFollowToggle = async () => {
    if (!followed) {
      await addUserFollower(currentProfileData, profileData, firestore);
    } else {
      await removeUserFollower(currentProfileData, profileData, firestore);
    }
    setFollowed(!followed);
  };

  useEffect(() => {
    const checkIfFollowing = async () => {
      const isFollowing = await isUserFollower(
        followerId,
        followingId,
        firestore
      );
      setFollowed(isFollowing);
    };

    checkIfFollowing();
  }, [followerId, followingId, firestore]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        key: "user" + { index },
        mb: 1.5
      }}
      gutterBottom
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          cursor: "pointer"
        }}
      >
        <img
          src={user.img[0]}
          className={classes.userImg}
          data-testId={index == 0 ? "UsersCardImg" : ""}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{ fontWeight: 600, fontSize: "1rem" }}
            data-testId={index == 0 ? "UserName" : ""}
          >
            {user.name}
          </Box>
          <Box
            sx={{ fontWeight: 400, fontSize: "0.8rem" }}
            data-testId={index == 0 ? "UserDesg" : ""}
          >
            {user.desg}
          </Box>
        </Box>
      </Box>
      <Box
        onClick={handleFollowToggle}
        data-testId={index == 0 ? "UserAdd" : ""}
        sx={{
          cursor: followed ? "default" : "pointer"
        }}
      >
        <img
          src={followed ? CheckUser : AddUser}
          alt={followed ? "Following" : "Add User"}
        />
      </Box>
    </Box>
  );
};

export default UserElement;
