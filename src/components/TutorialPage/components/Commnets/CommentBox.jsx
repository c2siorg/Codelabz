import { Card, Grid, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import Textbox from "./Textbox";
import Comment from "./Comment";

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

const CommentBox = ({ commentsArray, onAddComment }) => {
  const classes = useStyles();
  const [comments, setComments] = useState(commentsArray);
  const [currCommentCount, setCurrCommentCount] = useState(3);

  useEffect(() => {
    setComments(commentsArray?.slice(0, currCommentCount));
  }, [currCommentCount, commentsArray]);

  console.log(commentsArray, comments, currCommentCount);

  const increaseCommentCount = () => {
    setCurrCommentCount(state => state + 3);
  };

  return (
    <Card
      className={classes.container}
      id="comments"
      data-testId="tutorialpageComments"
    >
      <Typography variant="h5" sx={{ fontWeight: "600" }}>
        Comments({commentsArray?.length || 0})
      </Typography>
      <Textbox handleSubmit={onAddComment} />
      <Grid container rowSpacing={2}>
        {comments?.map((id, index) => {
          return (
            <Grid item xs={12} key={index}>
              <Comment id={id} />
            </Grid>
          );
        })}
        <Grid item container justifyContent="center">
          {comments?.length < commentsArray?.length && (
            <Button
              sx={{ textTransform: "none", fontSize: "14px" }}
              onClick={increaseCommentCount}
            >
              + Load More
            </Button>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default CommentBox;
