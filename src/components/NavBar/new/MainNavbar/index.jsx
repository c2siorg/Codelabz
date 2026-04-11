import {
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Button,
  Box,
  Popover,
  Avatar,
  Drawer,
  Tooltip
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import Headroom from "react-headroom";
import SearchIcon from "@mui/icons-material/Search";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useHistory, Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector, useDispatch } from "react-redux";
import SideBar from "../../../SideBar/index";
import useWindowSize from "../../../../helpers/customHooks/useWindowSize";
import ExploreMenu from "./ExploreMenu";
import PopularTagsMenu from "./PopularTagsMenu";
import { avatarName } from "../../../../helpers/avatarName";
import { signOut } from "../../../../store/actions";
import { useFirebase } from "react-redux-firebase";

const useStyles = makeStyles(theme => ({
  nav: {
    padding: "10px 40px",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
    [theme.breakpoints.down("md")]: {
      padding: "10px 20px"
    }
  },
  logo: {
    fontWeight: 900,
    fontSize: "1.8rem",
    background: "linear-gradient(45deg, #6f42c1, #007bff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    cursor: "pointer",
    textDecoration: "none",
    marginRight: "30px",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
      filter: "drop-shadow(0 0 8px rgba(111, 66, 193, 0.3))"
    }
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
    fontWeight: 600,
    fontSize: "1rem",
    margin: "0 20px",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#6f42c1",
      transform: "translateY(-1px)"
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: -5,
      left: 0,
      width: 0,
      height: "2px",
      background: "#6f42c1",
      transition: "width 0.3s ease"
    },
    "&:hover::after": {
      width: "100%"
    }
  },
  searchPaper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "5px 20px",
    border: "1px solid transparent",
    borderRadius: "30px",
    width: "100%",
    maxWidth: "550px",
    boxShadow: "none",
    transition: "all 0.3s ease",
    "&:focus-within": {
      backgroundColor: "#fff",
      borderColor: "#6f42c1",
      boxShadow: "0 4px 15px rgba(111, 66, 193, 0.1)"
    }
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontSize: "0.95rem",
    fontFamily: "'Inter', sans-serif"
  },
  popularTags: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    marginRight: "25px",
    padding: "8px 15px",
    borderRadius: "12px",
    gap: "8px",
    transition: "all 0.2s ease",
    "& .MuiTypography-root": {
      fontWeight: 600,
      fontSize: "0.95rem",
      fontFamily: "'Inter', sans-serif"
    },
    "&:hover": {
      backgroundColor: "#f3eaff",
      color: "#6f42c1"
    }
  },
  authButtons: {
    display: "flex",
    gap: "12px"
  },
  loginBtn: {
    borderRadius: "25px",
    textTransform: "none",
    fontWeight: 700,
    padding: "8px 25px",
    color: "#333",
    fontFamily: "'Inter', sans-serif",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.05)"
    }
  },
  signupBtn: {
    borderRadius: "25px",
    textTransform: "none",
    fontWeight: 700,
    padding: "8px 25px",
    background: "linear-gradient(45deg, #6f42c1, #a17fe0)",
    color: "white",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 4px 12px rgba(111, 66, 193, 0.2)",
    "&:hover": {
      background: "linear-gradient(45deg, #5a32a3, #8e6cd2)",
      boxShadow: "0 6px 15px rgba(111, 66, 193, 0.3)",
      transform: "translateY(-1px)"
    }
  },
  avatar: {
    cursor: "pointer",
    width: "40px",
    height: "40px",
    fontSize: "1rem",
    backgroundColor: "#6f42c1",
    boxShadow: "0 2px 10px rgba(111, 66, 193, 0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 4px 15px rgba(111, 66, 193, 0.3)"
    }
  },
  hamburger: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
}));

