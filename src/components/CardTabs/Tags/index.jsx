import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { getAllTags } from "../../../store/actions";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    },
    marginBottom: "2rem",
    [theme.breakpoints.down("md")]: {
      marginBottom: theme.spacing(0),
      margin: "0.25rem"
    }
  },
  tagsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    maxHeight: '150px', // Set max height for responsiveness
    overflowY: 'auto', // Add vertical scrollbar when needed
    '&::-webkit-scrollbar': {
      width: '5px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: '5px',
    },
  },
  chip: {
    // margin: "0px 10px 10px 0px",
    margin: theme.spacing(0.5),
    borderRadius: "5px",
    cursor: "pointer"
  }
}));

const TagCard = ({ tags, onTagSelect }) => {
  const classes = useStyles();
  const [selectedTags, setSelectedTags] = useState([]);


  const handleTagClick = (tag) => {
    let newSelectedTags;
    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter(t => t !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }
    setSelectedTags(newSelectedTags);
    onTagSelect(newSelectedTags); 
  };

  return (
    <div className={classes.root} data-testId="TagsCard">
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            data-testId="TagsCardTitle"
          >
            Popular Tags
          </Typography>
          <div className={classes.tagsContainer}>
            {tags.map(function (tag, index) {
              return (
                <Chip
                  key={index}
                  size="small"
                  label={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  color={selectedTags.includes(tag.name) ? "primary" : "default"}
                  id={index}
                  className={classes.chip}
                  data-testId={index === 0 ? "TagsChip" : ""}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TagCard;
