import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardComponent from "../CodelabCard/index";
import Typography from "@mui/material/Typography";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { userList } from "./userList";
import useStyles from "./styles";
import SideBar from "../SideBar/index";
import TagCard from "../CardTabs/Tags/index";
import EventsCard from "../CardTabs/Events/index";
import OrgUser from "../../assets/images/org-user.svg";
import UserCard from "../CardTabs/Users/index";
import NewCodelabz from "../Topbar/NewCodelabz";
import CardWithPicture from "../Card/CardWithPicture";
import CardWithoutPicture from "../Card/CardWithoutPicture";
import Activity from "../Topbar/Activity";
import useWindowSize from "../../helpers/customHooks/useWindowSize";
import NewTutorial from "../Tutorials/NewTutorial";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import {
  getTutorialFeedData,
  getTutorialFeedIdArray
} from "../../store/actions/tutorialPageActions";
import CardWithVideo from "../Card/CardWithVideo";
import { getTutorialsByTopTags,getAllTags,getFilteredTutorials } from "../../store/actions";

function HomePage({ background = "white", textColor = "black" }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const tutorialFeedArray = useSelector(
    ({ tutorialPage }) => tutorialPage.feed.homepageFeedArray
  );
  const [tutorials, setTutorials] = useState(tutorialFeedArray);
  const [selectedTab, setSelectedTab] = useState("1");
  const [visibleModal, setVisibleModal] = useState(false);
  const [footerContent, setFooterContent] = useState([
    { name: "Help", link: "https://dev.codelabz.io/" },
    { name: "About", link: "https://dev.codelabz.io/" },
    { name: "Content Policy", link: "https://dev.codelabz.io/" },
    { name: "Terms", link: "https://dev.codelabz.io/" },
    { name: "Privacy Policy", link: "https://dev.codelabz.io/" },
    {
      name: `CodeLabz @${new Date().getFullYear()}`,
      link: "https://dev.codelabz.io/"
    }
  ]);
  let tutorialIdArray;
  const windowSize = useWindowSize();
  const [openMenu, setOpen] = useState(false);
  const toggleSlider = () => {
    setOpen(!openMenu);
  };
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
  const [tags, setTags] = useState([]);


    useEffect(()=>{
      const fetchTags = async () =>{
        try{
          const fetchedTags = await getAllTags()(firebase,firestore);
          
          setTags(fetchedTags);
          
          console.log(tags);
        }catch(Error){
          console.error('Error fetching tags:', error);
  
        }
      }
  
      fetchTags();
    },[firebase, firestore])

  const profileData = useSelector(({ firebase: { profile } }) => profile);

  useEffect(() => {
    const getFeed = async () => {
      if (profileData?.uid) {
        try {
          tutorialIdArray = await getTutorialFeedIdArray(profileData.uid)(
            firebase,
            firestore,
            dispatch
          );
          if (Array.isArray(tutorialIdArray) && tutorialIdArray.length > 0) {
            getTutorialFeedData(tutorialIdArray)(firebase, firestore, dispatch);
          } else {
            // Handle empty tutorial array - set empty tutorials
            setTutorials([]);
          }
        } catch (error) {
          console.error("Error fetching tutorial data:", error);
          setTutorials([]);
        }
      }
    };
    getFeed();
  }, [profileData.uid, firebase, firestore, dispatch]);

  useEffect(() => {
    setTutorials(tutorialFeedArray);
  }, [tutorialFeedArray]);

  const notifications = useSelector(
    state => state.notifications.data.notifications
  );
  const notificationCount = notifications?.filter(
    notification => !notification.isRead
  ).length;

  const convertToDate = timestamp => {
    return new Date(timestamp.seconds * 1000);
  };

  const handleTagSelection = async (selectedTags) => {
    try {
      const filteredTutorials = await getFilteredTutorials(selectedTags)(
        firebase,
        firestore,
        dispatch
      );
      setTutorials(filteredTutorials);
    } catch (error) {
      console.error("Error filtering tutorials:", error);
    }
  };

  const handleFeedChange = async filterType => {
    let filteredTutorials;
    switch (filterType) {
      case "Featured":
        filteredTutorials = await getTutorialsByTopTags()(
          firebase,
          firestore,
          dispatch
        );
        break;
      case "New":
        await fetchNewTutorials();
        filteredTutorials = [...tutorialFeedArray].sort(
          (a, b) => convertToDate(b.createdAt) - convertToDate(a.createdAt)
        );
        break;
      case "Top":
        await fetchNewTutorials();
        filteredTutorials = [...tutorialFeedArray].sort(
          (a, b) => b.upVotes - a.upVotes
        );
        break;
      default:
        filteredTutorials = tutorials;
    }

    setTutorials(filteredTutorials);
  };

  const fetchNewTutorials = async () => {
    await getTutorialFeedData(tutorialIdArray)(firebase, firestore, dispatch);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const closeModal = () => {
    setVisibleModal(prev => !prev);
  };

  console.log(tutorials)
  return (
    <Card
      className={classes.wrapper}
      style={{ background: background }}
      data-testId="homepage"
    >
      <Grid container justifyContent="center" className={classes.contentPart}>
        <Grid item xs={2} className={classes.sideBody}>
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
                <SideBar
                  open={openMenu}
                  toggleSlider={toggleSlider}
                  notificationCount={notificationCount}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid
          item
          className={classes.mainBody}
          data-testId="homepageMainBody"
          xs={6}
        >
          <NewCodelabz setVisibleModal={setVisibleModal} />
          <NewTutorial
            viewModal={visibleModal}
            onSidebarClick={e => closeModal(e)}
          />
          <Card className={classes.card}>
            <Activity handleFeedChange={handleFeedChange} />
          </Card>
          <Box item sx={{ display: { md: "none" } }}>
          <TagCard 
    tags={tags} 
    onTagSelect={handleTagSelection}
  />
          </Box>
                    {tutorials?.length > 0 ? (
            tutorials.map(tutorial => {
            return tutorial?.featured_video ? (<CardWithVideo tutorial={tutorial}/>): !tutorial?.featured_image ? (
                <CardWithoutPicture key={tutorial.id} tutorial={tutorial} />
              ) : (
                <CardWithPicture key={tutorial.id} tutorial={tutorial} />
              );
            })
          ) : (
            <Card className={classes.card}>
              <Typography variant="body1" align="center" style={{padding: '20px'}}>
                No tutorials available. Create your first tutorial!
              </Typography>
            </Card>
          )}
          <Box
            sx={{
              width: "100%",
              typography: "subtitle1",
              display: { md: "none" }
            }}
          >
            <TabContext value={selectedTab}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
                style={{
                  borderBottom: "1px solid gray",
                  margin: "5px"
                }}
              >
                <Tab
                  icon={<EventAvailableIcon />}
                  value="1"
                  style={{ width: "25%" }}
                />
                <Tab
                  icon={<EventSeatIcon />}
                  value="2"
                  style={{ width: "25%" }}
                />
                <Tab
                  icon={<ThumbUpAltIcon />}
                  value="3"
                  style={{ width: "25%" }}
                />
                <Tab
                  icon={<SupervisorAccountIcon />}
                  value="4"
                  style={{ width: "25%" }}
                />
              </Tabs>
              <TabPanel value="1" style={{ padding: 0 }}>
                <EventsCard title={"Upcoming Events"} events={upcomingEvents} />
              </TabPanel>
              <TabPanel value="2" style={{ padding: 0 }}>
                <EventsCard title={"Popular Events"} events={upcomingEvents} />
              </TabPanel>
              <TabPanel value="3" style={{ padding: 0 }}>
                <UserCard title={"Who to Follow"} userId={profileData.uid} />
              </TabPanel>
              <TabPanel value="4" style={{ padding: 0 }}>
                <UserCard title={"Contributors"} userId={profileData.uid} />
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>

        <Grid item className={classes.sideBody} xs={3}>
          <Grid
            item
            container
            alignContent="center"
            direction="column"
            style={{
              width: "100%"
            }}
            data-testId="homepageTagSidebar"
          >
            <Grid item style={{ minWidth: "100%" }}>
            <TagCard 
    tags={tags} 
    onTagSelect={handleTagSelection}
  />
            </Grid>
          </Grid>
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
              <UserCard title={"Who to Follow"} userId={profileData.uid} />
            </Grid>
          </Grid>
          <Grid
            container
            alignContent="center"
            direction="column"
            style={{
              width: "100%",
              overflow: "auto",
              maxHeight: "25rem",
              backgroundColor: "transparent",
              border: "none",
              boxShadow: "none"
            }}
            data-testId="homepageContributors"
          >
            <Grid item style={{ minWidth: "100%" }}>
              <UserCard title={"Contributors"} userId={profileData.uid} />
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
    </Card>
  );
}

export default HomePage;
