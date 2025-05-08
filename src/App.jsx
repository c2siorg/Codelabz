import React, { useEffect } from "react";
import Routes from "./routes";
import "./App.less";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch } from "react-redux";
import { fetchAndIndexTutorials } from "./store/actions";

const App = () => {
  // Initializing Firebase and Firestore using the custom hooks
  const firebase = useFirebase();
  const firestore = useFirestore();
  // Initializing the dispatch function to dispatch actions
  const dispatch = useDispatch();

  // Using useEffect to fetch and index tutorials once on component mount
  useEffect(() => {
    // Dispatch the action to fetch tutorials and index them in Firestore
    fetchAndIndexTutorials()(firebase, firestore, dispatch);
  }, [firebase, firestore, dispatch]);

  return <Routes />;
};

export default App;
