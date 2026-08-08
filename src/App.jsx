import React, { useEffect, useRef } from "react";
import Routes from "./routes";
import "./App.less";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch } from "react-redux";
import { fetchAndIndexTutorials } from "./store/actions";

const App = () => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const hasIndexedTutorials = useRef(false);

  useEffect(() => {
    if (hasIndexedTutorials.current) return;
    hasIndexedTutorials.current = true;
    fetchAndIndexTutorials()(firebase, firestore, dispatch);
  }, [firebase, firestore, dispatch]);
  return <Routes />;
};

export default App;
