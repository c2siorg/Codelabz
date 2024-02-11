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
  addComment,
  upvoteTutorial,
  downvoteTutorial
} from "../../../../store/actions/tutorialPageActions";
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
  // console.log(id);
  const classes = useStyles();
  const [showReplyfield, setShowReplyfield] = useState(false);
  const [alignment, setAlignment] = React.useState("left");
  const [count, setCount] = useState(0);
  const[flag,setFlag]=useState(false);
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  useState(() => {
    getCommentData(id)(firebase, firestore, dispatch);
  }, [id]);

  const commentsArray = useSelector(
    ({
      tutorialPage: {
        comment: { data }
      }
    }) => data
  );
  // console.log(commentsArray);

  const [data] = commentsArray.filter(comment => comment.comment_id == id);
  // console.log(data);
 

  const repliesArray = useSelector(
    ({
      tutorialPage: {
        comment: { replies }
      }
    }) => replies
  );


  const profileData = useSelector(({ firebase: { profile } }) => profile);
  // console.log(profileData);

  const [replies] = repliesArray.filter(replies => replies.comment_id == id);

  const handleIncrement = () => {
    upvoteTutorial(id,profileData.uid)(firebase,firestore,dispatch);
    if(data.downvoters && data.downvoters.includes(profileData.uid)){
      setCount(prev=>prev+2);
    data.downvoters=  data.downvoters.filter((id)=>id!==profileData.uid);
      data.upvoters.push(profileData.uid);
      return;
    }
    else if(data.upvoters && data.upvoters.includes(profileData.uid)){
      setCount(prev=>prev-1)
      data.upvoters = data.upvoters.filter(id => id !== profileData.uid);
     
      return;
    }
    setCount(prev=>prev+1);
    if(data.upvoters==undefined){
      data.upvoters=[];
    }
    data.upvoters.push(profileData.uid);
    
  };

  const handleDecrement = () => {
    downvoteTutorial(id,profileData.uid)(firebase,firestore,dispatch);
    if(data.downvoters && data.downvoters.includes(profileData.uid)){
      setCount(prev=>prev+1);
    data.downvoters=  data.downvoters.filter((id)=>id!==profileData.uid);
     
      return;
    }
    else if(data.upvoters && data.upvoters.includes(profileData.uid)){
      setCount(prev=>prev-2)
    data.upvoters=  data.upvoters.filter((id)=>id!==profileData.uid);
      data.downvoters.push(profileData.uid);

      return;
    }
    if(data.downvoters==undefined){
      data.downvoters=[]
    }
    setCount(prev=>prev-1);
    data.downvoters.push(profileData.uid);
    
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleSubmit = comment => {
    const commentData = {
      content: comment,
      replyTo: data.comment_id,
      tutorial_id: data.tutorial_id,
      createdAt: firestore.FieldValue.serverTimestamp(),
      userId: "codelabzuser"
    };
    addComment(commentData)(firebase, firestore, dispatch);
  };

  useEffect(()=>{
    
    const [data1]=commentsArray.filter(comment => comment.comment_id == id);
    setCount((data1?.upvotes?data1.upvotes:0)-(data1?.downvotes?data1.downvotes:0));
  },[commentsArray,flag]);

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
                  {replies?.replies?.length > 0 && replies?.replies?.length}{" "}
                  Reply
                </Button>
              )}
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
                  value="left"
                  aria-label="left aligned"
                >
                  <KeyboardArrowUpIcon />
                  <span>{count}</span>
                </ToggleButton>
                <ToggleButton
                  className={classes.small}
                  onClick={handleDecrement}
                  value="center"
                  aria-label="centered"
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
        {showReplyfield && (
          <div style={{ margin: "10px 0 0 10px" }}>
            <Textbox type="reply" handleSubmit={handleSubmit} />
            {replies?.replies.map((id, index) => {
              return <Comment id={id} />;
            })}
          </div>
        )}
      </>
    )
  );
};

export default Comment;
