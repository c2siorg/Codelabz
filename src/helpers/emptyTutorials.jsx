import React, { useState, useCallback } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import NewTutorial from "../components/Tutorials/NewTutorial";
import EmptySVG from "../assets/images/empty.svg";

const EmptyTutorials = ({ org, orgHandle }) => {
  const [visibleModal, setVisibleModal] = useState(false);

  const openModal = useCallback(() => setVisibleModal(true), []);
  const closeModal = useCallback(() => setVisibleModal(prev => !prev), []);
  const closeCallback = useCallback(() => setVisibleModal(false), []);

  return (
    <Grid container justifyContent="center" alignItems="center"
      sx={{ minHeight: "60vh", padding: { xs: "16px", sm: "32px" } }}
    >
      <Grid item xs={12} sm={8} md={6}>
        <Box sx={{
            display: "flex", flexDirection: "column", alignItems: "center",
            background: "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)",
            borderRadius: "16px", padding: { xs: "32px 20px", sm: "48px 40px" },
            textAlign: "center", border: "2px dashed #c5cae9",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}>
          <Box component="img" src={EmptySVG} alt="No tutorials yet"
            sx={{ width: { xs: "140px", sm: "200px" }, height: "auto", marginBottom: "24px", opacity: 0.85 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a237e", marginBottom: "8px" }}>
            No Tutorials Yet
          </Typography>
          <Typography variant="body1" sx={{ color: "#5c6bc0", marginBottom: "32px", maxWidth: "320px" }}>
            {org} has no CodeLabz yet. Create your first tutorial and start sharing knowledge!
          </Typography>
          <Button onClick={openModal} variant="contained" startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #3949ab, #1a237e)",
              color: "#ffffff", borderRadius: "8px", fontWeight: 600,
              textTransform: "none", padding: { xs: "10px 24px", sm: "12px 32px" },
              "&:hover": { background: "linear-gradient(135deg, #1a237e, #0d1257)" }
            }}
          >
            Add New Tutorial
          </Button>
        </Box>
      </Grid>
      <NewTutorial viewModal={visibleModal} onSidebarClick={e => closeModal(e)}
        viewCallback={closeCallback} active={orgHandle} />
    </Grid>
  );
};

export default EmptyTutorials;
