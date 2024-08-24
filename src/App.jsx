import React, { useEffect } from "react";
import Routes from "./routes";
import "./App.less";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch } from "react-redux";
import { fetchAndIndexTutorials } from "./store/actions";

const App = () => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAndIndexTutorials()(firebase, firestore, dispatch);
  }, [firebase, firestore, dispatch]);
  return <Routes />;
};

export default App;
