import { combineReducers } from "redux";
import editorReducer from "./editorReducer";
import dataReducer from "./dataReducer";
import createReducer from "./createReducer";
import currentReducer from "./currentReducer";
import imageReducer from "./imageReducer";
import UpvoteReducer from "./upvoteReducer";
import DownvoteReducer from "./downvoteReducer";

export default combineReducers({
  editor: editorReducer,
  data: dataReducer,
  create: createReducer,
  current: currentReducer,
  images: imageReducer,
  upvote:UpvoteReducer,
  downvote:DownvoteReducer
});
