import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const NotificationToast = () => {
  const dispatch = useDispatch();
  const toast = useSelector(
    state => state.notifications?.data?.toast ?? { open: false, message: null }
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    dispatch({ type: "HIDE_NOTIFICATION_TOAST" });
  };

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;
