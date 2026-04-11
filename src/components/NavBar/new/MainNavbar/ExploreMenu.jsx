import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, Paper, Typography, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const ExploreMenu = ({ onClose }) => {
  const menuItems = [
    { text: "Home", icon: <HomeIcon />, link: "/" },
    { text: "Notifications", icon: <NotificationsIcon />, link: "/notification" },
    { text: "User Settings", icon: <ManageAccountsIcon />, link: "/profile" },
    { text: "Organization Settings", icon: <SettingsIcon />, link: "/organization" },
    { text: "Organizations", icon: <GroupIcon />, link: "/organization" },
    { text: "My Feed", icon: <RssFeedIcon />, link: "/dashboard/my_feed" },
    { text: "Profile", icon: <PersonIcon />, link: "/profile" },
    { text: "Bookmarks", icon: <BookmarkIcon />, link: "/dashboard" },
    { text: "Tutorials", icon: <MenuBookIcon />, link: "/tutorials" },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <List component="nav" aria-label="explore menu">
        {menuItems.map((item, index) => (
          <ListItem
            button
            component={Link}
            to={item.link}
            key={index}
            onClick={onClose}
            sx={{
              borderRadius: "8px",
              mb: 0.5,
              mx: 1,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#f3eaff",
                color: "#6f42c1",
                transform: "translateX(5px)",
                "& .MuiListItemIcon-root": {
                   color: "#6f42c1",
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px", color: "#666" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.text}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ExploreMenu;
