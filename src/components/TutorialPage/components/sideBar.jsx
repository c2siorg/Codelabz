import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import Thumbnails from "./Thumbnails";
import { makeStyles } from "@mui/styles";
import { getRecommendedTutorials } from "../../../store/actions";
import { useFirebase, useFirestore } from "react-redux-firebase";

const useStyles = makeStyles(() => ({
  container: {
    position: "relative"
  },
  load: {
    position: "absolute",
    display: "flex",
    alignItems: "end",
    justifyContent: "center",
    left: "0",
    bottom: "-1px",
    width: "100%",
    height: "100px",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)"
  }
}));
const SideBar = ({ currentTutorial }) => {
  const classes = useStyles();
  const [tutorials, setTutorials] = useState([]);
  const firebase = useFirebase();
  const firestore = useFirestore();

  useEffect(() => {
    const fetchRecommendedTutorials = async () => {
      try {
        const recommendedTutorials = await getRecommendedTutorials(
          currentTutorial?.tags
        )(firebase, firestore);
        setTutorials(
          recommendedTutorials.filter(
            tutorial => tutorial.tutorial_id !== currentTutorial?.id
          )
        );
      } catch (error) {
        console.error("Error fetching recommended tutorials:", error);
      }
    };

    fetchRecommendedTutorials();
  }, [currentTutorial?.tags]);

  return (
    <>
      <Box className={classes.container}>
        {/* <div className={classes.load}>
          <Button sx={{ textTransform: "none" }}>Show More &darr;</Button>
        </div> */}
        <Grid container direction="column">
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "600",
              textAlign: "center",
              margin: "15px 0 10px"
            }}
          >
            More From Codelabz
          </Typography>
          {tutorials.length > 0 &&
            tutorials.map((tutorial, index) => (
              <Thumbnails key={index} tutorial={tutorial} />
            ))}
        </Grid>
      </Box>
      <Box className={classes.container}>
        {/* <div className={classes.load}>
          <Button sx={{ textTransform: "none" }}>Show More &darr;</Button>
        </div>
        <Grid container direction="column">
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "600",
              textAlign: "center",
              margin: "15px 0 10px"
            }}
          >
            More On GIT
          </Typography>
          <Thumbnails />
          <Thumbnails />
          <Thumbnails />
        </Grid> */}
      </Box>
    </>
  );
};

export default SideBar;
