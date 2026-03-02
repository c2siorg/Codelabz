import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import GoogleImg from "../../../assets/orgs/google.png";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import useStyles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

const SocialButton = ({ Icon, isLinked, label, linkedUsername, ...props }) => {
  const classes = useStyles();
  return (
    <Box className={`${classes.link} ${isLinked ? classes.isLinked : ""}`}>
      <Box className={classes.iconWrap}>{Icon}</Box>
      <Box className={classes.textWrap}>
        <Typography className={classes.text}>{label}</Typography>
        <Typography className={classes.subText}>
          {isLinked && linkedUsername? `Linked as ${linkedUsername}`: subLabels[label]}
        </Typography>
      </Box>
      {isLinked? (
        <Box className={classes.linkedActions}>
          <CheckCircleIcon className={classes.checkIcon} />
          <LogoutIcon className={classes.unlinkIcon} {...props} />
        </Box>
      ) : (
        <Button
        variant="outlined"
        className={classes.connectBtn}
        {...props}
        >
          Connect
        </Button>
      )}
    </Box>
  );
};
// added prop validation so to avoid anything getting passed and optimize workflow
SocialButton.propTypes = {
  Icon: PropTypes.any,
  isLinked: PropTypes.Boolean,
  label: PropTypes.string,
  linkedUsername: PropTypes.string,
}
const subLabels = {
    Facebook: "Connect to find friends",
    GitHub: "Link your GitHub account",
    Google: "Primary login method",
    Twitter: "Link with Twitter",
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

  const getLinkedUsername = provider => {
    const providerItem = providerData.find(
      (item) => item.providerId === `${provider}.com`
    );
    return providerItem?.displayName || providerItem?.email || null;
  };
  const linkWithProvider = provider =>
    firebase
      .auth()
      .currentUser.linkWithPopup(provider)
      .then(() => {
        firebase.reloadAuth();
        history.go(0);
      })
      .catch(console.error);

  const unlinkProvider = provider =>
    firebase
      .auth()
      .currentUser.unlink(provider)
      .then(() => {
        firebase.reloadAuth();
      })
      .catch(console.error);

  const buttons = [{
    label: "Facebook",
    provider: () => new firebase.auth.FacebookAuthProvider(),
    providerKey: "facebook",
    icon: <FacebookIcon className={classes.fb} />,
    testId: "facebookButton",
  }, {
    label: "GitHub",
    provider: () => new firebase.auth.GithubAuthProvider(),
    providerKey: "github",
    icon: <GitHubIcon className={classes.git} />,
    testId: "githubButton",
    }, {
      label: "Google",
      provider: () => new firebase.auth.GoogleAuthProvider(),
      providerKey: "google",
      icon: <img src={GoogleImg} alt="google" className={classes.googleImg} />,
      testId: "googleButton",
    }, {
      label: "Twitter",
      provider: () => new firebase.auth.TwitterAuthProvider(),
      providerKey: "twitter",
      icon: <TwitterIcon className={classes.tw} />,
      testId: "twitterButton",
    },
  ];
  return (
    <Card className={classes.root} data-testId="socialMediaPage">
      <CardContent className={classes.content}>
        <Typography className={classes.cardSubtitle}>
          Manage your connected social accounts and login methods.
        </Typography>
        <Box className={classes.flex}>
          {buttons.map(({ label, provider, providerKey, icon, testId }) => {
            const linked = isProviderLinked(providerKey);
            return (
              <SocialButton
                key={label}
                label={label}
                isLinked={linked}
                linkedUsername={getLinkedUsername(providerKey)}
                onClick={linked? () => unlinkProvider(`${providerKey}.com`) : () => linkWithProvider(provider())}
                Icon={icon}
                data-testId={testId}
              />
            );
          })}
        </Box>
        <Typography className={classes.footer}>
          Connected accounts are secured by OAuth 2.0
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ConnectSocials;
