import React, { useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PropTypes from "prop-types";
import useStyles from "./styles";

const AI_SERVICE_URL =
  import.meta.env.VITE_AI_SERVICE_URL || "http://localhost:8000";

/**
 * ChatInterface
 *
 * Renders the chat window with the LangGraph-powered AI assistant.
 *
 * Props
 * -----
 * labId            – current tutorial / lab identifier
 * currentCode      – code currently in the editor (optional)
 * onClose          – callback to close the chat panel
 */
function ChatInterface({ labId, currentCode, onClose }) {
  const classes = useStyles();
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hi! I'm the CodeLabz AI assistant. Ask me anything about this lab or paste an error message and I'll help you debug it."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [retrievedDocs, setRetrievedDocs] = useState([]);
  const [showDocs, setShowDocs] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setRetrievedDocs([]);

    try {
      const response = await fetch(`${AI_SERVICE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          lab_id: labId || "",
          current_code_snippet: currentCode || "",
          conversation_id: conversationId
        })
      });

      if (!response.ok) {
        throw new Error(`AI service returned ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
      if (data.conversation_id) setConversationId(data.conversation_id);
      if (data.retrieved_kb_docs?.length) {
        setRetrievedDocs(data.retrieved_kb_docs);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          content:
            "Sorry, I couldn't reach the AI service right now. Please try again later."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={classes.chatDrawer} data-testid="ai-chat-interface">
      {/* Header */}
      <div className={classes.chatHeader}>
        <span className={classes.chatHeaderTitle}>
          <AutoAwesomeIcon fontSize="small" />
          CodeLabz AI Assistant
        </span>
        <IconButton size="small" onClick={onClose} style={{ color: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      {/* Messages */}
      <div className={classes.messagesContainer}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${classes.messageBubble} ${
              msg.role === "user" ? classes.userBubble : classes.aiBubble
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className={classes.aiBubble} style={{ padding: 10, alignSelf: "flex-start" }}>
            <CircularProgress size={16} style={{ color: "#6366f1" }} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Retrieved docs toggle */}
      {retrievedDocs.length > 0 && (
        <>
          <span
            className={classes.docsToggle}
            onClick={() => setShowDocs(v => !v)}
          >
            {showDocs ? "Hide" : "Show"} retrieved documentation ({retrievedDocs.length})
          </span>
          {showDocs && (
            <div className={classes.docsPanel}>
              {retrievedDocs.map((doc, i) => (
                <div key={i} className={classes.docItem}>
                  {doc.length > 200 ? `${doc.slice(0, 200)}…` : doc}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Input row */}
      <div className={classes.inputRow}>
        <textarea
          className={classes.textInput}
          rows={2}
          placeholder="Ask a question or describe your error…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          data-testid="ai-chat-input"
        />
        <button
          className={classes.sendButton}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          data-testid="ai-chat-send"
        >
          Send
        </button>
      </div>
    </div>
  );
}

ChatInterface.propTypes = {
  labId: PropTypes.string,
  currentCode: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

ChatInterface.defaultProps = {
  labId: "",
  currentCode: ""
};

export default ChatInterface;
