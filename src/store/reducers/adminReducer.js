import * as actions from "../actions/actionTypes";

const initialState = {
  stats: {
    totalUsers: null,
    totalOrgs: null,
    totalTutorials: null
  },
  recentOrgs: [],
  recentUsers: [],
  allOrgs: [],
  auditLog: [],
  loading: false,
  error: null
};

const adminReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.CLEAR_ADMIN_STATE:
      return initialState;

    case actions.GET_ADMIN_STATS_START:
    case actions.GET_ADMIN_ORGS_START:
    case actions.GET_ADMIN_USERS_START:
    case actions.GET_ORG_AUDIT_LOG_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.GET_ADMIN_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: payload
      };

    case actions.GET_ADMIN_ORGS_SUCCESS:
      return {
        ...state,
        loading: false,
        recentOrgs: payload.recentOrgs !== undefined ? payload.recentOrgs : state.recentOrgs,
        allOrgs: payload.allOrgs !== undefined ? payload.allOrgs : state.allOrgs
      };

    case actions.GET_ADMIN_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        recentUsers: payload
      };

    case actions.GET_ORG_AUDIT_LOG_SUCCESS:
      return {
        ...state,
        loading: false,
        auditLog: payload
      };

    case actions.GET_ADMIN_STATS_FAIL:
    case actions.GET_ADMIN_ORGS_FAIL:
    case actions.GET_ADMIN_USERS_FAIL:
    case actions.GET_ORG_AUDIT_LOG_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };

    default:
      return state;
  }
};

export default adminReducer;
