import React from "react";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import GoogleImg from "../../../assets/orgs/google.png";
import GitHubIcon from "@mui/icons-material/GitHub";
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import useStyles from "./styles";
import OrganizationData from "../../../temp_data/Organizations.json";

const Organizations = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card} data-testId="organizationsPage">
      <CardContent className={classes.content}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box className={classes.left} data-testId="organizations">
            <Box className={classes.column}>
              <img
                src={GoogleImg}
                alt="google"
                // onClick={() => signInWithGoogle()(firebase, dispatch)}
                className={classes.googleIcon}
              />
              <GitHubIcon className={classes.git}>
                <span className="sm-text">Github</span>
              </GitHubIcon>
              <XIcon>
                <span className="sm-text">X</span>
              </XIcon>
            </Box>
            <Box className={classes.organizations} style={{ margin: "1px 0" }}>
              {OrganizationData.map(el => (
                <Typography key={el.organization} className={classes.organization}>
                  {el.organization}
                </Typography>
              ))}
            </Box>
            <Box className={classes.column} style={{ padding: "4px 0" }}>
              {OrganizationData.map(el => (
                <Typography key={el.role} className={classes.role}>{el.role}</Typography>
              ))}
            </Box>
          </Box>
          <Box className={classes.right}>
            <Box className={classes.column} data-testId="settings">
              <Button className={classes.button}>Settings</Button>
              <Button className={classes.button}>Settings</Button>
              <Button className={classes.button}>Settings</Button>
            </Box>
            <Box className={classes.column} data-testId="leave">
              <Button
                className={classes.button}
                style={{ background: "red", color: "white" }}
              >
                Leave
              </Button>
              <Button
                className={classes.button}
                style={{ background: "red", color: "white" }}
              >
                Leave
              </Button>
              <Button
                className={classes.button}
                style={{ background: "red", color: "white" }}
              >
                Leave
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Organizations;
