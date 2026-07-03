import * as actions from "../../actions/actionTypes";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  toast: { message: null, open: false }
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

    case actions.MARK_ALL_NOTIFICATIONS_READ_START:
      return { ...state, loading: true, error: null };

    case actions.MARK_ALL_NOTIFICATIONS_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
      };

    case actions.MARK_ALL_NOTIFICATIONS_READ_FAIL:
      return { ...state, loading: false, error: payload };

    case actions.SHOW_NOTIFICATION_TOAST:
      return { ...state, toast: { message: payload, open: true } };

    case actions.HIDE_NOTIFICATION_TOAST:
      return { ...state, toast: { message: null, open: false } };

    default:
      return state;
  }
};

export default NotificationsDataReducer;
