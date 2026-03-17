import {
  Box,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import Headroom from "react-headroom";
import BrandName from "../../../../helpers/brandName";
import SearchIcon from "@mui/icons-material/Search";
import RightMenu from "./RightMenu";
import LeftMenu from "./LeftMenu";
import { useHistory } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
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
    borderRadius: "0.8rem",
    [theme.breakpoints.between("sm", "md")]: {
      maxWidth: "60%",
      margin: "0 auto"
    }
  },
  icon: {
    padding: "2px",
    color: theme.palette.primary.main
  },
  grid: {
    width: "auto",
    "& > *": {},
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      marginTop: theme.spacing(1)
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
          sx={{ px: { xs: 1, sm: 2 } }}
        >
          <Grid item xs="auto" sx={{ display: "flex", alignItems: "center" }}>
            <div
              onClick={() => {
                history.push("/");
              }}
              data-testid="navbarBrand"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
              }}
            >
              <BrandName />
            </div>
          </Grid>

          <Grid
            item
            xs
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center"
            }}
          >
            <Paper
              component={"form"}
              className={classes.root}
              elevation={0}
              onSubmit={handleSearch}
              sx={{
                maxWidth: "600px",
                width: "100%",
                mx: "2rem"
              }}
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
            xs="auto"
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1
            }}
          >
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1
              }}
            >
              <LeftMenu />
            </Box>
            <RightMenu nav={true} />
            <Box className={classes.hamburger}>
              <IconButton
                onClick={() => {
                  toggleSlider();
                }}
                sx={{ ml: 0.5 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Mobile/Tablet Search Row (Below Logo/Menu) */}
          <Grid
            item
            xs={12}
            sx={{ display: { xs: "flex", md: "none" }, mt: 2, pb: 1 }}
          >
            <Paper
              component={"form"}
              className={classes.root}
              elevation={0}
              onSubmit={handleSearch}
              sx={{
                width: "100%",
                borderRadius: "2rem",
                display: "flex",
                alignItems: "center",
                px: 1
              }}
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
                placeholder="Search tutorials..."
                onChange={handleSearchChange}
                sx={{ width: "100%", ml: 1 }}
              />
            </Paper>
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
