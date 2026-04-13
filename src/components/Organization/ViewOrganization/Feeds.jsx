import { Box, Divider, Grid } from "@mui/material";
import React, { useCallback, useState } from "react";

import ActivityList from "../../Topbar/Activity/ActivityList";
import { makeStyles } from "@mui/styles";
import { userList } from "../../HomePage/userList";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CardWithoutPicture from "../../Card/CardWithoutPicture";

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
  postCard: {
    width: "100%"
  }
}));

function Feeds() {
  const [List, setList] = useState(1);

  const classes = useStyles();

  const handleToggle = useCallback(itemId => {
    setList(itemId);
  }, []);
  return (
    <>
      <Divider width={"90%"}></Divider>
      <Box sx={{ marginBottom: "20px", marginTop: "20px" }}>
        <ActivityList
          value={List}
          toggle={handleToggle}
          activityList={activityListItems}
        />
      </Box>
      <Grid container spacing={3}>
        {userList.persons.map((person, index) => (
          <Grid item xs={12} key={`${person.name}-${person.title}-${index}`}>
            <CardWithoutPicture
              className={classes.postCard}
              name={person.name}
              title={person.title}
              contentDescription={person.description}
              tags={person.tags}
              profilePic={person.profilePic}
              organizationName={person.org}
              date={person.date}
              time={person.time}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Feeds;
