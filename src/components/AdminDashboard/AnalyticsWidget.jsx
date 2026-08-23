import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  card: {
    borderRadius: "12px",
    minWidth: 180,
    textAlign: "center"
  },
  value: {
    fontSize: "2.4rem",
    fontWeight: 700,
    lineHeight: 1.2
  },
  title: {
    fontSize: "0.9rem",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5)
  },
  errorText: {
    color: theme.palette.error.main,
    fontSize: "0.8rem",
    marginTop: theme.spacing(0.5)
  }
}));


function AnalyticsWidget({ title, value, loading, error, onRetry }) {
  const classes = useStyles();

  return (
    <Card className={classes.card} elevation={2} data-testid={`widget-${title}`}>
      <CardContent>
        {loading && value === null ? (
          <Box display="flex" justifyContent="center" py={1}>
            <CircularProgress size={28} />
          </Box>
        ) : error ? (
          <Box>
            <Typography className={classes.errorText}>{error}</Typography>
            {onRetry && (
              <Button size="small" onClick={onRetry} sx={{ mt: 0.5 }}>
                Retry
              </Button>
            )}
          </Box>
        ) : (
          <Typography className={classes.value} data-testid={`widget-value-${title}`}>
            {value ?? "—"}
          </Typography>
        )}
        <Typography className={classes.title}>{title}</Typography>
      </CardContent>
    </Card>
  );
}

export default AnalyticsWidget;
