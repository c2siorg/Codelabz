import React from "react";
import { Box, Grid, Avatar, Typography, Card } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  container: {
    padding: "16px",
    marginBottom: "5px"
  },
  bold: {
    fontWeight: "600"
  },
  profile: {
    display: "flex",
    gap: "5px",
    fontSize: "12px"
  }
}));

const Thumbnails = ({ tutorial }) => {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.container}>
        <Grid container direction="column" rowSpacing={1}>
          <Grid item className={classes.profile}>
            <Avatar sx={{ height: "22px", width: "22px", fontSize: "12px" }}>
              {tutorial?.created_by?.charAt(0) || "U"}
            </Avatar>
            <Typography>
              <span className={classes.bold}>
                {tutorial?.created_by || "Unknown"}
              </span>{" "}
              From{" "}
              <span className={classes.bold}>
                {tutorial?.owner || "Unknown"}
              </span>
            </Typography>
          </Grid>
          <Grid item container justifyContent="center">
            <Grid item container direction="column" xs={9}>
              <Grid item>
                <Typography sx={{ fontWeight: "600", fontSize: "11px" }}>
                  {tutorial?.summary || "No summary available"}
                </Typography>
              </Grid>
            </Grid>
            {/* <Grid item xs={3}>
              <img
                src="https://cdn-images-1.medium.com/v2/resize:fit:1080/1*SBH_Y5t32ixv8C_F1MVYzA.png"
                alt=""
              />
            </Grid> */}
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default Thumbnails;
