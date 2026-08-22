import * as actions from "../../actions/actionTypes";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  blockedUsers: [],
  mutedUsers: []
};

const NotificationsDataReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.GET_NOTIFICATION_DATA_START:
      return { ...state, loading: true };

    case actions.GET_NOTIFICATION_DATA_SUCCESS:
      return {
        ...state,
        notifications: payload,
        loading: false,
        error: false
      };

    case actions.GET_NOTIFICATION_DATA_FAIL:
      return { ...state, loading: false, error: payload };

    case actions.READ_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.notification_id === payload
            ? { ...notification, isRead: true }
            : notification
        )
      };

    case actions.DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.notification_id !== payload
        )
      };

    case actions.BLOCK_USER_SUCCESS:
      return {
        ...state,
        blockedUsers: [...state.blockedUsers, payload],
        notifications: state.notifications.filter(
          notification => notification.username !== payload
        )
      };

    case actions.MUTE_USER_SUCCESS:
      return {
        ...state,
        mutedUsers: [...state.mutedUsers, payload]
      };

    case actions.GET_BLOCKED_USERS_SUCCESS:
      return {
        ...state,
        blockedUsers: payload
      };

    default:
      return state;
  }
};

export default NotificationsDataReducer;
