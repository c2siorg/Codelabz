import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import GoogleImg from "../../../assets/orgs/google.png";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: "auto",
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    backgroundColor: "#31363F",
    padding: theme.spacing(3),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  row: {
    display: "flex",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: theme.spacing(3),
  },
  link: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: "2px solid transparent",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      borderColor: theme.palette.primary.light,
      backgroundColor: theme.palette.action.hover,
    },
  },
  isLinked: {
    borderColor: theme.palette.success.main,
  },
  text: {
    marginTop: theme.spacing(1),
    fontWeight: 500,
    fontSize: "1rem",
    color: "#FFFFFF",
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: "50%",
  },
  fb: {
    color: "#1877F2",
    fontSize: 40,
  },
  git: {
    color: "#FFFFFF",
    fontSize: 40,
  },
  tw: {
    color: "#1DA1F2",
    fontSize: 40,
  },
  isLinkedImg: {
    fontSize: 20,
    color: theme.palette.success.main,
  },
}));

const SocialButton = ({ icon, label, isLinked, ...props }) => {
  const classes = useStyles();
  return (
    <Box {...props} className={`${classes.link} ${isLinked ? classes.isLinked : ""}`}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        badgeContent={isLinked ? <CheckCircleIcon className={classes.isLinkedImg} /> : null}
      >
        {icon}
      </Badge>
      <Typography className={classes.text}>{label}</Typography>
    </Box>
  );
};

const ConnectSocials = () => {
  const classes = useStyles();
  const firebase = useFirebase();
  const history = useHistory();

  const providerData = useSelector(
    ({ firebase: { auth: { providerData } } }) => providerData || []
  );

  const isProviderLinked = (provider) =>
    providerData.some((item) => item.providerId.includes(provider));

  const linkWithProvider = (provider) =>
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
        <Box className={classes.row}>
          <SocialButton
            isLinked={isProviderLinked("facebook")}
            onClick={() =>
              linkWithProvider(new firebase.auth.FacebookAuthProvider())
            }
            icon={<FacebookIcon className={classes.fb} />}
            label="Facebook"
            data-testId="facebookButton"
          />
          <SocialButton
            isLinked={isProviderLinked("github")}
            onClick={() =>
              linkWithProvider(new firebase.auth.GithubAuthProvider())
            }
            icon={<GitHubIcon className={classes.git} />}
            label="Github"
            data-testId="githubButton"
          />
        </Box>
        <Box className={classes.row}>
          <SocialButton
            isLinked={isProviderLinked("google")}
            onClick={() =>
              linkWithProvider(new firebase.auth.GoogleAuthProvider())
            }
            icon={<img src={GoogleImg} alt="Google" className={classes.button} />}
            label="Google"
            data-testId="googleButton"
          />
          <SocialButton
            isLinked={isProviderLinked("twitter")}
            onClick={() =>
              linkWithProvider(new firebase.auth.TwitterAuthProvider())
            }
            icon={<TwitterIcon className={classes.tw} />}
            label="Twitter"
            data-testId="twitterButton"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConnectSocials;
