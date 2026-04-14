import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  fabButton: {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    zIndex: 1300
  },
  chatDrawer: {
    position: "fixed",
    bottom: "5.5rem",
    right: "2rem",
    width: 380,
    maxHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    overflow: "hidden",
    zIndex: 1299,
    backgroundColor: theme.palette?.background?.paper || "#fff"
  },
  chatHeader: {
    padding: "12px 16px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  chatHeaderTitle: {
    fontWeight: 700,
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 12,
    padding: "8px 12px",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  },
  userBubble: {
    alignSelf: "flex-end",
    background: "#6366f1",
    color: "#fff",
    borderBottomRightRadius: 2
  },
  aiBubble: {
    alignSelf: "flex-start",
    background: "#f3f4f6",
    color: "#111827",
    borderBottomLeftRadius: 2
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    borderTop: "1px solid #e5e7eb",
    gap: 8
  },
  textInput: {
    flex: 1,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: "0.875rem",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    "&:focus": {
      borderColor: "#6366f1"
    }
  },
  sendButton: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.875rem",
    "&:disabled": {
      background: "#a5b4fc",
      cursor: "not-allowed"
    }
  },
  docsToggle: {
    fontSize: "0.75rem",
    color: "#6b7280",
    padding: "0 16px 8px",
    cursor: "pointer",
    textDecoration: "underline"
  },
  docsPanel: {
    padding: "0 16px 10px",
    background: "#f9fafb",
    fontSize: "0.75rem",
    color: "#374151",
    borderTop: "1px solid #e5e7eb",
    maxHeight: 120,
    overflowY: "auto"
  },
  docItem: {
    padding: "4px 0",
    borderBottom: "1px solid #e5e7eb",
    "&:last-child": {
      borderBottom: "none"
    }
  }
}));

export default useStyles;
