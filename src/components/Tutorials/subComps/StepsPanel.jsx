import React from "react";
import Stepper from "@mui/material/Stepper";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";
import { borderRadius } from "@mui/system";
import { Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { grey } from "@mui/material/colors";
import ControlButtons from "./ControlButtons";

const useStyles = makeStyles({
  stepperContainer: {
    width: "100%",
    padding: "20px 0"
  },
  stepButtonStyle: {
    padding: "12px 20px",
    borderRadius: 8,
    backgroundColor: "#fff",
    border: "1px solid #e8e8e8",
    "&:hover": {
      backgroundColor: grey[50],
      borderColor: "#2894ff"
    },
    width: "100%",
    textAlign: "left",
    justifyContent: "flex-start",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  stepItem: {
    marginBottom: "16px"
  }
});

const StepsPanel = ({
  currentStep,
  onChange,
  stepsData,
  onClick,
  hideButton,
  setCurrentStep,
  setStepData
}) => {
  const classes = useStyles();
  return (
    <Box className="tutorial-steps-sider" sx={theme => ({ p: 1 })}>
      <Grid container>
        <Grid item xs={12} className="col-pad-24-s">
          {/* ControlButtons moved to main content area */}
        </Grid>
      </Grid>
      {!hideButton &&
        false && ( //remove false to show
          <Button
            type="link"
            size="large"
            style={{ float: "right", padding: 0, marginRight: "4px" }}
            onClick={onClick}
          >
            Close
          </Button>
        )}

      <Stepper
        activeStep={currentStep}
        orientation="vertical"
        onChange={onChange}
        data-testid={"stepsPanel"}
        nonLinear
        className={classes.stepperContainer}
      >
        {stepsData &&
          stepsData.map((step, index) => {
            return (
              <Step
                key={"step" + step.id}
                completed={step.completed}
                className={classes.stepItem}
              >
                <StepButton
                  className={classes.stepButtonStyle}
                  onClick={() => {
                    setCurrentStep(index);
                  }}
                >
                  {step.title}
                </StepButton>
              </Step>
            );
          })}
      </Stepper>
    </Box>
  );
};

export default StepsPanel;
