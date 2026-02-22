import * as actions from "../../actions/actionTypes";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  listenerActive: false,
  unsubscribe: null
};

const NotificationsDataReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.GET_NOTIFICATION_DATA_START:
      return {
        ...state,
        loading: true
      };

    case actions.GET_NOTIFICATION_DATA_SUCCESS:
      return {
        ...state,
        notifications: payload,
        loading: false,
        error: false
      };

    case actions.GET_NOTIFICATION_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };

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

    case actions.NOTIFICATION_LISTENER_SET:
      return {
        ...state,
        listenerActive: true,
        unsubscribe: payload
      };

    case actions.NOTIFICATION_LISTENER_UNSUBSCRIBED:
      return {
        ...state,
        listenerActive: false,
        unsubscribe: null,
        notifications: [],
        loading: false,
        error: null
      };

    default:
      return state;
  }
};

export default NotificationsDataReducer;

