import React from "react";
import { Badge, IconButton } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsIcon from "@mui/icons-material/Notifications";

/**
 * NotificationBell — bell icon with unread count badge for the navbar.
 *
 * Props:
 *   unreadCount  number    number of unread notifications
 *   onClick      fn        called when bell is clicked
 */
const NotificationBell = ({ unreadCount = 0, onClick }) => {
  const badgeContent = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <IconButton
      onClick={onClick}
      aria-label="Open notifications"
      aria-haspopup="true"
      size="small"
      sx={{ color: "inherit" }}
    >
      <Badge
        badgeContent={badgeContent}
        color="error"
        invisible={unreadCount === 0}
      >
        {unreadCount > 0 ? (
          <NotificationsIcon />
        ) : (
          <NotificationsNoneIcon />
        )}
      </Badge>
    </IconButton>
  );
};

export default NotificationBell;
