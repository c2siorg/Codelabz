import React from "react";
import { Box, Card, Typography } from "@mui/material";
import useStyles from "./styles";

const UserAccount = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card} data-testid="userSettingsPage">
      <Box sx={{ maxWidth: { xs: "100%", md: "60%" } }}>
        <Box className={classes.row}>
          <Typography
            className={classes.text}
            style={{ width: "56%" }}
            data-testid="exportData"
          >
            Export account data
          </Typography>
          <Typography
            className={classes.text}
            style={{ color: "#0075AD" }}
            data-testid="startExport"
          >
            Start export
          </Typography>
        </Box>
        <Box className={classes.row}>
          <Typography
            className={classes.text}
            style={{ width: "56%" }}
            data-testid="successorSettings"
          >
            Successor settings
          </Typography>
          <Typography
            className={classes.text}
            style={{ color: "#0075AD" }}
            data-testid="addSuccessor"
          >
            Add successor
          </Typography>
        </Box>
        <Typography
          className={classes.text}
          style={{ color: "#FF5959", marginBottom: 10 }}
          data-testid="deactivateAccount"
        >
          Deactivate account
        </Typography>
        <Typography
          className={classes.text}
          style={{ color: "#FF5959" }}
          data-testid="deleteAccount"
        >
          Delete account
        </Typography>
      </Box>
    </Card>
  );
};

export default UserAccount;
