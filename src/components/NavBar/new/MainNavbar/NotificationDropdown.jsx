import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Snackbar,
  Tooltip,
  Typography
} from "@mui/material";
import { blue } from "@mui/material/colors";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import {
  readNotification,
  deleteNotification,
  markAllNotificationsRead
} from "../../../../store/actions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const timeAgo = timestamp => {
  if (!timestamp) return "";
  try {
    const seconds = Math.floor(
      (Date.now() - timestamp.toDate().getTime()) / 1000
    );
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  } catch (e) {
    console.error("timeAgo: could not parse timestamp", timestamp, e);
    return "";
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

const NotificationDropdown = ({ anchorEl, onClose }) => {
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const firestore = useFirestore();

  const notifications = useSelector(
    state => state.notifications?.data?.notifications ?? []
  );
  const markAllError = useSelector(
    state => state.notifications?.data?.error || null
  );

  // Local boolean so Snackbar can be dismissed without leaving stale Redux error
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);
  useEffect(() => {
    if (markAllError) setErrorSnackOpen(true);
  }, [markAllError]);

  const uid = useSelector(({ firebase: { auth } }) => auth?.uid);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recent = notifications.slice(0, 10);
  const open = Boolean(anchorEl);

  const handleMarkRead = id =>
    readNotification(id)(firebase, firestore, dispatch);

  const handleDelete = id =>
    deleteNotification(id)(firebase, firestore, dispatch);

  const handleMarkAll = () => {
    if (uid) markAllNotificationsRead(uid)(firebase, firestore, dispatch);
  };

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 520,
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Tooltip title="Mark all as read">
              <Button
                size="small"
                startIcon={<DoneAllIcon />}
                onClick={handleMarkAll}
                sx={{ textTransform: "none" }}
              >
                Mark all read
              </Button>
            </Tooltip>
          )}
        </Box>
        <Divider />

        {/* List */}
        <Box sx={{ overflowY: "auto", flex: 1 }}>
          {recent.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                color: "text.secondary"
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body2">No notifications yet</Typography>
            </Box>
          ) : (
            recent.map(notification => (
              <Box
                key={notification.notification_id}
                sx={{
                  px: 2,
                  py: 1.5,
                  backgroundColor: notification.isRead ? "white" : blue[50],
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: notification.isRead ? 400 : 600,
                      wordBreak: "break-word"
                    }}
                  >
                    {notification.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {timeAgo(notification.createdAt)}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
                >
                  {!notification.isRead && (
                    <Tooltip title="Mark as read">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleMarkRead(notification.notification_id)
                        }
                      >
                        <DoneAllIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleDelete(notification.notification_id)
                      }
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* Footer */}
        <Divider />
        <Box sx={{ px: 2, py: 1, textAlign: "center" }}>
          <Link
            to="/notification"
            onClick={onClose}
            style={{ textDecoration: "none" }}
          >
            <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
              View all notifications
            </Typography>
          </Link>
        </Box>
      </Popover>

      {/* Error snackbar — has onClose so it doesn't reopen on next render */}
      <Snackbar
        open={errorSnackOpen}
        autoHideDuration={4000}
        onClose={() => setErrorSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setErrorSnackOpen(false)}
          sx={{ width: "100%" }}
        >
          Failed to mark notifications as read. Please try again.
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationDropdown;
