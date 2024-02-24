import React from "react";
import { useSelector } from "react-redux";
import { isEmpty, isLoaded } from "react-redux-firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  UserIsAllowedUserDashboard,
  UserIsAllowOrgManager,
  UserIsNotAllowedUserDashboard
} from "./auth";
import { AllowManageUser } from "./auth/manageUserAuth";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import Editor from "./components/Editor";
import NotFound from "./components/ErrorPages/404";
import HomePage from "./components/HomePage/index";
import ManageUsers from "./components/ManageUsers";
import MyFeed from "./components/MyFeed";
import Organization from "./components/Organization";
import ViewOrganization from "./components/Organization/ViewOrganization";
import Profile from "./components/Profile";
import ProfileView from "./components/Profile/ViewProfile";
import ViewTutorial from "./components/Tutorials";
import MyTutorials from "./components/Tutorials/MyTutorials";
import Spinner from "./helpers/spinner";
import CodeLabzAppBar from "./helpers/appBar";
import MainNavbar from "./components/NavBar/new/MainNavbar";
import UserDashboard from "./components/UserDashboard";
import TutorialPage from "./components/TutorialPage";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

const AuthIsLoaded = ({ children }) => {
  const profile = useSelector(({ firebase: { profile } }) => profile);
  const data = useSelector(({ profile: { data } }) => data);
  const general = useSelector(({ org: { general } }) => general);

  //case for not logged in user
  if (
    isLoaded(profile) &&
    isEmpty(profile) &&
    isLoaded(data) &&
    isEmpty(data) &&
    isLoaded(general) &&
    isEmpty(general)
  )
    return children;

  //case for logged in uncompleted user
  if (
    isLoaded(profile) &&
    !isEmpty(profile) &&
    isLoaded(data) &&
    isEmpty(data) &&
    isLoaded(general) &&
    isEmpty(general)
  )
    return children;

  //case for authed org user
  if (
    isLoaded(profile) &&
    !isEmpty(profile) &&
    isLoaded(data) &&
    !isEmpty(data) &&
    isLoaded(general) &&
    !isEmpty(general)
  )
    return children;

  //case for authed normal user
  if (
    isLoaded(profile) &&
    !isEmpty(profile) &&
    isLoaded(data) &&
    isEmpty(data) &&
    isLoaded(general) &&
    isEmpty(general)
  )
    return children;

  return <Spinner />;
};

// Remember to add the paths that the MINI navbar should
// be shown in components/NavBar/navbarPaths.js

const Routes = () => {
  return (
    <Router>
      <AuthIsLoaded>
        
        {/* <Navbar /> */}
        <Switch>
          <Route
            exact
            path={"/"}
            render={props => (
              <>
                <CodeLabzAppBar />
                <HomePage {...props} type={"Home"} />
                <Footer />
              </>
            )}
          />
          <Route
            exact
            path={"/login"}
            render={props => <AuthPage {...props} type={"login"} />}
          />
          <Route
            exact
            path={"/signup"}
            render={props => <AuthPage {...props} type={"signup"} />}
          />
          <Route
            exact
            path={"/forgotpassword"}
            render={props => <AuthPage {...props} type={"forgotpassword"} />}
          />
          <Route
            exact
            path={"/manageusers"}
            render={props =><><CodeLabzAppBar /><ManageUsers {...props} /></>}
          />
          <Route
            exact
            path={"/dashboard"}
            render={props =><><CodeLabzAppBar /><Dashboard {...props} /></>}
          />
          <Route
            exact
            path={"/dashboard/my_feed"}
            render={props => <><CodeLabzAppBar /><MyFeed {...props} /></>}
          />
          <Route
            exact
            path={"/profile"}
            render={props =><><CodeLabzAppBar /><Profile {...props} /></>}
          />

          <Route
            exact
            path={"/org/settings/:handle"}
            render={props =><><CodeLabzAppBar /><Organization {...props} /></>}
          />
          <Route
            exact
            path={"/tutorials"}
            render={props =><><CodeLabzAppBar /><MyTutorials {...props} /></>}
          />
          <Route
            exact
            path={"/tutorials/:owner/:tutorial_id"}
            render={props =><><CodeLabzAppBar /><ViewTutorial {...props} /></>}
          />
          <Route
            exact
            path={"/user/:handle"}
            render={props =><><CodeLabzAppBar /><ProfileView {...props} /></>}            
          />
          <Route
            exact
            path={"/org/:handle"}
            render={props =><><CodeLabzAppBar /><ViewOrganization {...props} /></>}
          />
          <Route
            exact
            path={"/tutorial/:id"}
            render={props =><><CodeLabzAppBar /><TutorialPage {...props} /></>}
          />
          <Route
            exact
            path={"/editor"}
            render={props =><><CodeLabzAppBar /><Editor {...props} /></>}
          />
          <Route
            path={"/user-dashboard/:page"}
            render={props =><><CodeLabzAppBar /><UserDashboard {...props} /></>}
          />
          <Route
            exact
            path={"/notification"}
            render={props =><><CodeLabzAppBar /><Notification {...props} /></>}
          />
          <Route exact path={"*"} component={NotFound} />
        </Switch>
      </AuthIsLoaded>
    </Router>
  );
};

export default Routes;
