import React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import { Box, Stack } from "@mui/material";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
      gap: "30px"
    }
  },
  rightButtonsGroup: {
    display: "flex",
    gap: "5px"
  },
  prevButton: {
    borderWidth: "2px",
    "&:hover": {
      borderWidth: "2px"
    },
    minWidth: "fit-content"
  },
  completeButton: {
    minWidth: "fit-content"
  }
}));

const ControlButtons = ({
  currentStep,
  setCurrentStep,
  stepsData,
  hide,
  setStepData
}) => {
  const classes = useStyles();
  if (!hide && stepsData) {
    return (
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 2, sm: 4 },
          py: 2
        }}
      >
        <Button
          color="primary"
          variant="outlined"
          data-testid="previousStepButton"
          onClick={() => {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
          }}
          disabled={currentStep === 0}
          sx={{ minWidth: "120px", width: { xs: "100%", sm: "auto" } }}
        >
          Previous
        </Button>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            width: { xs: "100%", sm: "auto" },
            justifyContent: "center",
            alignItems: "center",
            gap: 2
          }}
        >
          <Button
            variant="contained"
            color="primary"
            data-testid="nextStepButton"
            onClick={() => {
              setCurrentStep(currentStep + 1);
              window.scrollTo(0, 0);
            }}
            disabled={currentStep >= stepsData.length - 1}
            sx={{ minWidth: "120px", width: { xs: "100%", sm: "auto" } }}
          >
            Next
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              <Snackbar
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
                open={true}
                autoHideDuration={6000}
                message="tutorial complete"
              />;
              window.scrollTo(0, 0);
              setStepData(prevSteps =>
                prevSteps.map((step, index) =>
                  index === currentStep
                    ? { ...step, completed: !step.completed }
                    : step
                )
              );
            }}
            sx={{
              minWidth: "150px",
              whiteSpace: "nowrap",
              boxShadow: "none",
              width: { xs: "100%", sm: "auto" }
            }}
          >
            {stepsData[currentStep].completed ? "Reset Step" : "Complete Step"}
          </Button>
        </Stack>
      </Stack>
    );
  } else return null;
};

export default ControlButtons;
