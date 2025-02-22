import React, { useEffect, useState } from "react";
import useStyles from "./styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem
} from "@mui/material";

// import dp from "../../../../assets/images/demoperson1.jpeg";
import iconbuttonImage from "../../../../assets/images/Filled3dots.svg";
import { Link } from "react-router-dom";
import { addUserFollower, removeUserFollower } from "../../../../store/actions";
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { Close } from "@mui/icons-material";
import { ListItem } from "quill-delta-to-html";

function FollowerFollowing({ initialFollowers = 0, initialFollowings = 0 }) {
  const classes = useStyles();
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
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);

  // Fetch followers and following data
  useEffect(() => {
    if (!profileData?.uid) return;

    const userDocUnsubscribe = firestore
      .collection("cl_user")
      .doc(profileData.uid)
      .onSnapshot(snap => {
        const data = snap.data();
        setFollowersCount(data?.followerCount);
        setFollowingCount(data?.followingCount);
      });

    return () => {
      userDocUnsubscribe();
    };
  }, [profileData, currentProfileData, firestore]);

  return (
    <React.Fragment>
      <Grid item container direction="row">
        <Grid item>
          <span
            className={classes.profileInfoData}
            style={{ marginRight: "20px" }}
            data-testId="user_profile_card_one_follwerCount"
          >
            {followersCount} followers
          </span>
        </Grid>
        <Grid item>
          <span
            className={classes.profileInfoData}
            style={{ marginRight: "2px" }}
            data-testId="user_profile_card_one_followingCount"
          >
            {followingCount} following
          </span>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

function FollowUnfollowButton({ isFollowing: initialFollowingStatus }) {
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

export default function ProfileCardOne({
  profileImage,
  name,
  story,
  followers,
  following,
  isFollowing = true,
  showFollowButton = false
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        className={classes.profileRightTop}
        data-testId="user_profile_card_one"
      >
        <div className={classes.profileCover}>
          <div className={classes.profileInfo}>
            <div>
              <img
                className={classes.profileUserImg}
                src={profileImage}
                alt="Avatar"
                data-testId="user_profile_card_one_avatar"
              />
            </div>
            <div className={classes.profileUserConnect}>
              <Grid container spacing={1}>
                <Grid item>
                  <Typography
                    className={classes.profileInfoName}
                    data-testId="user_profile_card_one_name"
                  >
                    {name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    className={classes.profileInfoStory}
                    data-testId="user_profile_card_one_story"
                  >
                    {story}
                  </Typography>
                </Grid>
                <FollowerFollowing
                  initialFollowers={followers}
                  initialFollowings={following}
                />
              </Grid>
              <Grid
                item
                container
                style={{ marginTop: "15px" }}
                data-testId="user_profile_card_one_buttonGroup"
              >
                {showFollowButton ? (
                  <FollowUnfollowButton isFollowing={isFollowing} />
                ) : null}

                <button className={classes.profileShareButton}>Share</button>
                <button className={classes.profileReportButton}>Report</button>
                <button
                  className={classes.profileIconButton}
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <img src={iconbuttonImage} alt="iconbutton" />
                </button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button"
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                  }}
                >
                  <Link to="/user-dashboard/settings">
                    <MenuItem onClick={handleClose}>User Settings</MenuItem>
                  </Link>
                </Menu>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
