import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useStyles from "./styles";
import SideBar from "../SideBar";
import Profile from "../../assets/images/profile.svg";
import UserSettings from "../../assets/images/user-settings.svg";
import OrganizationSettings from "../../assets/images/organization-settings.svg";
import SocialMedia from "../../assets/images/social-media.svg";
import Notification from "../../assets/images/notification.svg";
import Email from "../../assets/images/email.svg";
import Password from "../../assets/images/password.svg";
import Org from "../../assets/images/org.svg";
import SwitchImg from "../../assets/images/switch.svg";
import UserForm from "../Forms/UserForm";
import UserAccount from "../Forms/UserAccount";
import ConnectSocials from "../Profile/ConnectSocials";
import UserEmail from "../Forms/UserEmail";
import UserPassword from "../Forms/UserPassword";
import Organizations from "../Profile/Organizations";
import { Link, Route, Switch, useParams } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import { useSelector } from "react-redux";
import useWindowSize from "../../helpers/customHooks/useWindowSize";

function UserDashboard() {
  const classes = useStyles();

  const [openMenu, setOpen] = useState(true);
  const toggleSlider = () => {
    setOpen(!openMenu);
  };

  const params = useParams();
  const windowSize = useWindowSize();

  const navLinks = [
    {
      name: "Profile",
      img: Profile,
      link: "/user-dashboard/profile",
      dataTestId: "profile"
    },
    {
      name: "User Settings",
      img: UserSettings,
      link: "/user-dashboard/settings",
      dataTestId: "userSettings"
    },
    // {
    //   name: "Notifications",
    //   img: Notification,
    //   link: "/user-dashboard/notifications",
    //   dataTestId: "notifications"
    // },
    {
      name: "Social Media",
      img: SocialMedia,
      link: "/user-dashboard/socials",
      dataTestId: "socialMedia"
    },
    {
      name: "Emails",
      img: Email,
      link: "/user-dashboard/email",
      dataTestId: "emails"
    },
    {
      name: "Password",
      img: Password,
      link: "/user-dashboard/password",
      dataTestId: "password"
    },
    {
      name: "Organizations",
      img: Org,
      link: "/user-dashboard/organizations",
      dataTestId: "organizations"
    }
  ];

  const notifications = useSelector(
    state => state.notifications.data.notifications
  );
  const notificationCount = notifications?.filter(
    notification => !notification.isRead
  ).length;

  const getData = prop => (Boolean(prop) ? prop : "");
  const profileData = useSelector(({ firebase: { profile } }) => profile);
  const [name, setName] = useState(getData(profileData.displayName));
  return (
    <Box className={classes.root}>
      <Box style={{ xs: { padding: 0 }, md: { padding: "0 30px" } }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Box style={{ display: "flex", alignItems: "center" }}>
            {windowSize.width <= 960 && (
              <IconButton>
                <MenuIcon
                  onClick={() => {
                    toggleSlider();
                  }}
                ></MenuIcon>
              </IconButton>
            )}
            <Avatar
              aria-label="recipe"
              className={classes.avatar}
              data-testId="UserAvatar"
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Box marginLeft={1} data-testId="switchAccount">
              <Typography className={classes.name}>{name}</Typography>
              <Box style={{ display: "flex", alignItems: "center" }}>
                <Typography className={classes.account}>
                  Personal account
                </Typography>
                <img src={SwitchImg} className={classes.image} alt="profile" />
                <Typography
                  className={classes.account}
                  data-testId="switchAccount_switch"
                >
                  Switch
                </Typography>
              </Box>
            </Box>
          </Box>
          <Link to="/profile">
            <Button className={classes.button}>Go to profile</Button>
          </Link>
        </Box>
      </Box>
      <Grid
        container
        data-testId="homepage"
        spacing={2}
        sx={{
          p: 2
        }}
      >
        {windowSize.width <= 960 && (
          <div data-testId="homepageSidebarSmall">
            <SideBar
              open={openMenu}
              menuItems={navLinks}
              toggleSlider={toggleSlider}
              notificationCount={notificationCount}
              drawWidth={960}
            />
          </div>
        )}
        <Grid item className={classes.sidebar}>
          <SideBar
            open={openMenu}
            toggleSlider={toggleSlider}
            menuItems={navLinks}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={9}
          style={{ xs: { padding: 0 }, md: { padding: "0 20px" } }}
        >
          <Typography className={classes.heading}>
            {params.page.charAt(0).toUpperCase() + params.page.substr(1)}
          </Typography>
          {/* 
				 	Router for the user dashboard 
				  */}
          <Switch>
            <Route
              exact
              path={"/user-dashboard/profile"}
              component={UserForm}
            />
            <Route
              exact
              path={"/user-dashboard/settings"}
              component={UserAccount}
            />
            <Route
              exact
              path={"/user-dashboard/socials"}
              component={ConnectSocials}
            />
            <Route exact path={"/user-dashboard/email"} component={UserEmail} />
            <Route
              exact
              path={"/user-dashboard/password"}
              component={UserPassword}
            />
            <Route
              exact
              path={"/user-dashboard/organizations"}
              component={Organizations}
            />
          </Switch>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserDashboard;
