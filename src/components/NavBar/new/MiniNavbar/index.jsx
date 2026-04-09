import React, { useState } from "react";
import {
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Button,
  Box,
  Avatar,
  Drawer,
  Popover
} from "@mui/material";
import Headroom from "react-headroom";
import SearchIcon from "@mui/icons-material/Search";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MenuIcon from "@mui/icons-material/Menu";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFirebase } from "react-redux-firebase";

import SideBar from "../../../SideBar/index";
import useWindowSize from "../../../../helpers/customHooks/useWindowSize";
import ExploreMenu from "../MainNavbar/ExploreMenu";
import PopularTagsMenu from "../MainNavbar/PopularTagsMenu";
import { avatarName } from "../../../../helpers/avatarName";
import { signOut } from "../../../../store/actions";

const MiniNavbar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const windowSize = useWindowSize();
  const logoRef = React.useRef(null);

  const [openMenu, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [exploreAnchor, setExploreAnchor] = useState(null);
  const [tagsAnchor, setTagsAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const profile = useSelector(state => state.firebase.profile);
  const authed = profile && profile.displayName;

  const notifications = useSelector(
    state => state.notifications?.data?.notifications || []
  );
  const notificationCount = notifications.filter(n => !n.isRead).length;

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/search?query=${searchQuery}`);
    }
  };

  return (
    <Headroom>
      <Box
        component="nav"
        sx={{
          padding: "0 24px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          height: "72px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <Grid container alignItems="center" wrap="nowrap">
          <Grid item>
            <Typography
              ref={logoRef}
              onClick={() => history.push("/")}
              sx={{
                fontWeight: "900",
                fontSize: "1.85rem",
                background: "linear-gradient(135deg, #6f42c1 0%, #476fff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                cursor: "pointer",
                marginRight: "35px",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-1px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  filter: "drop-shadow(0 0 8px rgba(111, 66, 193, 0.2))"
                }
              }}
            >
              CodeLabz
            </Typography>
          </Grid>

          <Grid
            item
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <Typography
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "#333",
                fontWeight: 500,
                fontSize: "15px",
                margin: "0 18px",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  fontWeight: 700,
                  transform: "scale(1.05)",
                  color: "#000"
                }
              }}
            >
              Home
            </Typography>
            <Box
              onClick={() => setExploreAnchor(logoRef.current)}
              sx={{
                backgroundColor: Boolean(exploreAnchor)
                  ? "#eceff1"
                  : "transparent",
                borderRadius: "10px",
                padding: "8px 18px",
                cursor: "pointer",
                margin: "0 5px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  transform: "scale(1.05)"
                }
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "15px",
                  color: "#333",
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.2s ease",
                  "&:hover": { fontWeight: 700 }
                }}
              >
                Explore
              </Typography>
            </Box>
            <Typography
              component={Link}
              to="/courses"
              sx={{
                textDecoration: "none",
                color: "#333",
                fontWeight: 500,
                fontSize: "15px",
                margin: "0 18px",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  fontWeight: 700,
                  transform: "scale(1.05)",
                  color: "#000"
                }
              }}
            >
              Courses
            </Typography>
          </Grid>

          <Grid
            item
            xs
            sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
          >
            <Paper
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: "2px 16px",
                border: "1px solid #e5e5e5",
                borderRadius: "30px",
                width: "100%",
                maxWidth: "1200px",
                marginLeft: "20px",
                marginRight: "20px",
                boxShadow: "none",
                height: "42px"
              }}
            >
              <IconButton size="small" disableRipple>
                <SearchIcon sx={{ color: "#757575", fontSize: "1.2rem" }} />
              </IconButton>
              <InputBase
                value={searchQuery}
                placeholder="Search tutorials..."
                onChange={e => setSearchQuery(e.target.value)}
                sx={{
                  ml: 1,
                  flex: 1,
                  fontSize: "14px",
                  fontFamily: "'Inter', sans-serif"
                }}
              />
            </Paper>

            <Box
              onClick={e => setTagsAnchor(e.currentTarget)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                marginLeft: "15px",
                marginRight: "15px",
                gap: "6px",
                color: "#333",
                "&:hover": { color: "#6f42c1" },
                whiteSpace: "nowrap"
              }}
            >
              <LocalOfferIcon sx={{ fontSize: "1.2rem" }} />
              <Typography
                sx={{
                  display: { xs: "none", lg: "block" },
                  fontWeight: 500,
                  fontSize: "15px",
                  whiteSpace: "nowrap"
                }}
              >
                Popular Tags
              </Typography>
            </Box>
          </Grid>

          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            {!authed ? (
              <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Button
                  onClick={() => history.push("/login")}
                  sx={{
                    borderRadius: "25px",
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "7px 24px",
                    color: "#333",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  Log in
                </Button>
                <Button
                  onClick={() => history.push("/signup")}
                  sx={{
                    borderRadius: "25px",
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "8px 26px",
                    background:
                      "linear-gradient(135deg, #8a4fff 0%, #476fff 100%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #7a3def 0%, #3f5fef 100%)"
                    }
                  }}
                >
                  Sign up
                </Button>
              </Box>
            ) : (
              <Avatar
                src={profile.photoURL}
                onClick={e => setProfileAnchor(e.currentTarget)}
                sx={{
                  cursor: "pointer",
                  width: "38px",
                  height: "38px",
                  backgroundColor: "#6f42c1"
                }}
              >
                {avatarName(profile.displayName)}
              </Avatar>
            )}

            <IconButton
              onClick={() => setOpen(true)}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Popover
          open={Boolean(exploreAnchor)}
          anchorEl={exploreAnchor}
          onClose={() => setExploreAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            sx: {
              width: "320px",
              mt: 2.2,
              borderRadius: "0 0 15px 15px",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
              border: "1px solid #f0f0f0",
              borderTop: "none"
            }
          }}
        >
          <ExploreMenu onClose={() => setExploreAnchor(null)} />
        </Popover>

        <Popover
          open={Boolean(tagsAnchor)}
          anchorEl={tagsAnchor}
          onClose={() => setTagsAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <PopularTagsMenu />
        </Popover>

        <Popover
          open={Boolean(profileAnchor)}
          anchorEl={profileAnchor}
          onClose={() => setProfileAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Paper sx={{ p: 2, minWidth: "150px" }}>
            <Typography variant="subtitle2">{profile.displayName}</Typography>
            <Button fullWidth onClick={() => history.push("/profile")}>
              My Profile
            </Button>
            <Button fullWidth onClick={() => signOut()(firebase, dispatch)}>
              Log Out
            </Button>
          </Paper>
        </Popover>

        <SideBar
          open={openMenu}
          toggleSlider={() => setOpen(false)}
          notificationCount={notificationCount}
          drawWidth={280}
          mobileOnly={true}
        />
      </Box>
    </Headroom>
  );
};

export default MiniNavbar;
