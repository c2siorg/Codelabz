import React from "react";
import { Chip, Grid, Paper, Typography, Box } from "@mui/material";

const tags = [
  "HTML", "JavaScript", "CSS", "Python",
  "React", "Java", "TypeScript",
  "Angular", "Vue", "Node.js",
  "MongoDB", "SQL", "Docker",
  "Kubernetes", "AWS", "Git",
  "GraphQL", "REST"
];

const PopularTagsMenu = () => {
  return (
    <Paper
      elevation={3}
      style={{
        width: "350px",
        padding: "20px",
        borderRadius: "15px",
        marginTop: "10px",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Popular Tags
      </Typography>
      <Grid container spacing={1}>
        {tags.map((tag, index) => (
          <Grid item key={index}>
            <Chip
              label={tag}
              onClick={() => {}}
              sx={{
                backgroundColor: "#f5f7f9",
                fontWeight: 600,
                borderRadius: "20px",
                fontSize: "13px",
                color: "#555",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(111, 66, 193, 0.1)",
                  color: "#6f42c1",
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default PopularTagsMenu;
