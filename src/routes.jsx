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
        <CodeLabzAppBar />
        {/* <Navbar /> */}
        <Switch>
          <Route exact path={"/"} render={props => <><HomePage {...props} /><Footer /></>} />
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
            render={props => <><ManageUsers {...props} /><Footer /></>}
          />
          <Route
            exact
            path={"/dashboard"}
            component={UserIsNotAllowedUserDashboard(Dashboard)}
          />
          <Route
            exact
            path={"/dashboard/my_feed"}
            render={props => <><MyFeed {...props} /><Footer /></>}
          />
          <Route
            exact
            path={"/profile"}
            render={props => <><Profile {...props} /><Footer /></>}
          />

          <Route
            exact
            path={"/org/settings/:handle"}
            render={props => <><Organization {...props} /><Footer /></>}
          />
          <Route
            exact
            path={"/tutorials"}
            render={props => <><MyTutorials {...props} /><Footer /></>}
          />
          <Route
            exact
            path={"/tutorials/:owner/:tutorial_id"}
            render={props => <><ViewTutorial {...props} /><Footer /></>}
          />
          <Route
            exact
            path={"/user/:handle"}
            render={props => <><ProfileView {...props} /><Footer /></>}
          />
          <Route
            exact
            path={"/org/:handle"}
            render={props => <><ViewOrganization {...props} /><Footer /></>}
          />
          <Route
            exact
            path={"/tutorial/:id"}
            render={props => <><TutorialPage {...props} /><Footer /></>}
          />
          <Route
            exact
            path={"/editor"}
            render={props => <><Editor {...props} /><Footer /></>}
          />
          <Route
            path={"/user-dashboard/:page"}
            render={props => <><UserDashboard {...props} /><Footer /></>}
          />
          <Route
            exact
            path={"/notification"}
            render={props => <><Notification {...props} /><Footer /></>}
          />
          <Route exact path={"*"} component={NotFound} />
        </Switch>
        {/* <Footer /> */}
      </AuthIsLoaded>
    </Router>
  );
};

export default Routes;
