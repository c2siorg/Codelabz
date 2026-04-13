import { Grid, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import ActivityList from "./ActivityList";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const activityListItems = [
  {
    id: 1,
    icon: LocalOfferIcon,
    text: "Featured"
  },
  {
    id: 2,
    icon: StarBorderIcon,
    text: "New"
  },
  {
    id: 3,
    icon: EmojiEventsIcon,
    text: "Top"
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    padding: "8px",
    alignItems: "center"
  }
}));

function Activity({ handleFeedChange }) {
  const classes = useStyles();
  const [List, setList] = useState(1);

  const handleToggle = useCallback(
    itemId => {
      setList(itemId);
      handleFeedChange(activityListItems[itemId - 1].text);
    },
    [handleFeedChange]
  );

  return (
    <React.Fragment>
      <Grid container data-testId="activityCard">
        <div className={classes.root}>
          <Grid item>
            <Typography variant="h6">Activity</Typography>
          </Grid>
          <Grid item>
            <ActivityList
              value={List}
              toggle={handleToggle}
              activityList={activityListItems}
            />
          </Grid>
        </div>
      </Grid>
    </React.Fragment>
  );
}

export default Activity;
