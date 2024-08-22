import * as actions from "../../actions/actionTypes";

const initialState = {
  loading: false,
  error: null
};

const NotificationsAddReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.ADD_NOTIFICATION_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.ADD_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false
      };

    case actions.ADD_NOTIFICATION_FAILED:
      return {
        ...state,
        loading: false,
        error: payload
      };

    default:
      return state;
  }
};

export default NotificationsAddReducer;
