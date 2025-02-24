import React from "react";
import { Box, Card, Typography, Button, Switch } from "@mui/material";
import { Input } from "../../ui-helpers/Inputs/SecondaryInput";
import useStyles from "./styles";

const UserPassword = () => {
  const classes = useStyles();

  return (
    <Card
      className={classes.card}
      data-testId="passwordPage"
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        maxWidth: 500,
        mx: "auto",
        background: "linear-gradient(135deg, #ffffff, #f8f9fa)"
      }}
    >
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        <Box>
          <Typography
            className={classes.text}
            variant="body1"
            gutterBottom
          >
            Old password
          </Typography>
          <Input
            type="password"
            placeholder="Enter old password"
            className={classes.input}
            data-testId="oldPassword"
            sx={{
              height: "36px !important",
              padding: "0px 0px !important",
              backgroundColor: "#f5f3f4 !important",
              color: "#000000 !important",
              border: "1px solid #555 !important",
              borderRadius: "4px !important",
              "& .MuiInputBase-input::placeholder": {
                color: "#000000 !important",
                fontSize: "0.875rem !important"
              }
            }}
          />
        </Box>

        <Box>
          <Typography
            className={classes.text}
            variant="body1"
            gutterBottom
          >
            New password
          </Typography>
          <Input
            type="password"
            placeholder="Enter your new password"
            className={classes.input}
            data-testId="newPassword"
            sx={{
              height: "36px !important",
              padding: "0px 0px !important",
              backgroundColor: "#f5f3f4 !important",
              color: "#000000 !important",
              border: "1px solid #555 !important",
              borderRadius: "4px !important",
              "& .MuiInputBase-input::placeholder": {
                color: "#000000 !important",
                fontSize: "0.875rem !important"
              }
            }}
          />
        </Box>

        <Box>
          <Typography
            className={classes.text}
            variant="body1"
            gutterBottom
          >
            Confirm new password
          </Typography>
          <Input
            type="password"
            placeholder="Confirm new password"
            className={classes.input}
            data-testId="confirmPassword"
            sx={{
              height: "36px !important",
              padding: "0px 0px !important",
              backgroundColor: "#f5f3f4 !important",
              color: "#000000 !important",
              border: "1px solid #555 !important",
              borderRadius: "4px !important",
              "& .MuiInputBase-input::placeholder": {
                color: "#000000 !important",
                fontSize: "0.875rem !important"
              }
            }}
          />
        </Box>

        <Button
          className={classes.button}
          data-testId="updatePassword"
          variant="contained"
          sx={{
            backgroundColor: "#0073E6 !important",
            color: "#ffffff !important",
            py: 1.5,
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#004A70 !important",
              color: "#ffffff !important"
            }
          }}
        >
          Update Password
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            borderTop: "1px solid #e0e0e0"
          }}
        >
          <Typography
            className={classes.text}
            data-testId="logout"
            variant="body2"
          >
            Logout
          </Typography>
          <Typography
            className={classes.text}
            data-testId="logoutOfOtherBrowsers"
            variant="body2"
            sx={{ color: "#0075AD", cursor: "pointer" }}
          >
            Logout of all other browsers
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            borderTop: "1px solid #e0e0e0"
          }}
        >
          <Typography
            className={classes.text}
            data-testId="loginSecurity"
            variant="body2"
          >
            Login security
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              className={classes.text}
              variant="body2"
              sx={{ mr: 1 }}
            >
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
