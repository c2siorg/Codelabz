import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    },
    marginBottom: "2rem",
    width: "100%",
    flex: 1
  },
  logo: {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "50%",
    marginRight: "10px",
    objectFit: "cover",
    border: "2px solid #f0f0f0"
  },
  card: {
    display: "flex",
    width: "100%",
    borderRadius: "16px !important",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06) !important"
  }
}));

const EventsCard = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card
        className={`${classes.card} ${classes.root}`}
        data-testId="upcomingEventCard"
      >
        <CardContent
          sx={{
            width: "100%",
            p: 3
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "900",
              mb: 2.5,
              color: "#1a1a1a",
              letterSpacing: "-0.5px"
            }}
          >
            {props.title}
          </Typography>
          {props.events.map(function (event, index) {
            return (
              <Grid
                key={index}
                container
                direction="row"
                spacing={2}
                alignItems="center"
                data-testId={index == 0 ? "upEventBox" : ""}
                sx={{
                  mb: 1.5,
                  p: 2,
                  borderRadius: "12px",
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  borderLeft: "4px solid transparent",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, rgba(111, 66, 193, 0.15) 0%, rgba(71, 111, 255, 0.1) 100%)",
                    transform: "translateX(10px) scale(1.02)",
                    boxShadow: "0 12px 25px rgba(111, 66, 193, 0.15)",
                    borderLeft: "4px solid #6f42c1",
                    "& .MuiTypography-root": {
                      color: "#6f42c1",
                      fontWeight: "700"
                    }
                  }
                }}
              >
                <Grid item xs={3}>
                  <img
                    src={event.img[0]}
                    className={classes.logo}
                    data-testId={index == 0 ? "upEventImg" : ""}
                  />
                </Grid>

                <Grid item xs={9}>
                  <Box data-testId={index == 0 ? "upEventName" : ""}>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                      {event.name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ fontWeight: 400, fontSize: "0.8rem", color: "#666" }}
                    data-testId={index == 0 ? "upEventDate" : ""}
                  >
                    <Typography variant="caption">{event.date}</Typography>
                  </Box>
                </Grid>
              </Grid>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsCard;
