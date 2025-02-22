import React, { useEffect, useState } from "react";
import ProfileCardOne from "../../ProfileBanner/profile/ProfileCardOne";
import Activity from "../../Topbar/Activity";
import CardWithPicture from "../../Card/CardWithPicture";
import CardWithoutPicture from "../../Card/CardWithoutPicture";
import { Grid, LinearProgress, ThemeProvider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import OrgUser from "../../../assets/images/org-user.svg";
import { userList } from "../../HomePage/userList";
import Card from "@mui/material/Card";
import UserHighlights from "./UserHighlights";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import {
  getTutorialFeedData,
  getTutorialFeedIdArray
} from "../../../store/actions/tutorialPageActions";
import { useParams } from "react-router-dom";
import { clearUserProfile, getUserProfileData } from "../../../store/actions";
import { basicTheme } from "../../../helpers/themes";

const useStyles = makeStyles(theme => ({
  parentBody: {
    background: "#f9f9f9",
    display: "flex",
    justifyContent: "space-evenly",
    paddingTop: theme.spacing(5),
    minHeight: "calc(100vh - 100px)"
  },
  leftBody: {
    width: "60%",
    [theme.breakpoints.down(750)]: {
      width: "98%"
    }
  },
  rightBody: {
    [theme.breakpoints.down(750)]: {
      display: "none"
    }
  },
  //styles for userCredential Card on small screen
  rightSmallBody: {
    [theme.breakpoints.up(750)]: {
      display: "none"
    },
    marginTop: "11px",
    marginBottom: "-30px"
  },
  bottomMargin: {
    marginBottom: "10px"
  },
  marginActivity: {
    marginTop: "10px",
    marginBottom: "10px"
  },
  paddingActivity: {
    padding: "10px"
  }
}));

function UserProfile() {
  const { handle } = useParams();
  const classes = useStyles();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const profileData = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );
  const loading = useSelector(
    ({
      profile: {
        user: { error }
      }
    }) => error
  );

  const loggedInUser = useSelector(({ firebase: { profile } }) => profile);

  const isFollowing = profileData?.isFollowing;

  const showFollowButton = handle !== loggedInUser?.handle;

  // Get profile data
  useEffect(() => {
    getUserProfileData(handle)(firebase, firestore, dispatch);
    return () => {
      clearUserProfile()(dispatch);
    };
  }, [firebase, firestore, dispatch, handle]);

  useEffect(() => {
    const getFeed = async () => {
      const tutorialIdArray = await getTutorialFeedIdArray(null, handle)(
        null,
        firestore
      );
      console.log(tutorialIdArray, handle);
      getTutorialFeedData(tutorialIdArray)(firebase, firestore, dispatch);
    };
    if (handle) getFeed();
  }, [handle, firestore, dispatch]);

  const tutorials = useSelector(
    ({
      tutorialPage: {
        feed: { homepageFeedArray }
      }
    }) => homepageFeedArray
  );

  const [organizations, setUpOrganizations] = useState([
    {
      name: "Google Summer of Code",
      img: [OrgUser]
    },
    {
      name: "Google Summer of Code",
      img: [OrgUser]
    },
    {
      name: "Google Summer of Code",
      img: [OrgUser]
    },
    {
      name: "Google Summer of Code",
      img: [OrgUser]
    }
  ]);

  if (loading || !profileData) {
    return (
      <ThemeProvider theme={basicTheme}>
        <LinearProgress />
      </ThemeProvider>
    );
  }

  return (
    <>
      <div className={classes.parentBody}>
        <div className={classes.leftBody}>
          <Grid>
            <Card>
              <ProfileCardOne
                profileImage={
                  profileData?.photoURL
                    ? profileData.photoURL
                    : "https://i.pravatar.cc/300"
                }
                name={profileData?.displayName}
                story={profileData?.description}
                followers={profileData?.followerCount}
                following={profileData?.followerCount}
                isFollowing={isFollowing}
                showFollowButton={showFollowButton}
              />
            </Card>
          </Grid>

          {/* Display this card on screen size below 760px */}
          <Grid className={classes.rightSmallBody}>
            <UserHighlights organizations={organizations} />
          </Grid>

          <Grid className={classes.marginActivity}>
            <Card className={classes.paddingActivity}>
              <Activity />
            </Card>
          </Grid>

          <Grid>
            {tutorials.map(tutorial => {
              return !tutorial?.featured_image ? (
                <CardWithoutPicture
                  tutorial={tutorial}
                  className={classes.card}
                />
              ) : (
                <CardWithPicture tutorial={tutorial} className={classes.card} />
              );
            })}
          </Grid>
        </div>

        {/* Credentials and Highlights Card.Display it on screen size above 760px */}
        <Grid className={classes.rightBody}>
          <UserHighlights organizations={organizations} />
        </Grid>
      </div>
    </>
  );
}

export default UserProfile;
