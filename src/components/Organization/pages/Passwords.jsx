import React, { useState } from "react";
import {
  Grid,
  Typography,
  InputBase,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useFirebase } from "react-redux-firebase";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const useStyles = makeStyles(theme => ({
  root: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "10px",
    marginTop: "15px",
    display: "flex",
    alignContent: "stretch",
    justifyContent: "space-evenly",
    width: "98%",
    marginBottom: "20px",
    [theme.breakpoints.between("xs", "sm")]: {
      marginLeft: "10px"
    }
  },
  input: {
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: "10px",
    marginTop: "10px",
    width: "50%",
    "&:hover": { backgroundColor: "#F5F5F5" },
    [theme.breakpoints.between("xs", "sm")]: {
      width: "100%"
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "70%"
    },
    [theme.breakpoints.between("md", "lg")]: {
      width: "35%"
    }
  },
  inputError: {
    border: "1px solid #f44336"
  },
  button: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed"
    }
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: 100,
    [theme.breakpoints.between("xs", "sm")]: {
      textAlign: "center"
    }
  },
  inputContainer: {
    [theme.breakpoints.between("xs", "sm")]: {
      textAlign: "center"
    }
  },
  errorText: {
    color: "#f44336",
    fontSize: "0.875rem",
    marginTop: "4px"
  }
}));

function Passwords() {
  const classes = useStyles();
  const firebase = useFirebase();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = newPass => {
    if (newPass.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    // Validation
    const errors = {};
    if (!oldPassword) {
      errors.oldPassword = "Old password is required";
    }
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else {
      const passError = validatePassword(newPassword);
      if (passError) {
        errors.newPassword = passError;
      }
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from old password");
      return;
    }

    setLoading(true);

    try {
      const user = firebase.auth().currentUser;
      if (!user || !user.email) {
        throw new Error("No user is currently signed in");
      }

      // Re-authenticate user with old password
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldPassword
      );
      await user.reauthenticateWithCredential(credential);

      // Update password
      await user.updatePassword(newPassword);

      setSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setFieldErrors({ ...fieldErrors, oldPassword: "Incorrect password" });
        setError("The old password you entered is incorrect");
      } else if (err.code === "auth/requires-recent-login") {
        setError(
          "For security reasons, please log out and log back in before changing your password"
        );
      } else if (err.code === "auth/weak-password") {
        setFieldErrors({
          ...fieldErrors,
          newPassword: "Password should be at least 6 characters"
        });
      } else {
        setError(err.message || "Failed to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Grid
        container
        direction="column"
        className={classes.root}
        spacing={3}
        data-testid="organization-passwords-page"
        component="form"
        onSubmit={handleSubmit}
      >
        <Grid item xs={12}>
          <Typography className={classes.heading}>Passwords</Typography>
        </Grid>

        {error && (
          <Grid item xs={12} className={classes.inputContainer}>
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          </Grid>
        )}

        {success && (
          <Grid item xs={12} className={classes.inputContainer}>
            <Alert severity="success" onClose={() => setSuccess("")}>
              {success}
            </Alert>
          </Grid>
        )}

        <Grid className={classes.inputContainer} item xs={12}>
          <Typography>Old Password</Typography>
          <InputBase
            className={`${classes.input} ${
              fieldErrors.oldPassword ? classes.inputError : ""
            }`}
            placeholder="Old Password"
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            disabled={loading}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  edge="end"
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {fieldErrors.oldPassword && (
            <Typography className={classes.errorText}>
              {fieldErrors.oldPassword}
            </Typography>
          )}
        </Grid>

        <Grid className={classes.inputContainer} item xs={12}>
          <Typography>New Password</Typography>
          <InputBase
            className={`${classes.input} ${
              fieldErrors.newPassword ? classes.inputError : ""
            }`}
            placeholder="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={loading}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {fieldErrors.newPassword && (
            <Typography className={classes.errorText}>
              {fieldErrors.newPassword}
            </Typography>
          )}
        </Grid>

        <Grid className={classes.inputContainer} item xs={12}>
          <Typography>Confirm new password</Typography>
          <InputBase
            className={`${classes.input} ${
              fieldErrors.confirmPassword ? classes.inputError : ""
            }`}
            placeholder="Confirm new password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={loading}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {fieldErrors.confirmPassword && (
            <Typography className={classes.errorText}>
              {fieldErrors.confirmPassword}
            </Typography>
          )}
        </Grid>

        <Grid className={classes.inputContainer} item xs={12}>
          <Button
            className={classes.button}
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Passwords;
