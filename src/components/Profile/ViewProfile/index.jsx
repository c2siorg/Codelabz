import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearUserProfile,
  getFollowProfileData,
  addUserFollower,
  removeUserFollower
} from "../../../store/actions";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { BasicImage, NoImage } from "../../../helpers/images";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material";
import { basicTheme } from "../../../helpers/themes";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LinkIcon from "@mui/icons-material/Link";
import FlagIcon from "@mui/icons-material/Flag";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  parentBody: {
    background: "#f9f9f9",
    display: "flex",
    justifyContent: "space-evenly",
    paddingTop: theme.spacing(5)
  },
  icons: {
    background: "#fff",
    display: "flex",
  },
  icon: {
    marginRight: "10px",
    paddingRight: "20px",
    paddingLeft: "20px",
    paddingTop: "0%",
    paddingBottom: "-100px",
    borderRadius: "20px",
    '&:hover': {
      background: "#F9F9F9",
    },
  },
  profileName: {
    fontSize: "30px",
    fontWeight: "bold",
  },
  description: {
    fontSize: "30px",
  },
  leftPart: {
    marginRight: "20px",
    marginLeft: "10px"
  },
  iconName: {
    fontSize: "20px",
    marginTop: "6px",
  },
  iconres: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up('md')]: {
      flexDirection: "row",
    }
  }

}))

