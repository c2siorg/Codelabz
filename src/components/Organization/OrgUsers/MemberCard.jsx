import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Select,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  getRoleName,
  getPermissionLevel,
  getAssignableRoles,
  canManageMember
} from "../../../helpers/rbac";

const ROLE_COLORS = {
  owner: "error",
  admin: "warning",
  editor: "primary",
  viewer: "default"
};

const useStyles = makeStyles(theme => ({
  card: {
    padding: theme.spacing(1.5),
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: theme.palette.background.default
    }
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5)
  },
  name: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightMedium
  },
  handle: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary
  },
  roleSelect: {
    minWidth: 110,
    fontSize: theme.typography.pxToRem(13)
  },
  removeBtn: {
    marginLeft: theme.spacing(1),
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main
  }
}));


function MemberCard({
  member,
  currentUserLevel,
  orgHandle,
  currentUserHandle,
  onRoleChange,
  onRemove
}) {
  const classes = useStyles();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const memberLevel = getPermissionLevel(member.permission_level);
  const roleName = getRoleName(member.permission_level);

  const canEditRole = canManageMember(currentUserLevel, memberLevel);

  const allowedOptions = getAssignableRoles(currentUserLevel);

  const isSelf = member.handle === currentUserHandle;
  // An owner cannot remove a fellow owner, so this tracks canEditRole exactly.
  const canRemove = !isSelf && canManageMember(currentUserLevel, memberLevel);

  const handleRoleChange = e => {
    const newLevel = Number(e.target.value);
    onRoleChange(member.handle, [newLevel]);
  };

  const handleRemoveConfirm = () => {
    setConfirmOpen(false);
    onRemove(member.handle);
  };

  const avatarContent = member.image
    ? undefined
    : (member.name || member.handle || "?").charAt(0).toUpperCase();

  return (
    <>
      <Paper elevation={0} className={classes.card}>
        <Grid container alignItems="center" spacing={1}>
          {/* Avatar */}
          <Grid item>
            <Avatar
              src={member.image || undefined}
              className={classes.avatar}
            >
              {!member.image && avatarContent}
            </Avatar>
          </Grid>

          {/* Name + handle */}
          <Grid item xs>
            <Typography className={classes.name}>
              {member.name || member.handle}
            </Typography>
            <Typography className={classes.handle}>@{member.handle}</Typography>
          </Grid>

          {/* Role chip or editable select */}
          <Grid item>
            {canEditRole ? (
              <Select
                size="small"
                value={memberLevel}
                onChange={handleRoleChange}
                className={classes.roleSelect}
                variant="outlined"
                data-testid={`role-select-${member.handle}`}
              >
                {allowedOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Chip
                label={roleName.charAt(0).toUpperCase() + roleName.slice(1)}
                color={ROLE_COLORS[roleName] || "default"}
                size="small"
                data-testid={`role-chip-${member.handle}`}
              />
            )}
          </Grid>

          {/* Remove button */}
          {canRemove && (
            <Grid item>
              <Button
                size="small"
                variant="outlined"
                className={classes.removeBtn}
                onClick={() => setConfirmOpen(true)}
                data-testid={`remove-btn-${member.handle}`}
              >
                Remove
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="remove-member-dialog-title"
      >
        <DialogTitle id="remove-member-dialog-title">Remove Member</DialogTitle>
        <DialogContent>
          <Typography>
            Remove <strong>@{member.handle}</strong> from the organization? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRemoveConfirm}
            color="error"
            variant="contained"
            data-testid={`confirm-remove-${member.handle}`}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MemberCard;
