import { combineReducers } from "redux";
import NotificationsAddReducer from "./addReducer";
import NotificationsDataReducer from "./dataReducer";

export default combineReducers({
  add: NotificationsAddReducer,
  data: NotificationsDataReducer
});
