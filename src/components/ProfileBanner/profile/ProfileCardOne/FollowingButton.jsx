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
import { getUserFollowings } from "../../../../store/actions/profileActions";
import { useFirestore } from "react-redux-firebase";
import { Close } from "@mui/icons-material";
import { useHistory } from "react-router-dom";

export default function FollowingButton({ followingsCount }) {
  const classes = useStyles();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const [followingsDialogOpen, setFollowingsDialogOpen] = useState(false);
  const profileData = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );
  const followings = profileData?.followings;
  const history = useHistory();

  useEffect(() => {
    if (followingsDialogOpen) {
      getUserFollowings(profileData.uid)(firestore, dispatch);
    }
  }, [followingsDialogOpen, firestore, dispatch]);

  return (
    <React.Fragment>
      <Grid
        item
        onClick={() => {
          if (followingsCount) setFollowingsDialogOpen(true);
        }}
      >
        <Typography
          className={classes.profileInfoData}
          style={{ marginRight: "20px" }}
          data-testId="user_profile_card_one_follwerCount"
        >
          {followingsCount} followings
        </Typography>
      </Grid>
      {/* Followers Dialog */}
      {followingsDialogOpen && (
        <Dialog
          open={followingsDialogOpen}
          onClose={() => setFollowingsDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Followings
            <IconButton
              onClick={() => setFollowingsDialogOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center" }}>
            {followings?.loading && <CircularProgress />}
            {followings?.error && (
              <Typography>Something went wrong.</Typography>
            )}
            {followings?.data && (
              <List>
                {followings.data.map(follower => (
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
