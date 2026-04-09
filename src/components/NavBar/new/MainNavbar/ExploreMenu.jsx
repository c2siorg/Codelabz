import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, Typography, Box, Divider } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

const ExploreMenu = ({ onClose }) => {
  const topItems = [
    { text: "Home", icon: <HomeOutlinedIcon />, link: "/" },
    { text: "Notifications", icon: <NotificationsOutlinedIcon />, link: "/notification" },
    { text: "User Settings", icon: <SettingsOutlinedIcon />, link: "/profile" },
    { text: "Organizations", icon: <GroupOutlinedIcon />, link: "/organization" },
  ];

  const bottomItems = [
    { text: "Profile", icon: <PersonOutlinedIcon />, link: "/profile" },
    { text: "Bookmarks", icon: <BookmarkBorderIcon />, link: "/dashboard" },
    { text: "Tutorials", icon: <MenuBookOutlinedIcon />, link: "/tutorials" },
  ];

  const renderItem = (item, index) => (
    <ListItem
      button
      component={Link}
      to={item.link}
      key={index}
      onClick={onClose}
      sx={{
        py: 1.2,
        px: 3,
        "&:hover": {
          backgroundColor: "#f5f5f5",
        }
      }}
    >
      <ListItemIcon sx={{ minWidth: "45px", color: "#000" }}>
        {React.cloneElement(item.icon, { sx: { fontSize: "1.5rem" } })}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body1" sx={{ fontSize: "1rem", color: "#000", fontWeight: 400 }}>
            {item.text}
          </Typography>
        }
      />
    </ListItem>
  );

  return (
    <Box sx={{ width: "100%", py: 1 }}>
      <Typography
        variant="caption"
        sx={{
          px: 3,
          py: 1.5,
          display: "block",
          fontWeight: 700,
          color: "#8c8c8c",
          letterSpacing: "0.5px",
          fontSize: "0.8rem",
          textTransform: "uppercase",
        }}
      >
        EXPLORE
      </Typography>
      
      <List sx={{ p: 0 }}>
        {topItems.map(renderItem)}
      </List>
      
      <Divider sx={{ my: 1, mx: 0, borderColor: "#eee" }} />
      
      <List sx={{ p: 0 }}>
        {bottomItems.map(renderItem)}
      </List>
    </Box>
  );
};

export default ExploreMenu;
