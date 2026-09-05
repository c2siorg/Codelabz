import {
  Button,
  Drawer,
  Grid,
  IconButton,
  InputBase,
  Paper
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Headroom from "react-headroom";
import BrandName from "../../../../helpers/brandName";
import SearchIcon from "@mui/icons-material/Search";
import { useHistory } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SideBar from "../../../SideBar";
import useWindowSize from "../../../../helpers/customHooks/useWindowSize";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { searchFromTutorialsIndex } from "../../../../store/actions";

const useStyles = makeStyles(theme => ({
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: "#3e5060",
    letterSpacing: "0.5px",
    // FIX 1: Use percentage width instead of hardcoded magic numbers
    width: "100%"
  },
  root: {
    backgroundColor: theme.palette.grey[50],
    padding: "2px",
    border: "1px solid #ced4da",
    borderRadius: "0.8rem",
    width: "100%",
    display: "flex",
    alignItems: "center"
  },
  icon: {
    padding: "2px",
    color: theme.palette.primary.main
  },
  grid: {
    "& > *": {
      margin: theme.spacing(1)
    },
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  // FIX 2: Show Login/Signup buttons on all screen sizes >= xs
  // On mobile they move into the SideBar drawer instead of disappearing
  gridButton: {
    "& > *": {
      margin: theme.spacing(1)
    },
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  button: {
    borderRadius: "10px"
  },
  // FIX 3: Hamburger only hidden on desktop (md and up)
  hamburger: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  // FIX 4: Mobile auth buttons inside sidebar — full width for better touch targets
  mobileAuthButton: {
    width: "100%",
    borderRadius: "10px"
  }
}));

function MiniNavbar() {
  const classes = useStyles();

  const history = useHistory();
  const dispatch = useDispatch();
  const notifications = useSelector(
    state => state.notifications.data.notifications
  );
  const notificationCount = notifications?.filter(
    notification => !notification.isRead
  ).length;

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openMenu, setOpen] = useState(false);

  // FIX 5: Removed duplicate screenSize state — useWindowSize hook already provides this
  const windowSize = useWindowSize();

  const toggleSlider = () => {
    setOpen(!openMenu);
  };

  const location = useLocation();
  const routeName = location.pathname;
  const excludedRoutes = ["/login", "/signup"];

  const toggleDrawer = useCallback(state => {
    setOpenDrawer(state);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.length > 0) {
      dispatch(searchFromTutorialsIndex(searchQuery));
      history.push(`/search?query=${searchQuery}`);
    }
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Headroom disableInlineStyles>
      <nav
        style={{
          padding: "10px",
          background: "white"
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          {/* Logo + Hamburger */}
          <Grid item xs={12} md={3} container alignItems="center">
            <Grid
              item
              style={{ flexGrow: 1 }}
              onClick={() => history.push("/")}
              data-testid="navbarBrand"
            >
              <BrandName />
            </Grid>
            <Grid item className={classes.hamburger}>
              {/* FIX 6: Single clean handler — no more window.innerWidth string comparisons */}
              <IconButton
                onClick={() =>
                  windowSize.width > 960 ? toggleDrawer(true) : toggleSlider()
                }
                aria-label="open navigation menu"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Grid>

          {/* Search bar — hidden on excluded routes */}
          {!excludedRoutes.includes(routeName) && (
            <Grid item xs={12} md={4} style={{ padding: "0 8px" }}>
              {/* FIX 7: Wrapped in form for proper submit on Enter key */}
              <Paper
                component="form"
                className={classes.root}
                elevation={0}
                onSubmit={handleSearchSubmit}
              >
                <IconButton
                  type="submit"
                  aria-label="search"
                  disableRipple
                  className={classes.icon}
                  data-testid="navbarSearch"
                >
                  <SearchIcon />
                </IconButton>
                <InputBase
                  className={classes.input}
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  inputProps={{ "aria-label": "search tutorials" }}
                />
              </Paper>
            </Grid>
          )}

          {/* Login / Sign Up — visible on desktop */}
          <Grid item className={classes.gridButton}>
            <Button
              variant="contained"
              color="primary"
              style={{ boxShadow: "none", color: "white" }}
              data-test-id="login"
              className={classes.button}
              onClick={() => history.push("/login")}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              style={{ boxShadow: "none" }}
              className={classes.button}
              onClick={() => history.push("/signup")}
            >
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </nav>

      {/* Desktop drawer (right side) */}
      {windowSize.width > 960 && (
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => toggleDrawer(false)}
        >
          <Grid
            container
            style={{ width: 200 }}
            direction="column"
          >
            <Grid item>
              <IconButton
                onClick={() => toggleDrawer(false)}
                aria-label="close drawer"
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item style={{ padding: 10 }}>
              <Button
                variant="contained"
                color="primary"
                style={{ boxShadow: "none", color: "white" }}
                className={classes.mobileAuthButton}
                onClick={() => {
                  toggleDrawer(false);
                  history.push("/login");
                }}
              >
                Login
              </Button>
            </Grid>
            <Grid item style={{ padding: 10 }}>
              <Button
                variant="outlined"
                color="primary"
                style={{ boxShadow: "none" }}
                className={classes.mobileAuthButton}
                onClick={() => {
                  toggleDrawer(false);
                  history.push("/signup");
                }}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Drawer>
      )}

      {/* FIX 8: Mobile sidebar — Login/Signup always visible inside, not conditionally hidden */}
      {windowSize.width <= 960 && (
        <SideBar
          open={openMenu}
          toggleSlider={toggleSlider}
          notificationCount={notificationCount}
        >
          <Grid item style={{ padding: 10 }}>
            <Button
              variant="contained"
              color="primary"
              style={{ boxShadow: "none", color: "white" }}
              className={classes.mobileAuthButton}
              onClick={() => {
                toggleSlider();
                history.push("/login");
              }}
            >
              Login
            </Button>
          </Grid>
          <Grid item style={{ padding: 10 }}>
            <Button
              variant="outlined"
              color="primary"
              style={{ boxShadow: "none" }}
              className={classes.mobileAuthButton}
              onClick={() => {
                toggleSlider();
                history.push("/signup");
              }}
            >
              Sign Up
            </Button>
          </Grid>
        </SideBar>
      )}
    </Headroom>
  );
}

export default MiniNavbar;