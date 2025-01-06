import { Grid, IconButton, InputBase, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import Headroom from "react-headroom";
import BrandName from "../../../../helpers/brandName";
import SearchIcon from "@mui/icons-material/Search";
import RightMenu from "./RightMenu";
import LeftMenu from "./LeftMenu";
import { useHistory } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import SideBar from "../../../SideBar/index";
import useWindowSize from "../../../../helpers/customHooks/useWindowSize";

const useStyles = makeStyles(theme => ({
  input: {
    marginLeft: theme.spacing(1),
    color: "#3e5060",
    letterSpacing: "0.5px",
    flex: 1,
    width: "92%",
    [theme.breakpoints.down("md")]: {
      width: "80%"
    }
  },
  root: {
    backgroundColor: theme.palette.grey[50],
    padding: "2px",
    border: "1px solid #ced4da",
    borderRadius: "0.8rem"
  },
  icon: {
    padding: "2px",
    color: theme.palette.primary.main
  },
  grid: {
    width: "auto",
    "& > *": {},
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  button: {
    borderRadius: "10px"
  },
  hamburger: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  drawer: {
    width: 257
  }
}));

function MainNavbar() {
  const classes = useStyles();

  const history = useHistory();
  const windowSize = useWindowSize();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openMenu, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const toggleSlider = () => {
    setOpen(!openMenu);
  };
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

  return (
    <Headroom>
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
        >
          <Grid item container xs={12} md={2} alignItems="center">
            <Grid
              style={{
                flexGrow: "1"
              }}
            >
              <div
                onClick={() => {
                  history.push("/");
                }}
                data-testid="navbarBrand"
              >
                <BrandName />
              </div>
            </Grid>
            <Grid item className={classes.hamburger}>
              <IconButton
                onClick={() => {
                  toggleSlider();
                }}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper
              component={"form"}
              className={classes.root}
              elevation={0}
              onSubmit={handleSearch}
            >
              <IconButton
                type="button"
                aria-label="search"
                disableRipple
                className={classes.icon}
                data-testid="navbarSearch"
                onClick={handleSearch}
              >
                <SearchIcon />
              </IconButton>
              <InputBase
                className={classes.input}
                value={searchQuery}
                placeholder="Search..."
                onChange={handleSearchChange}
              />
            </Paper>
          </Grid>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            className={classes.grid}
          >
            <Grid item justifyContent="center">
              <LeftMenu />
            </Grid>
            <Grid item>
              <RightMenu />
            </Grid>
          </Grid>
        </Grid>
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
