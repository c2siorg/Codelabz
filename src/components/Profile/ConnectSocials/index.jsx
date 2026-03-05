import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import GoogleImg from "../../../assets/orgs/google.png";
import GitHubIcon from "@mui/icons-material/GitHub";
const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import FacebookIcon from "@mui/icons-material/Facebook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useStyles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

const SocialButton = ({ Icon, isLinked, ...props }) => {
  const classes = useStyles();
  return (
    <Box
      {...props}
      className={`${classes.link} ${isLinked && classes.isLinked}`}
    >
      {Icon}
      <Typography className={classes.text}>
        {isLinked ? <CheckCircleIcon className={classes.isLinkedImg} /> : null}
      </Typography>
    </Box>
  );
};

const ConnectSocials = () => {
  const classes = useStyles();
  const firebase = useFirebase();
  const history = useHistory();

  const providerData = useSelector(
    ({
      firebase: {
        auth: { providerData }
      }
    }) => providerData
  );

  const isProviderLinked = provider =>
    providerData.some(item => item.providerId.includes(provider));

  const linkWithProvider = provider =>
    firebase
      .auth()
      .currentUser.linkWithPopup(provider)
      .then(() => {
        firebase.reloadAuth();
        history.go(0);
      })
      .catch(console.error);

  return (
    <Card className={classes.root} data-testId="socialMediaPage">
      <CardContent className={classes.content}>
        <Box className={classes.row} sx={{ marginBottom: 15 }}>
          <SocialButton
            isLinked={isProviderLinked("facebook")}
            onClick={() =>
              linkWithProvider(new firebase.auth.FacebookAuthProvider())
            }
            Icon={
              <>
                <FacebookIcon className={classes.fb}></FacebookIcon>
                <span className={classes.text}>Facebook</span>
              </>
            }
            data-testId="facebookButton"
          />

          <SocialButton
            isLinked={isProviderLinked("github")}
            onClick={() =>
              linkWithProvider(new firebase.auth.GithubAuthProvider())
            }
            Icon={
              <>
                <GitHubIcon className={classes.git}></GitHubIcon>
                <span className={classes.text}>Github</span>
              </>
            }
            data-testId="githubButton"
          />
        </Box>
        <Box className={classes.row}>
          <SocialButton
            isLinked={isProviderLinked("google")}
            onClick={() =>
              linkWithProvider(new firebase.auth.GoogleAuthProvider())
            }
            Icon={
              <>
                <img src={GoogleImg} alt="google" className={classes.button} />
                <span className={classes.text}>Google</span>
              </>
            }
            data-testId="googleButton"
          />
          <SocialButton
            isLinked={isProviderLinked("twitter")}
            onClick={() =>
              linkWithProvider(new firebase.auth.TwitterAuthProvider())
            }
            Icon={
              <>
                <XIcon className={classes.tw}></XIcon>
                <span className={classes.text}>X</span>
              </>
            }
            data-testId="twitterButton"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConnectSocials;
