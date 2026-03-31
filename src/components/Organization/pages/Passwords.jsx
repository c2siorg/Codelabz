import React, { useState } from "react";
import { Grid, Typography, InputBase, Button, Snackbar, Alert, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import firebase from "../../../config/index";

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
    padding: "20px",
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
  button: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    marginTop: "10px",
    minWidth: "150px"
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
  }
}));

function Passwords() {
  const classes = useStyles();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields",
        severity: "error"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "New passwords do not match",
        severity: "error"
      });
      return;
    }

    if (newPassword.length < 6) {
      setSnackbar({
        open: true,
        message: "Password should be at least 6 characters",
        severity: "error"
      });
      return;
    }

    setLoading(true);
    const user = firebase.auth().currentUser;

    try {
      // Re-authenticate user before updating password
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldPassword
      );

      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPassword);

      setSnackbar({
        open: true,
        message: "Password updated successfully!",
        severity: "success"
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error"
      });
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
      >
        <Grid item xs={12}>
          <Typography className={classes.heading}>Passwords</Typography>
        </Grid>
        <Grid className={classes.inputContainer} item xs={12}>
          <Typography>Old Password</Typography>
          <InputBase
            name="oldPassword"
            type="password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            className={classes.input}
            placeholder="Old Password"
          />
        </Grid>
        <Grid className={classes.inputContainer} item xs={12}>
          <Typography>New Password</Typography>
          <InputBase
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className={classes.input}
            placeholder="New Password"
          />
        </Grid>
        <Grid className={classes.inputContainer} item xs={12}>
          <Typography>Confirm new password</Typography>
          <InputBase
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className={classes.input}
            placeholder="Confirm new password"
          />
        </Grid>
        <Grid className={classes.inputContainer} item xs={12}>
          <Button
            className={classes.button}
            onClick={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update Password"}
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default Passwords;
