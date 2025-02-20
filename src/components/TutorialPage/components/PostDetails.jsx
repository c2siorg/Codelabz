import React, { useEffect, useState } from "react";
import { Card, Typography, Grid, Box, Chip, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import User from "./UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { getUserProfileData } from "../../../store/actions";
import { HashLink } from "react-router-hash-link";
import { useParams } from "react-router-dom";
import TutorialLikesDislikes from "../../ui-helpers/TutorialLikesDislikes";
const useStyles = makeStyles(() => ({
  container: {
    padding: "20px",
    boxSizing: "border-box"
  },
  settings: {
    flexWrap: "wrap",
    marginTop: "-10px",
    padding: "0 5px"
  },
  small: {
    padding: "2px"
  },
  chip: {
    marginLeft: "5px",
    fontWeight: "300",
    height: "20px"
  },
  bold: {
    fontWeight: "600"
  }
}));

const PostDetails = ({ details }) => {
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const { id } = useParams();

  useEffect(() => {
    getUserProfileData(details.user)(firebase, firestore, dispatch);
  }, [details]);

  const user = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );

  const getTime = timestamp => {
    return timestamp.toDate().toDateString();
  };

  const classes = useStyles();
  return (
    <>
      {details && (
        <Card className={classes.container}>
          <Grid>
            <Box>
              <Grid container columnSpacing={2} alignItems="center">
                <Grid item>
                  <Typography sx={{ fontWeight: "700", fontSize: "1.2rem" }}>
                    {details?.title}
                    {details?.tags?.map(tag => (
                      <Chip
                        label={tag}
                        variant="outlined"
                        className={classes.chip}
                      />
                    ))}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ width: "100%", marginTop: "10px" }}>
              <Grid container justifyContent="space-between" alignItems="end">
                <User id={details?.user} timestamp={details?.published_on} />

                <Grid item sx={{ width: "fit-content" }}>
                  <CardActions className={classes.settings} disableSpacing>
                    <TutorialLikesDislikes tutorial_id={details?.tutorial_id} />
                    <HashLink to={`/tutorial/${id}#comments`}>
                      <IconButton aria-label="share" data-testId="CommentIcon">
                        <ChatOutlinedIcon />
                      </IconButton>
                    </HashLink>
                    <IconButton
                      aria-label="add to favorites"
                      data-testId="ShareIcon"
                    >
                      <ShareOutlinedIcon />
                    </IconButton>
                    <IconButton aria-label="share" data-testId="NotifIcon">
                      <TurnedInNotOutlinedIcon />
                    </IconButton>
                    <IconButton aria-label="share" data-testId="MoreIcon">
                      <MoreVertOutlinedIcon />
                    </IconButton>
                  </CardActions>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Card>
      )}
    </>
  );
};

export default PostDetails;