const ViewProfile = () => {
  const { id } = useParams();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [followers, setFollowers] = useState([]);
  const [targetUserFollowing, setTargetUserFollowing] = useState(0);
  const [following, setFollowing] = useState([]);
  const [followDisable, setFollowDisable] = useState(false);
  const [data, setData] = useState([]);
  const classes = useStyles();
  const db = firebase.firestore();

  //useEffect(() => {
  //  getUserProfileData(handle)(firebase, firestore, dispatch);
  //  return () => {
  //    clearUserProfile()(dispatch);
  //  };
  //}, [firebase, firestore, dispatch, handle]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getFollowProfileData(id)(firebase, firestore, dispatch);
        setData(profileData);
      } catch (error) {
        console.log("Error fetching user's followers: ", error);
      }
    }
    fetchData();
  }, [id])

  console.log("fetched Data", data);

  const profileData = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );

  const currentProfileData = useSelector(
    ({ firebase: { profile } }) => profile
  );
  const loading = useSelector(
    ({
      profile: {
        user: { error }
      }
    }) => error
  );

  useEffect(() => {
    const unsubscribe = db
      .collection("cl_user")
      .doc(profileData?.uid)
      .onSnapshot(snap => {
        const data = snap.data();
        setFollowers(data?.followers);
      });

    return () => unsubscribe();
  }, [profileData, db]);

  useEffect(() => {
    const unsubscribe = db
      .collection("cl_user")
      .doc(profileData?.uid)
      .onSnapshot(snap => {
        const data = snap.data();
        setTargetUserFollowing(data?.following);
      });

    return () => unsubscribe();
  }, [profileData, db]);

  useEffect(() => {
    const unsubscribe = db
      .collection("cl_user")
      .doc(currentProfileData?.uid)
      .onSnapshot(snap => {
        const data = snap.data();
        setFollowing(data?.following);
      });

    return () => unsubscribe();
  }, [currentProfileData, db]);
  const checkAvailable = data => {
    return !!(data && data.length > 0);
  };

  if (loading || !data) {
    return (
      <ThemeProvider theme={basicTheme}>
        <LinearProgress theme={basicTheme} />
      </ThemeProvider>
    );
  }

  const addFollower = async e => {
    e.preventDefault();
    setFollowDisable(true);
    await addUserFollower(currentProfileData, profileData, firestore, dispatch);
    setFollowDisable(false);
  };

  const removeFollower = async e => {
    e.preventDefault();
    setFollowDisable(true);
    await removeUserFollower(
      currentProfileData,
      profileData,
      firestore,
      dispatch
    );
    setFollowDisable(false);
  };

  return (
    <div className={classes.parentBody}>
      <ThemeProvider theme={basicTheme}>
        <Card className="p-0">
          {data && (
            <div>
              <Box mt={2} mb={2} m={3}>
                <Grid container>
                  <span style={{ fontSize: "2em", fontWeight: "480" }}>
                    Profile Details
                  </span>
                </Grid>
              </Box>
              <Divider></Divider>
              <Box mt={2} mb={2} m={3}>
                <Grid container>
                  <Grid xs={12} md={3} lg={3} item={true} className={classes.leftPart}>
                    {data.photoURL && data.photoURL.length > 0
                      ? BasicImage(data.photoURL, data.displayName)
                      : BasicImage("https://i.pravatar.cc/300", data.displayName)}
                  </Grid>
                  <Grid
                    xs={12}
                    md={9}
                    lg={9}
                    className=""
                    item={true}
                  >
                    <p className={classes.profileName}>
                      <span>
                        {data.displayName}
                      </span>
                    </p>
                    {checkAvailable(data.description) && (
                      <p className={classes.description}>{data.description}</p>
                    )}
                    <div className={classes.icons}>
                      <div className={classes.iconres}> 
                        <div className={classes.icon}>
                          {checkAvailable(data.link_facebook) && (
                            <p>
                              <a
                                href={
                                  "https://www.facebook.com/" +
                                  data.link_facebook
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px"
                                  }}
                                >
                                  <Box mr={-1}>
                                    <FacebookIcon
                                      fontSize="large"
                                      className="facebook-color"
                                    />
                                  </Box>
                                  <p className={classes.iconName}>{data.link_facebook}</p>

                                </div>
                              </a>
                            </p>
                          )}
                        </div>
                        <div className={classes.icon}>
                          {checkAvailable(data.link_twitter) && (
                            <p>
                              <a
                                href={"https://twitter.com/" + data.link_twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px"
                                  }}
                                >
                                  <Box mr={-1}>
                                    <TwitterIcon
                                      fontSize="large"
                                      className="twitter-color"
                                    />
                                  </Box>
                                  <p className={classes.iconName}>{data.link_twitter}</p>

                                </div>
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={classes.iconres}>
                        <div className={classes.icon}>
                          {checkAvailable(data.link_github) && (
                            <p>
                              <a
                                href={"https://github.com/" + data.link_github}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px"
                                  }}
                                >
                                  <Box mr={-1}>
                                    <GitHubIcon
                                      fontSize="large"
                                      className="github-color"
                                    />
                                  </Box>
                                  <p className={classes.iconName}>{data.link_github}</p>

                                </div>
                              </a>
                            </p>
                          )}
                        </div>
                        <div className={classes.icon}>
                          {checkAvailable(data.link_linkedin) && (
                            <p>
                              <a
                                href={
                                  "https://www.linkedin.com/in/" +
                                  data.link_linkedin
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px"
                                  }}
                                >
                                  <Box mr={-1}>
                                    <LinkedInIcon
                                      fontSize="large"
                                      className="linkedin-color"
                                    />
                                  </Box>
                                  <p className={classes.iconName}>{data.link_linkedin}</p>

                                </div>
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {checkAvailable(data.website) && (
                      <p>
                        <a
                          href={data.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "10px"
                            }}
                          >
                            <Box mr={1}>
                              <LinkIcon
                                fontSize="large"
                                className="website-color"
                              />
                            </Box>{" "}
                            <p className={classes.iconName}>{data.website}</p>

                          </div>
                        </a>
                      </p>
                    )}
                    {checkAvailable(data.country) && (
                      <p className="mb-0">
                        <a
                          href={
                            "https://www.google.com/search?q=" +
                            data.country
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "10px"
                            }}
                          >
                            <Box mr={1}>
                              <FlagIcon
                                fontSize="large"
                                className="website-color"
                              />{" "}
                            </Box>
                            <p className={classes.iconName}>{data.country}</p>

                          </div>
                        </a>
                      </p>
                    )}


                    <Typography
                      variant="body2"
                      style={{ margin: "0.2rem 0rem 0.2rem 0rem", fontSize: "20px" }}
                    >
                      Followers :{" "}
                      <span style={{marginRight: "10px"}}>
                        {data.followerCount
                          ? data.followerCount
                          : 0}
                      </span>{" "}
                      Following :{" "}
                      <span>
                        {data.followingCount
                          ? data.followingCount
                          : 0}
                      </span>
                    </Typography>
                    {!data.isFollowing ? (
                      <Button
                        variant="contained"
                        onClick={e => addFollower(e)}
                        style={{ marginTop: "1rem" }}
                        disabled={followDisable}
                      >
                        follow
                      </Button>
                    ) : (
                      <Button
                        onClick={e => removeFollower(e)}
                        variant="contained"
                        style={{ marginTop: "1rem" }}
                        disabled={followDisable}
                      >
                        unfollow
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </div>
          )}
          {data === false && "No profile with the provided handle"}
        </Card>
      </ThemeProvider>
    </div >
  );
};

export default ViewProfile;
