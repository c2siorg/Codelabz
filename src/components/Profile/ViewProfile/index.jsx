import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearUserProfile,
  getUserProfileData,
  addUserFollower,
  removeUserFollower
} from "../../../store/actions";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { BasicImage, NoImage } from "../../../helpers/images";
import {
  Card,
  Grid,
  Divider,
  Button,
  LinearProgress,
  Box,
  ThemeProvider,
  Typography,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Paper,
  Badge
} from "@mui/material";
import { basicTheme } from "../../../helpers/themes";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Link as LinkIcon,
  Flag as FlagIcon,
  Mail as MailIcon,
  Share as ShareIcon,
  Report as ReportIcon,
  EditOutlined as EditIcon,
  Close as CloseIcon
} from "@mui/icons-material";

// Custom TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfileView = () => {
  const { handle } = useParams();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [followers, setFollowers] = useState([]);
  const [targetUserFollowing, setTargetUserFollowing] = useState(0);
  const [following, setFollowing] = useState([]);
  const [followDisable, setFollowDisable] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
  const db = firebase.firestore();

  // Get profile data
  useEffect(() => {
    getUserProfileData(handle)(firebase, firestore, dispatch);
    return () => {
      clearUserProfile()(dispatch);
    };
  }, [firebase, firestore, dispatch, handle]);

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

  // Fetch followers and following data
  useEffect(() => {
    if (!profileData?.uid) return;

    const followersUnsubscribe = db
      .collection("cl_user")
      .doc(profileData.uid)
      .onSnapshot(snap => {
        const data = snap.data();
        setFollowers(data?.followers || []);
        setTargetUserFollowing(data?.following?.length || 0);
      });

    const followingUnsubscribe = db
      .collection("cl_user")
      .doc(currentProfileData?.uid)
      .onSnapshot(snap => {
        const data = snap.data();
        setFollowing(data?.following || []);
      });

    return () => {
      followersUnsubscribe();
      followingUnsubscribe();
    };
  }, [profileData, currentProfileData, db]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const addFollower = async e => {
    e.preventDefault();
    setFollowDisable(true);
    await addUserFollower(currentProfileData, profileData, firestore, dispatch);
    setFollowDisable(false);
  };

  const removeFollower = async e => {
    e.preventDefault();
    setFollowDisable(true);
    await removeUserFollower(currentProfileData, profileData, firestore, dispatch);
    setFollowDisable(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // You could add a snackbar notification here
  };

  if (loading || !profileData) {
    return (
      <ThemeProvider theme={basicTheme}>
        <LinearProgress />
      </ThemeProvider>
    );
  }

  const socialLinks = [
    {
      icon: <FacebookIcon className="facebook-color" />,
      link: profileData.link_facebook,
      baseUrl: "https://www.facebook.com/",
      label: "Facebook"
    },
    {
      icon: <TwitterIcon className="twitter-color" />,
      link: profileData.link_twitter,
      baseUrl: "https://twitter.com/",
      label: "Twitter"
    },
    {
      icon: <GitHubIcon className="github-color" />,
      link: profileData.link_github,
      baseUrl: "https://github.com/",
      label: "GitHub"
    },
    {
      icon: <LinkedInIcon className="linkedin-color" />,
      link: profileData.link_linkedin,
      baseUrl: "https://www.linkedin.com/in/",
      label: "LinkedIn"
    }
  ];

  return (
    <ThemeProvider theme={basicTheme}>
      <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 2 }}>
        <Paper elevation={3}>
          {/* Header Section */}
          <Box sx={{ position: "relative", height: 200, bgcolor: "primary.main" }}>
            <Box
              sx={{
                position: "absolute",
                bottom: -50,
                left: 32,
                display: "flex",
                alignItems: "flex-end"
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  profileData.uid === currentProfileData.uid ? (
                    <IconButton
                      sx={{ bgcolor: "white" }}
                      size="small"
                      onClick={() => {/* Handle profile pic update */}}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }
              >
                <Avatar
                  src={profileData.photoURL || NoImage}
                  alt={profileData.displayName}
                  sx={{ width: 150, height: 150, border: "4px solid white" }}
                />
              </Badge>
            </Box>
          </Box>

          {/* Profile Info Section */}
          <Box sx={{ mt: 8, px: 4, pb: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  {profileData.displayName}
                </Typography>
                {profileData.description && (
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {profileData.description}
                  </Typography>
                )}
                
                {/* Location and Website */}
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  {profileData.country && (
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                      <FlagIcon sx={{ mr: 0.5 }} fontSize="small" />
                      {profileData.country}
                    </Typography>
                  )}
                  {profileData.website && (
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                      <LinkIcon sx={{ mr: 0.5 }} fontSize="small" />
                      <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                        {new URL(profileData.website).hostname}
                      </a>
                    </Typography>
                  )}
                </Box>

                {/* Social Links */}
                <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                  {socialLinks.map(({ icon, link, baseUrl, label }) => 
                    link ? (
                      <Tooltip title={label} key={label}>
                        <IconButton
                          href={baseUrl + link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {icon}
                        </IconButton>
                      </Tooltip>
                    ) : null
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {profileData.uid !== currentProfileData.uid && (
                    <>
                      <Button
                        variant={profileData.isFollowing ? "outlined" : "contained"}
                        onClick={profileData.isFollowing ? removeFollower : addFollower}
                        disabled={followDisable}
                        startIcon={profileData.isFollowing ? null : null}
                      >
                        {profileData.isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<MailIcon />}
                        onClick={() => {/* Handle message */}}
                      >
                        Organisations
                      </Button>
                    </>
                  )}
                  <IconButton onClick={handleShare}>
                    <ShareIcon />
                  </IconButton>
                  <IconButton>
                    <ReportIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            {/* Stats Section */}
            <Box sx={{ mt: 3, display: "flex", gap: 4 }}>
              <Button onClick={() => setFollowersDialogOpen(true)}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6">{profileData.followerCount || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Followers</Typography>
                </Box>
              </Button>
              <Button onClick={() => setFollowingDialogOpen(true)}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6">{profileData.followingCount || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Following</Typography>
                </Box>
              </Button>
            </Box>

            {/* Tabs Section */}
            <Box sx={{ mt: 4 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Tutorial" />
                <Tab label="About" />
                <Tab label="Activity" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                {/* Posts content */}
                <Typography variant="body1">User's posts will appear here</Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                {/* About content */}
                <Typography variant="body1">Detailed user information</Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                {/* Activity content */}
                <Typography variant="body1">User's recent activity</Typography>
              </TabPanel>
            </Box>
          </Box>
        </Paper>

        {/* Followers Dialog */}
        <Dialog
          open={followersDialogOpen}
          onClose={() => setFollowersDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Followers
            <IconButton
              onClick={() => setFollowersDialogOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <List>
              {followers.map((follower) => (
                <ListItem key={follower.uid}>
                  <ListItemAvatar>
                    <Avatar src={follower.photoURL} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={follower.displayName}
                    secondary={follower.email}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>

        {/* Following Dialog */}
        <Dialog
          open={followingDialogOpen}
          onClose={() => setFollowingDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Following
            <IconButton
              onClick={() => setFollowingDialogOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <List>
              {following.map((follow) => (
                <ListItem key={follow.uid}>
                  <ListItemAvatar>
                    <Avatar src={follow.photoURL} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={follow.displayName}
                    secondary={follow.email}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ProfileView;