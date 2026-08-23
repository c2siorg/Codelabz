import React, { useEffect } from "react";
import Routes from "./routes";
import "./App.less";
import { useDispatch } from "react-redux";
import { messaging } from "./config";
import { onMessage } from "firebase/messaging";
import NotificationToast from "./components/NavBar/new/MainNavbar/NotificationToast";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!messaging) return;
    const unsub = onMessage(messaging, payload => {
      if (payload?.notification?.body) {
        dispatch({
          type: "SHOW_NOTIFICATION_TOAST",
          payload: payload.notification.body
        });
      }
    });
    return () => unsub();
  }, [dispatch]);

  return (
    <>
      <Routes />
      <NotificationToast />
    </>
  );
};

export default App;
