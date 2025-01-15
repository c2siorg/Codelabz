import React, { useEffect, useState } from "react";
import useStyles from "./styles";
import { Box, Card, Typography, Button, Switch } from "@mui/material";
// import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useFirebase } from "react-redux-firebase";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/lab/Alert";
import { Input } from "../../ui-helpers/Inputs/SecondaryInput";
import { changePassword } from "../../../store/actions/authActions";

const AlertComp = ({ description, type }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Collapse in={isOpen}>
      <Alert
        severity={type ? type : "error"}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        className="mb-16"
      >
        {description}
      </Alert>
    </Collapse>
  );
};

const UserPassword = () => {
  const classes = useStyles();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const errorProps = useSelector(({ auth }) => auth.changePassword.error);
  const loadingProps = useSelector(({ auth }) => auth.changePassword.loading);

  const handleOldPasswordChange = e => {
    // console.log(e.target.value);
    setOldPassword(e.target.value);
  };
  const handleNewPasswordChange = e => {
    // console.log(e.target.value);
    setNewPassword(e.target.value);
  };
  const handleConfirmNewPasswordChange = e => {
    // console.log(e.target.value);
    setConfirmNewPassword(e.target.value);
  };

  const validatePassword = () => {
    if (
      oldPassword.length > 0 &&
      newPassword.length > 0 &&
      newPassword === confirmNewPassword
    ) {
      return true;
    }
    return false;
  };

  const handleUpdatePassword = async e => {
    // e.preventDefault()
    setError("");

    setSuccess(false);
    if (validatePassword()) {
      await changePassword(oldPassword, newPassword)(firebase, dispatch);
      // console.log(errorProps);
      // console.log(loadingProps);
      if (errorProps) {
        setError(errorProps);
        // console.log(errorProps);
      } else {
        setSuccess(true);
      }
    } else {
      setError("New Password may not match with Confirm New Password");
    }
  };

  useEffect(() => {
    if (errorProps) {
      setError(errorProps);
      setSuccess(false);
      // console.log(errorProps);
    } else {
      setSuccess(true);
      setError("");
    }
  }, [errorProps, loadingProps]);

  useEffect(() => {
    setError("");
    setSuccess(false);
  }, []);



  return (
    <Card className={classes.card} data-testId="passwordPage">
      {/* {console.log(error)} */}
      {error && <AlertComp description={error} />}

      {success && (
        <>
          <AlertComp
            description={"Password Succesfully Changed"}
            type="success"
          />
        </>
      )}
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Box style={{ marginBottom: "5px" }}>
          <Typography className={classes.text}>Old password</Typography>
          <Input
            type="password"
            className={classes.input}
            data-testId="oldPassword"
            onChange={handleOldPasswordChange}
          />
        </Box>
        <Box style={{ margin: "5px 0" }}>
          <Typography className={classes.text}>New password</Typography>
          <Input
            type="password"
            className={classes.input}
            data-testId="newPassword"
            onChange={handleNewPasswordChange}
          />
        </Box>
        <Box style={{ margin: "5px 0" }}>
          <Typography className={classes.text}>Confirm new password</Typography>
          <Input
            type="password"
            className={classes.input}
            data-testId="confirmPassword"
            onChange={handleConfirmNewPasswordChange}
          />
        </Box>
        <Button
          className={classes.button}
          data-testId="updatePassword"
          onClick={handleUpdatePassword}
        >
          Update Password
        </Button>
        <Box className={classes.row}>
          <Typography className={classes.text} data-testId="logout">
            Logout
          </Typography>
          <Typography
            className={classes.text}
            style={{ marginRight: 40, color: "#0075AD" }}
            data-testId="logoutOfOtherBrowsers"
          >
            Logout of all other browsers
          </Typography>
        </Box>
        <Box className={classes.row}>
          <Typography className={classes.text} data-testId="loginSecurity">
            Login security
          </Typography>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Typography className={classes.text}>
              Require email verification
            </Typography>
            <Switch color="primary" data-testId="emailVerification" />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default UserPassword;
