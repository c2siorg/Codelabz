import React from "react";
import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import LinkIcon from "@mui/icons-material/Link";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  icon: {
    justifyContent: "space-around"
  },
  facebookIcon: {
    color: "#4267B2"
  },
  twitterIcon: {
    color: "#000000"
  },
  linkedInIcon: {
    color: "0077B5"
  },
  blackIcon: {
    color: "#212121"
  }
}));

export default function SocialIcons(props) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActions className={classes.icon} disableSpacing>
        <IconButton
          color="primary"
          aria-label="share"
          data-testId="FacebookIcon"
        >
          <FacebookIcon className={classes.facebookIcon} />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="share"
          data-testId="LinkedInIcon"
        >
          <LinkedInIcon className={classes.linkedInIcon} />
        </IconButton>
        <IconButton aria-label="share" data-testId="GithubIcon">
          <GitHubIcon className={classes.blackIcon} />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="add to favorites"
          data-testId="TwitterIcon"
        >
          <XIcon className={classes.twitterIcon} />
        </IconButton>
        <IconButton aria-label="share" data-testId="LinkIcon">
          <LinkIcon className={classes.blackIcon} />
        </IconButton>
      </CardActions>
    </Card>
  );
}
