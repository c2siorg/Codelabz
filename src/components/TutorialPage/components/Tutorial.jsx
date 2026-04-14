import React from "react";
import PropTypes from "prop-types";
import { Card, Box, Typography, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HtmlTextRenderer from "../../Tutorials/subComps/HtmlTextRenderer";
import DescriptionIcon from "@mui/icons-material/Description";

const useStyles = makeStyles(() => ({
  container: {
    padding: "5px 24px",
    margin: "24px 0"
  },
  mediaImage: {
    maxWidth: "100%",
    borderRadius: "8px",
    marginTop: "12px",
    marginBottom: "12px",
    display: "block"
  },
  mediaVideo: {
    maxWidth: "100%",
    borderRadius: "8px",
    marginTop: "12px",
    marginBottom: "12px"
  },
  mediaDoc: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "8px",
    marginBottom: "8px"
  }
}));

const MediaRenderer = ({ mediaItems, classes }) => {
  if (!mediaItems || mediaItems.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      {mediaItems.map((item, idx) => {
        if (item.type === "image") {
          return (
            <img
              key={idx}
              src={item.url}
              alt={item.name || `media-${idx}`}
              className={classes.mediaImage}
            />
          );
        }
        if (item.type === "video") {
          return (
            <video
              key={idx}
              src={item.url}
              controls
              className={classes.mediaVideo}
            >
              Your browser does not support the video tag.
            </video>
          );
        }
        return (
          <Box key={idx} className={classes.mediaDoc}>
            <DescriptionIcon fontSize="small" color="action" />
            <Link href={item.url} target="_blank" rel="noopener noreferrer">
              {item.name || `Document ${idx + 1}`}
            </Link>
          </Box>
        );
      })}
    </Box>
  );
};

const Tutorial = ({ steps, media }) => {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.container}>
        {/* Render tutorial-level media (attached when creating) */}
        <MediaRenderer mediaItems={media} classes={classes} />

        {steps?.map((step, i) => {
          return (
            <Box id={step.id} key={step.id} data-testId="tutorialpageSteps">
              <Typography sx={{ fontWeight: "600" }}>
                {i + 1 + ". " + step.title}
              </Typography>
              <Typography className="content">
                <HtmlTextRenderer html={step.content} />
              </Typography>
              {/* Render any step-level media */}
              <MediaRenderer mediaItems={step.media} classes={classes} />
            </Box>
          );
        })}
      </Card>
    </>
  );
};

const mediaPropType = PropTypes.arrayOf(
  PropTypes.shape({
    url: PropTypes.string.isRequired,
    name: PropTypes.string,
    type: PropTypes.oneOf(["image", "video", "document"])
  })
);

MediaRenderer.propTypes = {
  mediaItems: mediaPropType,
  classes: PropTypes.object.isRequired
};

Tutorial.propTypes = {
  steps: PropTypes.array,
  media: mediaPropType
};

export default Tutorial;
