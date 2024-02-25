import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/lab/Skeleton";
import Box from "@mui/material/Box";
import TutorialImg from "../../../../assets/images/tutorialCard.png";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
  cardContainer: {
    height: "80%",
    maxHeight: "90%",
    width: "150%",
    borderRadius: "20px",
    boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px",
    transition: 'all 0.3s ease-in-out', // Adding transition for smooth effect
    '&:hover': {
      transform: 'scale(1.05)', // Increase size on hover
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    },
  }
});


const TutorialCard = ({
  tutorialData: { tutorial_id, title, summary, icon, owner },
  loading
}) => {




  const classes = useStyles();
  return (
    <Card className={classes.cardContainer} data-testId="tutorialCard">
      <CardActionArea>
        <Link to={`/tutorials/${owner}/${tutorial_id}`}>
          <CardMedia
            component="img"
            alt="Tutorial icon"
            height="220"
            image={icon ? icon : TutorialImg}
            title="Tutorial icon"
          />

          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {summary.length > 20 ? `${summary.substring(0, 100)}...` : summary}
            </Typography>
            <Typography style={{ fontStyle: 'italic', marginTop: "10px" }}>
              -By {owner}
            </Typography>
            {loading ? <Skeleton variant="text" /> : null}
            {loading ? <Skeleton variant="text" /> : null}
            {loading ? <Skeleton variant="text" /> : null}
          </CardContent>

          <Box
            display="flex"
            alignItems="flex-end"
            p={1}
            m={1}
            bgcolor="background.paper"
            sx={{ height: 100 }}
          >
          </Box>
        </Link>
      </CardActionArea>
    </Card>
  );
};

export default TutorialCard;
