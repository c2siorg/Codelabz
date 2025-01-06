import { Grid, Card } from "@mui/material";
import SideBar from "../SideBar";
import EventsCard from "../CardTabs/Events";
import UserCard from "../CardTabs/Users";
import IconButton from "@mui/material/IconButton";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import useStyles from "./styles";
import React, { useState, useEffect } from "react";
import useWindowSize from "../../helpers/customHooks/useWindowSize";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import OrgUser from "../../assets/images/org-user.svg";
import Box from "@mui/material/Box";
import CardWithoutPicture from "../Card/CardWithoutPicture";
import { MoreVertOutlined } from "@mui/icons-material";
import NotificationBox from "./NotificationBox";
import { useSelector, useDispatch } from "react-redux";
import { getNotificationData } from "../../store/actions";
import { useFirebase, useFirestore } from "react-redux-firebase";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

const Notification = ({ background = "white", textColor = "black" }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const [openMenu, setOpen] = useState(false);
  const toggleSlider = () => {
    setOpen(!openMenu);
  };
  const windowSize = useWindowSize();
  const [upcomingEvents, setUpEvents] = useState([
    {
      name: "Google Summer of Code",
      img: [OrgUser],
      date: "25 March, 2022"
    },
    {
      name: "Google Summer of Code",
      img: [OrgUser],
      date: "25 March, 2022"
    },
    {
      name: "Google Summer of Code",
      img: [OrgUser],
      date: "25 March, 2022"
    },
    {
      name: "Google Summer of Code",
      img: [OrgUser],
      date: "25 March, 2022"
    }
  ]);

  const [usersToFollow, setUsersToFollow] = useState([
    {
      name: "Janvi Thakkar",
      img: [OrgUser],
      desg: "Software Engineer",
      onClick: {}
    },
    {
      name: "Janvi Thakkar",
      img: [OrgUser],
      desg: "Software Engineer",
      onClick: {}
    },
    {
      name: "Janvi Thakkar",
      img: [OrgUser],
      desg: "Software Engineer",
      onClick: {}
    },
    {
      name: "Janvi Thakkar",
      img: [OrgUser],
      desg: "Software Engineer",
      onClick: {}
    }
  ]);

  const notifications = useSelector(
    state => state.notifications.data.notifications
  );
  const [localNotifications, setLocalNotifications] = useState(notifications);

  // for instant UI update
  const handleNotificationDelete = id => {
    setLocalNotifications(
      localNotifications.filter(
        notification => notification.notification_id !== id
      )
    );
  };

  useEffect(() => {
    const getNotifications = async () => {
      await getNotificationData()(firebase, firestore, dispatch);
    };

    getNotifications();
    setLocalNotifications(notifications);
  }, [firebase, firestore, dispatch]);

  return (
    <>
      <section
        className={classes.wrapper}
        style={{ background: background }}
        data-testId="homepage"
      >
        <Grid className={classes.contentPart}>
          <div className={classes.sideBody}>
            {windowSize.width > 750 && (
              <Grid
                item
                container
                className={classes.leftSideCard}
                direction="column"
                style={{
                  width: "100%",
                  overflow: "auto",
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none"
                }}
              >
                <Grid item className={classes.outerSideBar}>
                  <SideBar open={openMenu} toggleSlider={toggleSlider} />
                </Grid>
              </Grid>
            )}
          </div>
          <Grid
            item
            className={classes.mainBody}
            data-testId="noitificationMainBody"
            xs={10}
          >
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "1.5rem",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "center"
              }}
            >
              {localNotifications.length > 0 ? "Notifications" : ""}
            </Typography>

            <div className={classes.container}>
              {localNotifications.length > 0 ? (
                localNotifications.map(notification => (
                  <NotificationBox
                    key={notification.notification_id}
                    notification={notification}
                    onDelete={handleNotificationDelete}
                  />
                ))
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    textAlign: "center",
                    color: textColor,
                    padding: "1rem 8rem 0 8rem"
                  }}
                >
                  <NotificationsNoneIcon
                    sx={{ fontSize: 80, marginBottom: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    No notifications available
                  </Typography>
                  <Typography variant="body2">
                    Check back later for updates or explore other sections.
                  </Typography>
                </Box>
              )}
            </div>
          </Grid>
          <Grid item className={classes.sideBody}>
            <Grid
              container
              alignContent="center"
              direction="column"
              style={{
                width: "100%"
              }}
              data-testId="homepageUpcomingEvents"
            >
              <Grid item style={{ minWidth: "100%" }}>
                <EventsCard title={"Upcoming Events"} events={upcomingEvents} />
              </Grid>
            </Grid>
            <Grid
              container
              alignContent="center"
              direction="column"
              style={{
                width: "100%"
              }}
              data-testId="homepageUsersToFollow"
            >
              <Grid item style={{ minWidth: "100%" }}>
                <UserCard title={"Who to Follow"} users={usersToFollow} />
              </Grid>
            </Grid>

            <Grid
              container
              alignContent="center"
              direction="column"
              style={{
                width: "100%"
              }}
              data-testId="homepagePopularEventSidebar"
            >
              <Grid item style={{ minWidth: "100%" }}>
                <EventsCard title={"Popular Events"} events={upcomingEvents} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default Notification;
