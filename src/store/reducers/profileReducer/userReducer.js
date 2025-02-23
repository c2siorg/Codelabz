import * as actions from "../../actions/actionTypes";

const initialState = {
  loading: false,
  error: null,
  data: null
};

const ProfileUserReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.CLEAR_USER_PROFILE_DATA_STATE:
      return initialState;

    case actions.GET_USER_DATA_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.GET_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        data: payload
      };

    case actions.GET_USER_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };

    case actions.GET_USER_FOLLOWERS_START:
      return {
        ...state,
        data: {
          ...(state.data || {}),
          followers: {
            loading: true,
            error: null,
            data: null
          }
        }
      };

    case actions.GET_USER_FOLLOWERS_SUCCESS:
      return {
        ...state,
        data: {
          ...(state.data || {}),
          followers: {
            loading: false,
            error: false,
            data: payload
          }
        }
      };

    case actions.GET_USER_FOLLOWERS_FAIL:
      return {
        ...state,
        data: {
          ...(state.data || {}),
          followers: {
            loading: false,
            error: payload
          }
        }
      };

    case actions.GET_USER_FOLLOWINGS_START:
      return {
        ...state,
        data: {
          ...(state.data || {}),
          followings: {
            loading: true,
            error: null,
            data: null
          }
        }
      };

    case actions.GET_USER_FOLLOWINGS_SUCCESS:
      return {
        ...state,
        data: {
          ...(state.data || {}),
          followings: {
            loading: false,
            error: false,
            data: payload
          }
        }
      };

    case actions.GET_USER_FOLLOWINGS_FAIL:
      return {
        ...state,
        data: {
          ...(state.data || {}),
          followings: {
            loading: false,
            error: payload
          }
        }
      };

    default:
      return state;
  }
};

export default ProfileUserReducer;
