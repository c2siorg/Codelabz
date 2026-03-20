import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  card: {
    border: "1px solid #e0e0e0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08) !important",
    borderRadius: "16px !important",
    width: "480px",
    [theme.breakpoints.down("md")]: {
      width: "420px"
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      minWidth: "unset",
      border: "none",
      boxShadow: "none !important",
      borderRadius: "0 !important"
    }
  },
  title: {
    textAlign: "center",
    marginBottom: "24px !important",
    fontWeight: "700 !important",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.8rem !important"
    }
  },
  loginButton: {
    borderRadius: "30px !important",
    padding: "12px !important",
    fontWeight: "600 !important",
    fontSize: "1rem !important",
    textTransform: "none !important",
    marginTop: "8px !important"
  },
  rememberForgotRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  forgotLink: {
    fontSize: "0.875rem",
    color: "#03AAFA",
    textDecoration: "none",
    "&:hover": {
      color: "royalblue"
    }
  },
  createAccountRow: {
    textAlign: "center",
    marginTop: "16px"
  }
}));

export default useStyles;