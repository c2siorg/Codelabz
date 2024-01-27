import * as actions from "../../actions/actionTypes";
import { modifyAuthErrorMsg } from "../../../helpers/errorMsgHandler";

const initialState = {
  loading: false,
  error: null
};

const ChangePasswordReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    

    case actions.CHANGE_PASSWORD_START:
    
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.CHANGE_PASSWORD_SUCCESS:
    
      return {
        ...state,
        loading: false,
        error: null
      };

    case actions.CHANGE_PASSWORD_FAIL:
    
      return {
        ...state,
        loading: false,
        error: payload
      };

    default:
      return state;
  }
};

export default ChangePasswordReducer;
