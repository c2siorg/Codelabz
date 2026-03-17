import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import React, { useState } from "react";
import { Typography, Stack, Box, IconButton } from "@mui/material";

const TutorialHeading = ({
  stepPanelVisible,
  isDesktop,
  setStepPanelVisible,
  tutorialData,
  timeRemaining
}) => {
  let [Fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (Fullscreen) {
      setFullscreen(false);
      document.exitFullscreen();
    } else {
      setFullscreen(true);
      document.documentElement.requestFullscreen();
    }
  };

  let styleProps = {
    backgroundColor: tutorialData.background_color || "#ffffff",
    color: tutorialData.text_color || "#000000"
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: { xs: 3, sm: 2 },
        px: { xs: 1, sm: 2 },
        gap: 1
      }}
    >
      <Typography
        data-testid="tutorialTitle"
        variant="h4"
        sx={{
          fontWeight: 700,
          textAlign: "center"
        }}
      >
        {tutorialData.title}
      </Typography>
      {!isDesktop && stepPanelVisible ? null : (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            type="text"
            className="p-0"
            sx={{
              ...styleProps,
              textTransform: "none",
              pointerEvents: "none"
            }}
          >
            <QueryBuilderIcon sx={{ mr: 1 }} />
            <span>{timeRemaining} mins remaining</span>
          </Button>
          {Fullscreen ? (
            <Tooltip placement="left" title={"exit Fullscreen"}>
              <IconButton
                onClick={toggleFullscreen}
                sx={{ ...styleProps, border: "1px dashed" }}
              >
                <FullscreenExitIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip placement="left" title={"Go Fullscreen"}>
              <IconButton
                onClick={toggleFullscreen}
                sx={{ ...styleProps, border: "1px dashed" }}
              >
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default TutorialHeading;
