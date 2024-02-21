import React, { useEffect, useRef } from "react";
import { Card, Box, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HtmlTextRenderer from "../../Tutorials/subComps/HtmlTextRenderer";

const useStyles = makeStyles(() => ({
  container: {
    padding: "5px 24px",
    margin: "24px 0"
  }
}));

const Tutorial = ({ steps }) => {
  const classes = useStyles();
  console.log(steps)
  return (
    <>
    <Card className={classes.container}>
      {steps?.map((step, i) => {
        const formatTime = (time) => {
          if (time >= 60) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            return `${hours} hours ${minutes} min`;
          } else {
            return `${time} min`;
          }
        };

        return (
          <Box id={step.id} key={step.id} data-testId="tutorialpageSteps">
            <Typography sx={{ fontWeight: "600" }}>
              {i + 1 + ". " + step.title} {step.time && `(${formatTime(step.time)})`}
            </Typography>
            <Typography className="content">
              <HtmlTextRenderer html={step.content} />
            </Typography>
          </Box>
        );
      })}
    </Card>
    </>
  );
};

export default Tutorial;