function MainNavbar() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const windowSize = useWindowSize();
  
  const [openMenu, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [exploreOpen, setExploreOpen] = useState(false);
  const [tagsAnchor, setTagsAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const toggleSlider = () => {
    setOpen(!openMenu);
  };

  const profile = useSelector(({ firebase }) => firebase.profile);
  const authed = profile && profile.displayName;

  const notifications = useSelector(
    state => state.notifications.data.notifications
  );
  const notificationCount = notifications?.filter(
    notification => !notification.isRead
  ).length;

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.length > 0) {
      history.push(`/search?query=${searchQuery}`);
    }
  };

  const handleExploreClick = () => {
    setExploreOpen(true);
  };

  const handleExploreClose = () => {
    setExploreOpen(false);
  };

  const handleTagsClick = (event) => {
    setTagsAnchor(event.currentTarget);
  };

  const handleTagsClose = () => {
    setTagsAnchor(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  return (
    <Headroom>
      <nav className={classes.nav}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          {/* Left Section: Logo and Links */}
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              className={classes.logo}
              onClick={() => history.push("/")}
            >
              CodeLabz
            </Typography>
            
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
              <Link to="/" className={classes.navLink}>Home</Link>
              <Typography className={classes.navLink} onClick={handleExploreClick}>Explore</Typography>
              <Link to="/courses" className={classes.navLink}>Courses</Link>
            </Box>
          </Grid>

          {/* Middle Section: Search Bar */}
          <Grid item xs sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "center", px: 4 }}>
            <Paper
              component={"form"}
              className={classes.searchPaper}
              elevation={0}
              onSubmit={handleSearch}
            >
              <IconButton
                type="button"
                aria-label="search"
                disableRipple
                onClick={handleSearch}
                size="small"
              >
                <SearchIcon sx={{ color: "#757575", fontSize: "1.3rem" }} />
              </IconButton>
              <InputBase
                className={classes.searchInput}
                value={searchQuery}
                placeholder="Search courses, tutorials..."
                onChange={handleSearchChange}
              />
            </Paper>
          </Grid>

          {/* Right Section: Popular Tags and Auth Buttons */}
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            <Box
              className={classes.popularTags}
              sx={{ display: { xs: "none", lg: "flex" } }}
              onClick={handleTagsClick}
            >
              <LocalOfferIcon sx={{ fontSize: "1.2rem" }} />
              <Typography>Popular Tags</Typography>
            </Box>

            {!authed ? (
              <Box className={classes.authButtons} sx={{ display: { xs: "none", sm: "flex" } }}>
                <Button
                  className={classes.loginBtn}
                  onClick={() => history.push("/login")}
                >
                  Log in
                </Button>
                <Button
                  className={classes.signupBtn}
                  variant="contained"
                  onClick={() => history.push("/signup")}
                >
                  Sign up
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Tooltip title="Account Settings">
                  <Avatar
                    className={classes.avatar}
                    src={profile.photoURL}
                    onClick={handleProfileClick}
                  >
                    {avatarName(profile.displayName)}
                  </Avatar>
                </Tooltip>
              </Box>
            )}

            {/* Mobile Hamburger */}
            <IconButton
              className={classes.hamburger}
              onClick={toggleSlider}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* Explore Drawer (Left Side Sidebar) */}
        <Drawer
          anchor="left"
          open={exploreOpen}
          onClose={handleExploreClose}
          PaperProps={{
            sx: {
              width: "300px",
              padding: "30px 10px",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(10px)",
              borderRight: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "10px 0 30px rgba(0,0,0,0.05)"
            }
          }}
        >
          <Box sx={{ mb: 4, px: 2 }}>
             <Typography variant="h5" sx={{ fontWeight: 900, color: "#6f42c1", fontFamily: "'Inter', sans-serif" }}>
              Explore
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
              Discover tutorials, communities, and more.
            </Typography>
          </Box>
          <ExploreMenu onClose={handleExploreClose} />
        </Drawer>

        {/* Popular Tags Popover */}
        <Popover
          open={Boolean(tagsAnchor)}
          anchorEl={tagsAnchor}
          onClose={handleTagsClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: { background: "transparent", boxShadow: "none", mt: 1.5 }
          }}
        >
          <PopularTagsMenu />
        </Popover>

        {/* Profile Popover */}
        <Popover
          open={Boolean(profileAnchor)}
          anchorEl={profileAnchor}
          onClose={handleProfileClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{ mt: 1.5 }}
        >
          <Paper sx={{ p: 2, minWidth: "200px", borderRadius: "15px" }}>
            <Box sx={{ px: 1, py: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{profile.displayName}</Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>{profile.email}</Typography>
            </Box>
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Button 
                variant="text" 
                fullWidth 
                sx={{ justifyContent: "flex-start", textTransform: "none", fontWeight: 600, color: "#333" }}
                onClick={() => { handleProfileClose(); history.push("/profile"); }}
              >
                My Profile
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                color="error"
                sx={{ borderRadius: "10px", textTransform: "none", mt: 1 }}
                onClick={() => signOut()(firebase, dispatch)}
              >
                Log Out
              </Button>
            </Box>
          </Paper>
        </Popover>

        {/* Mobile SideBar Component */}
        {windowSize.width <= 960 && (
          <SideBar
            open={openMenu}
            toggleSlider={toggleSlider}
            notificationCount={notificationCount}
            drawWidth={960}
          />
        )}
      </nav>
    </Headroom>
  );
}

export default MainNavbar;

