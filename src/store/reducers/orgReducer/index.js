import { combineReducers } from "redux";
import dataReducer from "./dataReducer";
import generalReducer from "./generalReducer";
import launchedOrgsReducer from "./launchedOrgsReducer";
import userReducer from "./userReducer";
import { organizationReducer } from "./orgReducer";

export default combineReducers({
  general: generalReducer,
  user: userReducer,
  data: dataReducer,
  launched: launchedOrgsReducer,
  organisations:organizationReducer
});
