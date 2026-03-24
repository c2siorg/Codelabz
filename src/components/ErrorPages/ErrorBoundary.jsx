import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Future: send to error reporting service
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "60vh", textAlign: "center", padding: "2rem" }}
        >
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Something went wrong
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ marginBottom: "1.5rem" }}
            >
              An unexpected error occurred. Please try again.
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
              style={{ marginRight: "1rem" }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => (window.location.href = "/")}
            >
              Go Home
            </Button>
          </Grid>
        </Grid>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
