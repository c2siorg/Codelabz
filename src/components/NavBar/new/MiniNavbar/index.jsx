import {
  Button,
  Drawer,
  Grid,
  IconButton,
  InputBase,
  Paper
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useState } from "react";
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

// ── Styled components (replaces deprecated makeStyles) ──────────
const SearchPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: "2px",
  border: "1px solid #ced4da",
  borderRadius: "0.8rem",
  width: "100%",
  display: "flex",
  alignItems: "center"
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  color: "#3e5060",
  letterSpacing: "0.5px"
}));

const SearchIconButton = styled(IconButton)(({ theme }) => ({
  padding: "2px",
  color: theme.palette.primary.main
}));

const NavButton = styled(Button)(() => ({
  borderRadius: "10px"
}));

const HamburgerBox = styled("div")(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.up("md")]: {
    display: "none"
  }
}));

const ButtonBox = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    display: "none"
  }
}));

// ────────────────────────────────────────────────────────────────

function MiniNavbar() {
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

  // Single source of truth for window size — no duplicate resize logic
  const windowSize = useWindowSize();
  const isMobile = (windowSize.width ?? 0) <= 960;

  const toggleSlider = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const toggleDrawer = useCallback(state => {
    setOpenDrawer(state);
  }, []);

  const location = useLocation();
  const routeName = location.pathname;
  const excludedRoutes = ["/login", "/signup"];

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

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Headroom disableInlineStyles>
      <nav style={{ padding: "10px", background: "white" }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          {/* Brand + Hamburger */}
          <Grid item xs={12} md={3} container alignItems="center">
            <Grid
              item
              style={{ flexGrow: 1, cursor: "pointer" }}
              onClick={() => history.push("/")}
              data-testid="navbarBrand"
            >
              <BrandName />
            </Grid>
            <HamburgerBox>
              <IconButton
                aria-label="open navigation menu"
                onClick={isMobile ? toggleSlider : () => toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </HamburgerBox>
          </Grid>

          {/* Search Bar */}
          {!excludedRoutes.includes(routeName) && (
            <Grid item xs={12} md={4}>
              <SearchPaper component="form" elevation={0}>
                <SearchIconButton
                  type="button"
                  aria-label="search"
                  disableRipple
                  data-testid="navbarSearch"
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </SearchIconButton>
                <SearchInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  inputProps={{ "aria-label": "search tutorials" }}
                />
              </SearchPaper>
            </Grid>
          )}

          {/* Login / Sign Up buttons */}
          <Grid item>
            <ButtonBox>
              <NavButton
                variant="contained"
                color="primary"
                style={{ boxShadow: "none", color: "white" }}
                data-test-id="login"
                onClick={() => history.push("/login")}
              >
                Login
              </NavButton>
              <NavButton
                variant="outlined"
                color="primary"
                style={{ boxShadow: "none" }}
                onClick={() => history.push("/signup")}
              >
                Sign Up
              </NavButton>
            </ButtonBox>
          </Grid>
        </Grid>
      </nav>

      {/* Desktop Drawer */}
      {!isMobile && (
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
              <IconButton aria-label="close drawer">
                <CloseIcon onClick={() => toggleDrawer(false)} />
              </IconButton>
            </Grid>
            <Grid item style={{ padding: 10 }}>
              <NavButton
                variant="contained"
                color="primary"
                style={{ boxShadow: "none", color: "white" }}
                onClick={() => {
                  toggleDrawer(false);
                  history.push("/login");
                }}
              >
                Login
              </NavButton>
            </Grid>
            <Grid item style={{ padding: 10 }}>
              <NavButton
                variant="outlined"
                color="primary"
                style={{ boxShadow: "none" }}
                onClick={() => {
                  toggleDrawer(false);
                  history.push("/signup");
                }}
              >
                Sign Up
              </NavButton>
            </Grid>
          </Grid>
        </Drawer>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <SideBar
          open={openMenu}
          toggleSlider={toggleSlider}
          notificationCount={notificationCount}
        >
          <Grid item style={{ padding: 10 }}>
            <NavButton
              variant="contained"
              color="primary"
              style={{ boxShadow: "none", color: "white" }}
              onClick={() => {
                toggleSlider();
                history.push("/login");
              }}
            >
              Login
            </NavButton>
          </Grid>
          <Grid item style={{ padding: 10 }}>
            <NavButton
              variant="outlined"
              color="primary"
              style={{ boxShadow: "none" }}
              onClick={() => {
                toggleSlider();
                history.push("/signup");
              }}
            >
              Sign Up
            </NavButton>
          </Grid>
        </SideBar>
      )}
    </Headroom>
  );
}

export default MiniNavbar;
