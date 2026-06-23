import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
import { createBrowserHistory as createHistory } from "history";
import Spinner from "../helpers/spinner";
import _ from "lodash";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { compose } from "redux";

const locationHelper = locationHelperBuilder({});
const browserHistory = createHistory();
const unverifiedProviders = ["facebook.com", "github.com", "twitter.com"];
const verifiedProviders = ["google.com", "password"];

const UserIsAuthenticated = connectedRouterRedirect({
  wrapperDisplayName: "UserIsAuthenticated",
  AuthenticatingComponent: Spinner,
  allowRedirectBack: false,
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || "/login",
  authenticatingSelector: ({ firebase: { auth, isInitializing } }) => {
    return !isLoaded(auth) || isInitializing === true;
  },
  authenticatedSelector: ({ firebase: { auth } }) =>
    authenticatedSelectorForAuthenticated(auth),
  redirectAction: newLoc => dispatch => {
    browserHistory.replace(newLoc); // or routerActions.replace
    dispatch({ type: "UNAUTHED_REDIRECT" });
  }
});

export const UserIsNotAuthenticated = connectedRouterRedirect({
  wrapperDisplayName: "UserIsNotAuthenticated",
  AuthenticatingComponent: Spinner,
  allowRedirectBack: false,
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || "/dashboard",
  authenticatingSelector: ({ firebase: { auth, profile, isInitializing } }) =>
    (!isLoaded(auth) || isInitializing === true) && isLoaded(profile),
  authenticatedSelector: ({ firebase: { auth } }) =>
    authenticatedSelectorForNotAuthenticated(auth),
  redirectAction: newLoc => dispatch => {
    browserHistory.replace(newLoc); // or routerActions.replace
    dispatch({ type: "UNAUTHED_REDIRECT" });
  }
});

const UserIsAllowedDashboard = connectedRouterRedirect({
  wrapperDisplayName: "UserIsAllowedDashboard",
  AuthenticatingComponent: Spinner,
  allowRedirectBack: false,
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || "/dashboard",
  authenticatingSelector: ({ firebase: { profile } }) => {
    return Boolean(!profile.uid);
  },
  authenticatedSelector: ({ firebase: { profile } }) =>
    authenticatedSelectorForAllowedDashboard(profile),
  redirectAction: newLoc => dispatch => {
    browserHistory.replace(newLoc); // or routerActions.replace
    dispatch({ type: "UNAUTHED_REDIRECT" });
  }
});

const UserIsNotAllowedDashboard = connectedRouterRedirect({
  wrapperDisplayName: "UserIsNotAllowedDashboard",
  AuthenticatingComponent: Spinner,
  allowRedirectBack: false,
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || "/dashboard/my_feed",
  authenticatingSelector: ({ firebase: { profile } }) => {
    return Boolean(!profile.uid);
  },
  authenticatedSelector: ({ firebase: { profile } }) =>
    !authenticatedSelectorForAllowedDashboard(profile),
  redirectAction: newLoc => dispatch => {
    browserHistory.replace(newLoc); // or routerActions.replace
    dispatch({ type: "UNAUTHED_REDIRECT" });
  }
});

const AllowOrgManager = connectedRouterRedirect({
  wrapperDisplayName: "AllowOrgManager",
  AuthenticatingComponent: Spinner,
  allowRedirectBack: false,
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || "/",
  authenticatingSelector: ({
    firebase: { profile },
    profile: { data },
    org: { general }
  }) => {
    return !(
      isLoaded(data) &&
      !isEmpty(data) &&
      isLoaded(general) &&
      !isEmpty(general) &&
      isLoaded(profile) &&
      !isEmpty(profile)
    );
  },
  authenticatedSelector: ({
    org: {
      general: { permissions }
    }
  }) => {
    return [0, 1, 2, 3].some(e => permissions.includes(e));
  },
  redirectAction: newLoc => dispatch => {
    browserHistory.replace(newLoc); 
    dispatch({ type: "UNAUTHED_REDIRECT" });
  }
});

const authenticatedSelectorForNotAuthenticated = auth =>
  isLoaded(auth) && !isEmpty(auth)
    ? !(
        (!auth.emailVerified &&
          unverifiedProviders.includes(
            _.get(auth, "providerData[0].providerId", "")
          )) ||
        (auth.emailVerified &&
          auth.providerData &&
          verifiedProviders.includes(
            _.get(auth, "providerData[0].providerId", "")
          ))
      )
    : true;

const authenticatedSelectorForAuthenticated = auth =>
  isLoaded(auth) &&
  !isEmpty(auth) &&
  (auth.emailVerified ||
    unverifiedProviders.includes(
      _.get(auth, "providerData[0].providerId", "")
    ));

const authenticatedSelectorForAllowedDashboard = profile => {
  return Boolean(_.get(profile, "handle", false));
};

export const UserIsAllowedUserDashboard = compose(
  UserIsAuthenticated,
  UserIsAllowedDashboard
);

export const UserIsNotAllowedUserDashboard = compose(
  UserIsAuthenticated,
  UserIsNotAllowedDashboard
);

export const UserIsAllowOrgManager = compose(
  UserIsAllowedUserDashboard,
  AllowOrgManager
);

const AllowAdminDashboard = connectedRouterRedirect({
  wrapperDisplayName: "AllowAdminDashboard",
  AuthenticatingComponent: Spinner,
  allowRedirectBack: false,
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || "/dashboard/my_feed",
  authenticatingSelector: ({ firebase: { profile } }) => {
    return Boolean(!profile.uid);
  },
  authenticatedSelector: ({ firebase: { profile } }) =>
    profile.is_platform_admin === true,
  redirectAction: newLoc => dispatch => {
    browserHistory.replace(newLoc);
    dispatch({ type: "UNAUTHED_REDIRECT" });
  }
});

export const UserIsAdminDashboard = compose(
  UserIsAllowedUserDashboard,
  AllowAdminDashboard
);
