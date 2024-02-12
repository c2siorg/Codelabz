import { combineReducers } from "redux";
import profileEditReducer from "./profileEditReducer";
import dataReducer from "./dataReducer";
import userReducer from "./userReducer";
import FetchUserReducer from "./fetchUserReducer";

export default combineReducers({
  edit: profileEditReducer,
  data: dataReducer,
  user: userReducer,
  fetchUser:FetchUserReducer
});
