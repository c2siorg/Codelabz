import React from "react";
import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
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
    color: "#1DA1F2"
  },
  linkedInIcon: {
    color: "0077B5"
  },
  blackIcon: {
    color: "#212121"
  }
}));

export default function SocialIcons({ props }) {
  const classes = useStyles();
  // console.log(props.profileData)
  return (
    <Card className={classes.root}>
      <CardActions className={classes.icon} disableSpacing>
        <IconButton
          color="primary"
          aria-label="share"
          data-testId="FacebookIcon"
          href={`https://facebook.com/${props?.profileData.link_facebook}`}
          target="_blank"
        >
          <FacebookIcon className={classes.facebookIcon} />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="share"
          data-testId="LinkedInIcon"
          href={`https://linkedin.com/${props?.profileData.link_linkedin}`}
          target="_blank"
        >
          <LinkedInIcon className={classes.linkedInIcon} />
        </IconButton>
        <IconButton
          aria-label="share"
          data-testId="GithubIcon"
          href={`https://github.com/${props?.profileData.link_github}`}
          target="_blank"
        >
          <GitHubIcon className={classes.blackIcon} />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="add to favorites"
          data-testId="TwitterIcon"
          href={`https://twitter.com/${props?.profileData.link_twitter}`}
          target="_blank"
        >
          <TwitterIcon className={classes.twitterIcon} />
        </IconButton>
        <IconButton aria-label="share" data-testId="LinkIcon" href={`${props?.profileData.website}`}
          target="_blank">
          <LinkIcon className={classes.blackIcon} />
        </IconButton>
      </CardActions>
    </Card>
  );
}
