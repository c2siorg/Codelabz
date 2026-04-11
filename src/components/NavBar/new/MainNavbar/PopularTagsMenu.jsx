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
      sx={{
        width: "350px",
        padding: "20px",
        borderRadius: "15px",
        marginTop: "10px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
        Popular Tags
      </Typography>
      <Grid container spacing={1}>
        {tags.map((tag, index) => (
          <Grid item key={index}>
            <Chip
              label={tag}
              onClick={() => {}}
              sx={{
                backgroundColor: "#f0f2f5",
                fontWeight: 500,
                borderRadius: "8px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#6f42c1",
                  color: "white",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 10px rgba(111, 66, 193, 0.2)"
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
