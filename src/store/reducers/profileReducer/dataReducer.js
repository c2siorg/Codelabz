import * as actions from "../../actions/actionTypes";

const initialState = {
  isLoaded: true,
  isEmpty: true,
  error: null,
  // Consumers call .find/.map/.includes on this before any profile action has
  // dispatched, so it has to be an array from the very first render rather
  // than appearing only once GET_PROFILE_DATA_SUCCESS/END lands.
  organizations: []
};

const ProfileDataReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.CLEAR_PROFILE_DATA_STATE:
      return initialState;

    case actions.GET_PROFILE_DATA_START:
      return {
        ...state,
        isLoaded: false,
        isEmpty: true,
        error: null
      };

    case actions.GET_PROFILE_DATA_SUCCESS:
      return {
        ...state,
        ...payload,
        isLoaded: true,
        isEmpty: false,
        error: false
      };

    case actions.GET_PROFILE_DATA_FAIL:
      return {
        ...state,
        isLoaded: true,
        isEmpty: true,
        error: payload
      };

    case actions.GET_PROFILE_DATA_END:
      return {
        ...state,
        isLoaded: true,
        isEmpty: true,
        organizations: []
      };

    default:
      return state;
  }
};

export default ProfileDataReducer;
