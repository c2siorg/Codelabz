import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import authReducer from "./authReducer";
import profileReducer from "./profileReducer";
import orgReducer from "./orgReducer";
import tutorialsReducer from "./tutorialsReducer";
import tutorialPageReducers from "./tutorialPageReducers";
import notificationReducers from "./notificationReducers";

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
  auth: authReducer,
  profile: profileReducer,
  org: orgReducer,
  tutorials: tutorialsReducer,
  tutorialPage: tutorialPageReducers,
  notifications: notificationReducers
});

export default rootReducer;
