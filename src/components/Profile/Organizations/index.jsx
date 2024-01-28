import React from "react";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import GoogleImg from "../../../assets/orgs/google.png";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import useStyles from "./styles";
import OrganizationData from "../../../temp_data/Organizations.json";
import { useSelector } from "react-redux";

const Organizations = () => {
  const classes = useStyles();
  const currentProfileData = useSelector(
    ({ firebase: { profile } }) => profile
  );

  return (
    <Card className={classes.card} data-testId="organizationsPage">
      <CardContent className={classes.content}>
        <Box className={classes.content} sx={{ display: "flex", justifyContent: "space-between" }}>
            {currentProfileData.organizations.map((role, index) => (
              <Box className={classes.content} sx={{ display: "flex", justifyContent: "space-between" }} key={index}>
                <Box className={classes.left} style={{justifyContent: "flex-start" }} data-testId="organizations">
                  <Box className={classes.column}>
                    <img
                      src={GoogleImg}
                      alt="google"
                      // onClick={() => signInWithGoogle()(firebase, dispatch)}
                      className={classes.googleIcon}
                      style={{marginRight : "40px"}}
                    />
                  </Box>
                  <Box className={classes.organizations} style={{ margin: "1px 0",marginRight : "40px" }}>
                    <Typography className={classes.organization}>{role}</Typography>
                  </Box>
                  <Box className={classes.column} style={{ padding: "4px 0",marginRight : "40px" }}>
                    <Typography className={classes.role}>Owner</Typography>
                  </Box>
                </Box>
                <Box className={classes.right}>
                </Box>  
                <Box className={classes.right}>
                </Box>

                <Box className={classes.right} >
                  <Box className={classes.column} data-testId="settings">
                    <Button className={classes.button}>Settings</Button>
                  </Box>
                  <Box className={classes.column} data-testId="leave">
                    <Button
                      className={classes.button}
                      style={{ background: "red", color: "white" }}
                    >
                      Leave
                    </Button>
                  </Box>
                </Box>
              </Box>
              
            ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Organizations;
