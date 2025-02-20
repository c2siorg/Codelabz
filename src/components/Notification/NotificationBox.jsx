import React from "react";
import { Grid, Card, Menu, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import useStyles from "./styles";
import { useState, useRef } from "react";
import { blue } from "@mui/material/colors";
import { readNotification, deleteNotification } from "../../store/actions";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch } from "react-redux";

const NotificationBox = ({ notification, onDelete }) => {
  const classes = useStyles();
  const anchorRef = useRef();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleRead = async () => {
    notification.isRead = true;
    await readNotification(notification.notification_id)(
      firebase,
      firestore,
      dispatch
    );
    handleClose();
  };
  const handleDelete = async () => {
    await deleteNotification(notification.notification_id)(
      firebase,
      firestore,
      dispatch
    );
    await onDelete(notification.notification_id);
  };

  const getRelativeTime = timestamp => {
    const now = new Date();
    const createdAt = timestamp.toDate();
    const diff = Math.floor((now - createdAt) / 1000);

    if (diff < 60) {
      return `${diff} seconds ago`;
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diff / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <Card
      className={classes.Notification}
      style={{
        backgroundColor: notification.isRead ? "#fff" : blue[50],
        borderRadius: "16px",
        padding: "16px",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "16px"
      }}
    >
      {!notification.isRead && <Box className={classes.unread}></Box>}
      <Avatar
        aria-label="recipe"
        className={classes.avatar}
        data-testId="UserAvatar"
        sx={{
          width: "60px",
          height: "60px"
        }}
      >
        S
      </Avatar>
      <Box>
        <Typography>
          <span style={{ fontWeight: "600" }}>{notification.username}</span>{" "}
          from <span style={{ fontWeight: "600" }}>{notification.org}</span>
        </Typography>
        <Typography className={classes.time}>
          {getRelativeTime(notification.createdAt)}
        </Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>
          {notification.content}
        </Typography>
        <Link
          to={`/tutorial/${notification?.tutorial_id}`}
          onClick={handleRead}
        >
          <Typography variant="body2" color="primary">
            View tutorial
          </Typography>
        </Link>
      </Box>
      <div>
        <IconButton
          ref={anchorRef}
          onClick={() => {
            setOpen(true);
          }}
          aria-label="share"
          data-testId="MoreIcon"
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          <MoreHorizOutlinedIcon />
        </IconButton>
        <Menu anchorEl={anchorRef.current} open={open} onClose={handleClose}>
          {!notification.isRead && (
            <MenuItem onClick={handleRead}>Mark as read</MenuItem>
          )}
          <MenuItem onClick={() => handleDelete()}>Delete</MenuItem>
          <MenuItem onClick={handleClose}>
            Block {notification.username}
          </MenuItem>
        </Menu>
      </div>
    </Card>
  );
};

export default NotificationBox;
