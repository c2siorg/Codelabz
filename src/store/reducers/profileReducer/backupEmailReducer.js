import * as actions from "../../actions/actionTypes";

const initialState = {
  loading: false,
  error: null,
  data: null
};

const BackupEmailReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.BACKUP_EMAIL_START:
      return {
        ...state,
        loading: true
      };

    case actions.BACKUP_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        data: payload
      };

    case actions.BACKUP_EMAIL_FAILED:
      return {
        ...state,
        loading: false,
        error: payload
      };

    default:
      return state;
  }
};

export default BackupEmailReducer;