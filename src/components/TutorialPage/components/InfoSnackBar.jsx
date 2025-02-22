import React from "react";
import Snackbar from "@mui/material/Snackbar";

const InfoSnackBar = ({ message, children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={open}
        autoHideDuration={1000}
        message={message}
      />
      <div
        onClick={() => {
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, 1000);
        }}
      >
        {children}
      </div>
    </>
  );
};

export default InfoSnackBar;
