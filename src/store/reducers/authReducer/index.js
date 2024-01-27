import { combineReducers } from "redux";
import profileReducer from "./profileReducer";
import verifyEmailReducer from "./verifyEmailReducer";
import recoverPasswordReducer from "./recoverPasswordReducer";
import ChangePasswordReducer from "./changePasswordReducer";

export default combineReducers({
  profile: profileReducer,
  verifyEmail: verifyEmailReducer,
  recoverPassword: recoverPasswordReducer,
  changePassword:ChangePasswordReducer
});
