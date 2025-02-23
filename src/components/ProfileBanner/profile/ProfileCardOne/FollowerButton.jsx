import {
  Avatar,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useStyles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { getUserFollowers } from "../../../../store/actions/profileActions";
import { useFirestore } from "react-redux-firebase";
import { Close } from "@mui/icons-material";
import { useHistory } from "react-router-dom";

export default function FollowerButton({ followersCount }) {
  const classes = useStyles();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const profileData = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );
  const followers = profileData?.followers;
  const history = useHistory();

  useEffect(() => {
    if (followersDialogOpen) {
      getUserFollowers(profileData.uid)(firestore, dispatch);
    }
  }, [followersDialogOpen, firestore, dispatch]);

  return (
    <React.Fragment>
      <Grid
        item
        onClick={() => {
          if (followersCount) setFollowersDialogOpen(true);
        }}
      >
        <Typography
          className={classes.profileInfoData}
          style={{ marginRight: "20px" }}
          data-testId="user_profile_card_one_follwerCount"
        >
          {followersCount} followers
        </Typography>
      </Grid>
      {/* Followers Dialog */}
      {followersDialogOpen && (
        <Dialog
          open={followersDialogOpen}
          onClose={() => setFollowersDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Followers
            <IconButton
              onClick={() => setFollowersDialogOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center" }}>
            {followers?.loading && <CircularProgress />}
            {followers?.error && <Typography>Something went wrong.</Typography>}
            {followers?.data && (
              <List>
                {followers.data.map(follower => (
                  <ListItemButton
                    component="a"
                    href={`/user/${follower.handle}`}
                    key={follower.uid}
                    onClick={e => {
                      e.preventDefault();
                      history.push(`/user/${follower.handle}`);
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={follower.photoURL} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={follower.displayName}
                      secondary={"@" + follower.handle}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </DialogContent>
        </Dialog>
      )}
    </React.Fragment>
  );
}
