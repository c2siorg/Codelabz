import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    width: "95%",
    borderRadius: "16px !important",
    boxShadow: "0 2px 16px rgba(0,0,0,0.07) !important",
    border: "1px solid #e8eaed !important",
    padding: "8px 4px",
    "@media (max-width: 960px)": {
      width: "100%",
      padding: 0
    }
  },
  content: {
    paddingBottom: "15px !important",
    paddingTop: 15,
    "@media (max-width: 600px)": {
      padding: "10px 8px",
    }
  },
  cardTitle: {
    fontFamily: "Poppins, sans-serif !important",
    fontWeight: "700 !important",
    fontSize: "20px !important",
    color: "#1a1a1a !important",
    marginBottom: "4px !important",
  },
  cardSubtitle: {
    fontFamily: "Poppins, sans-serif !important",
    fontSize: "13px !important",
    color: "#888 !important",
    marginBottom: "16px !important",
  },
  flex: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    borderRadius: "12px !important",
    padding: "12px 16px",
    background: "#f8f9fa",
    border: "1px solid #f0f0f0",
    transition: "all 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0px 4px 12px rgba(0,0,0,0.07)",
    },
  },
  isLinked: {
    background: "#f0faf0",
    border: "1px solid #c3e6c3 !important",
    cursor: "default",
    "&:hover": {
      boxShadow: "none !important",
      borderColor: "#c3e6c3 !important",
    },
  },
  iconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    borderRadius: "10px !important",
    background: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    flexShrink: 0,
  },
  textWrap: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  text: {
    fontFamily: "Poppins, sans-serif !important",
    fontWeight: "600 !important",
    fontSize: "14px !important",
    color: "#1a1a1a !important",
    lineHeight: "1.3 !important",
  },
  subText: {
    fontFamily: "Poppins, sans-serif !important",
    fontSize: "12px !important",
    color: "#888 !important",
    lineHeight: "1.3 !important",
  },
  linkedActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginLeft: "auto",
    flexShrink: 0,
  },
  checkIcon: {
    color: "#2e7d32 !important",
    fontSize: "22px !important",
  },
  unlinkIcon: {
    color: "#aaa !important",
    fontSize: "20px !important",
    cursor: "pointer",
    "&:hover": {
      color: "#e53935 !important",
    },
  },
  connectBtn: {
    fontFamily: "Poppins, sans-serif !important",
    fontWeight: "500 !important",
    fontSize: "13px !important",
    textTransform: "none !important",
    borderRadius: "8px !important",
    padding: "5px 16px !important",
    borderColor: "#d0d0d0 !important",
    color: "#444 !important",
    marginLeft: "auto",
    flexShrink: 0,
    "&:hover": {
      borderColor: "#aaa !important",
      background: "#f5f5f5 !important",
    },
  },
  googleImg: {
    height: 24,
    width: 24,
  },
  fb: {
    fontSize: "26px !important",
    color: "#1877F2 !important",
  },
  tw: {
    fontSize: "24px !important",
    color: "#03A9F4 !important",
  },
  git: {
    fontSize: "24px !important",
    color: "#212121 !important",
  },
  footer: {
    fontFamily: "Poppins, sans-serif !important",
    fontSize: "11px !important",
    color: "#aaa !important",
    marginTop: "16px !important",
  },
}));

export default useStyles;
