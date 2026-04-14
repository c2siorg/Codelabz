import React, { useState } from "react";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PropTypes from "prop-types";
import useStyles from "./styles";
import ChatInterface from "./ChatInterface";

/**
 * AIAssistant
 *
 * A floating action button that toggles the LangGraph-powered chat panel.
 * Drop it into any page – it renders a fixed-position FAB and, when opened,
 * the full chat drawer.
 *
 * Props
 * -----
 * labId       – identifier of the current tutorial / lab (passed to the API)
 * currentCode – live code from the editor, forwarded to the Debugging Agent
 */
function AIAssistant({ labId, currentCode }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        style={{ display: open ? "block" : "none" }}
        aria-hidden={!open}
      >
        <ChatInterface
          labId={labId}
          currentCode={currentCode}
          onClose={() => setOpen(false)}
        />
      </div>

      <Tooltip
        title={open ? "Close AI Assistant" : "Open AI Assistant"}
        placement="left"
      >
        <Fab
          color="primary"
          className={classes.fabButton}
          onClick={() => setOpen(v => !v)}
          data-testid="ai-assistant-fab"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
        >
          <AutoAwesomeIcon />
        </Fab>
      </Tooltip>
    </>
  );
}

AIAssistant.propTypes = {
  labId: PropTypes.string,
  currentCode: PropTypes.string
};

AIAssistant.defaultProps = {
  labId: "",
  currentCode: ""
};

export default AIAssistant;
