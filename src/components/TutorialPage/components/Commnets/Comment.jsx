import {
  Grid,
  Typography,
  Avatar,
  Button,
  IconButton,
  Paper
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CardActions from "@mui/material/CardActions";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from "react";
import Textbox from "./Textbox";
import User from "../UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import {
  getCommentData,
  getCommentReply,
  addComment
} from "../../../../store/actions/tutorialPageActions";
import CommentLikesDislikes from "../../../ui-helpers/CommentLikesDislikes";
import * as actions from "../../../../store/actions/actionTypes";

const useStyles = makeStyles(() => ({
  container: {
    margin: "10px 0",
    padding: "20px",
    overflow: "unset"
  },
  bold: {
    fontWeight: "600"
  },
  comments: {
    margin: "5px",
    padding: "10px 15px"
  },
  settings: {
    flexWrap: "wrap",
    marginTop: "-10px",
    padding: "0 5px"
  },
  small: {
    padding: "2px"
  }
}));

const Comment = ({ id }) => {
  const classes = useStyles();
  const [showReplyfield, setShowReplyfield] = useState(false);
  const [count, setCount] = useState(1);
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  useEffect(() => {
    getCommentData(id)(firebase, firestore, dispatch);
  }, [id]);

  const commentsArray = useSelector(
    ({
      tutorialPage: {
        comment: { data }
      }
    }) => data
  );

  const userHandle = useSelector(
    ({
      firebase: {
        profile: { handle }
      }
    }) => handle
  );

  const [data] = commentsArray.filter(comment => comment.comment_id == id);

  const repliesArray = useSelector(
    ({
      tutorialPage: {
        comment: { replies }
      }
    }) => replies
  );

  const [replies] = repliesArray.filter(replies => replies.comment_id == id);
  const handleSubmit = async comment => {
    const commentData = {
      content: comment,
      replyTo: data.comment_id,
      tutorial_id: data.tutorial_id,
      createdAt: firestore.FieldValue.serverTimestamp(),
      userId: userHandle
    };
    const commentId = await addComment(commentData)(
      firebase,
      firestore,
      dispatch
    );
    if (commentId) {
      const newRepliesArray = repliesArray.map(reply => {
        if (reply.comment_id === id) {
          return {
            ...reply,
            replies: [...reply.replies, commentId]
          };
        }
        return reply;
      });
      dispatch({
        type: actions.ADD_REPLIES_SUCCESS,
        payload: newRepliesArray
      });
    }
  };
  return (
    data && (
      <>
        <Paper variant="outlined" className={classes.comments}>
          <Typography mb={1} sx={{ fontSize: "18px" }}>
            {data?.content}
          </Typography>
          <Grid container justifyContent="space-between">
            <User id={data?.userId} timestamp={data?.createdAt} size={"sm"} />
            <CardActions className={classes.settings} disableSpacing>
              {!showReplyfield && (
                <Button
                  onClick={() => {
                    setShowReplyfield(true);
                    getCommentReply(id)(firebase, firestore, dispatch);
                  }}
                  sx={{ textTransform: "none", fontSize: "12px" }}
                >
                  {replies?.replies?.length > 0
                    ? replies?.replies?.length
                    : data?.no_of_replies}{" "}
                  Reply
                </Button>
              )}
              <CommentLikesDislikes comment_id={data.comment_id} />
              <IconButton aria-label="share" data-testId="MoreIcon">
                <MoreVertOutlinedIcon />
              </IconButton>
            </CardActions>
          </Grid>
        </Paper>
        {showReplyfield && (
          <div style={{ margin: "10px 0 0 10px" }}>
            <Textbox type="reply" handleSubmit={handleSubmit} />
            {replies?.replies.map((id, index) => {
              return <Comment key={index} id={id} />;
            })}
          </div>
        )}
      </>
    )
  );
};

export default Comment;
