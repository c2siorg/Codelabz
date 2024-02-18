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
import ToggleButton from "@mui/lab/ToggleButton";
import ToggleButtonGroup from "@mui/lab/ToggleButtonGroup";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
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
import { init } from "lodash/fp";
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
    // padding: "10px 15px"
    padding: "25px",
  },
  replyComments: {
    margin: "5px",
    // padding:"25px",
    padding: "5px 10px",
    marginLeft: "auto",
    width: "85%",
    // height:"2rem !important",
  },
  settings: {
    flexWrap: "wrap",
    marginTop: "-10px",
    padding: "0 5px",
    height: "100%"
  },
  small: {
    padding: "2px"
  },

}));

const Comment = ({ id, isReply = false }) => {
  const classes = useStyles();
  const [showReplyfield, setShowReplyfield] = useState(false);
  const [replies, setReplies] = useState(null);
  const [alignment, setAlignment] = useState('left');
  const [count, setCount] = useState(1);
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [intialLoad, setInitialLoad] = useState(true)


  useEffect(() => {
    getCommentData(id)(firebase, firestore, dispatch);
  }, [id]);

  const commentsArray = useSelector(
    ({
      tutorialPage: {
        comment: { data },
      },
    }) => data
  );

  const [data] = commentsArray.filter((comment) => comment.comment_id == id);

  const repliesArray = useSelector(
    ({
      tutorialPage: {
        comment: { replies },
      },
    }) => replies
  );

  useEffect(() => {
    console.log("useEffect called")
    if (repliesArray && repliesArray.length > 0 && intialLoad) {
      const filteredReplies = repliesArray.filter(
        (reply) => reply.comment_id == id
      );
      if (filteredReplies.length > 0) {
        setReplies(filteredReplies[0].replies);
        setInitialLoad(false)
      }
    }
  }, [repliesArray]);

  const handleIncrement = () => {
    setCount(count + 1);
    setAlignment("right");
  };

  const handleDecrement = () => {
    setCount(count - 1);
    setAlignment("left");
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    const align=alignment === "right" ? "left" : "right";
    setAlignment(align)
    
  };
  const user = firebase.auth().currentUser;
  const handleSubmit = async (comment) => {
    const commentData = {
      content: comment,
      replyTo: data.comment_id,
      tutorial_id: data.tutorial_id,
      createdAt: firestore.FieldValue.serverTimestamp(),
      userId: user.uid,
    };
    const newReplies = await addComment("reply", commentData)(firebase, firestore, dispatch);
    setReplies(newReplies);

  };



  return (
    data && (
      <>
        <Paper variant="outlined" className={isReply ? classes.replyComments : classes.comments}>
          <Typography mb={1} sx={{ fontSize: '18px' }}>
            {data?.content}
          </Typography>
          <Grid container justifyContent="space-between">
            <User type={'comment'} id={user.uid} timestamp={data?.createdAt} size={'sm'} />
            <CardActions className={classes.settings} disableSpacing>
              <Button
                onClick={async () => {
                  setShowReplyfield(!showReplyfield);
                  getCommentReply(id)(firebase, firestore, dispatch);
                }}
                sx={{ textTransform: 'none', fontSize: '12px' }}
              >
                {showReplyfield ? "Hide Replies" : "Show Replies"}
              </Button>
              <ToggleButtonGroup
                size="small"
                className={classes.small}
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
              >
                <ToggleButton
                  className={classes.small}
                  onClick={handleIncrement}
                  disabled={alignment === "right"}
                  value="left"
                  aria-label="left aligned"
                >
                  <KeyboardArrowUpIcon />
                  <span>{count}</span>
                </ToggleButton>
                <ToggleButton
                  className={classes.small}
                  onClick={handleDecrement}
                  disabled={alignment === "left"}
                  value="right"
                  aria-label="right aligned"
                >
                  <KeyboardArrowDownIcon />
                </ToggleButton>
              </ToggleButtonGroup>
              <IconButton aria-label="share" data-testId="MoreIcon">
                <MoreVertOutlinedIcon />
              </IconButton>
            </CardActions>
          </Grid>
        </Paper>
        {showReplyfield ? (
          <div style={{ margin: '10px 0 0 10px' }}>
            <Textbox type="reply" handleSubmit={handleSubmit} />
            {replies && replies.length > 0 ? (
              replies.map((replyId, index) => (
                <Comment key={index} id={replyId} isReply={true} />
              ))
            ) : null}
          </div>
        ) : null}
      </>
    )
  );
};

export default Comment;