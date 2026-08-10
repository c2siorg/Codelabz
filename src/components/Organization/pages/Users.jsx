import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import {
  getOrgUserData,
  addOrgUser,
  removeOrgUser,
  updateOrgUserPermissions
} from "../../../store/actions";
import { getOrgAuditLog } from "../../../store/actions/adminActions";
import MemberCard from "../OrgUsers/MemberCard";
import useOrgPermission from "../../../helpers/customHooks/useOrgPermission";
import RequiresRole from "../../../helpers/RequiresRole";
import {
  getRoleName,
  PERMISSION_LEVELS,
  getAssignableRoles
} from "../../../helpers/rbac";

const useStyles = makeStyles(theme => ({
  root: { padding: 20 },
  heading: { fontWeight: 100, fontSize: "1.6rem" },
  subheading: { fontSize: "0.95rem", color: theme.palette.text.secondary },
  memberList: { marginTop: theme.spacing(2) },
  loadingContainer: { display: "flex", justifyContent: "center", padding: theme.spacing(4) },
  errorContainer: { padding: theme.spacing(2) },
  retryButton: { marginTop: theme.spacing(1) },
  formPaper: { padding: theme.spacing(2), marginTop: theme.spacing(3) },
  formRow: { display: "flex", gap: theme.spacing(2), alignItems: "flex-end", flexWrap: "wrap" },
  auditPaper: { padding: theme.spacing(2), marginTop: theme.spacing(3) }
}));

function AddMemberForm({ orgHandle, currentUserLevel }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const firestore = useFirestore();

  const [handle, setHandle] = useState("");
  const [role, setRole] = useState(PERMISSION_LEVELS.VIEWER);

  const isLoaded = useSelector(({ org: { user: { isLoaded } } }) => isLoaded);
  const error = useSelector(({ org: { user: { error } } }) => error ?? null);

  const availableRoles = getAssignableRoles(currentUserLevel);

  const handleSubmit = e => {
    e.preventDefault();
    if (!handle.trim()) return;
    addOrgUser({ org_handle: orgHandle, handle: handle.trim(), permissions: [role] })(firestore, dispatch);
  };

  useEffect(() => {
    if (isLoaded && error === false) {
      setHandle("");
    }
  }, [isLoaded, error]);

  return (
    <Paper elevation={1} className={classes.formPaper}>
      <Typography variant="subtitle1" gutterBottom>
        Add Member
      </Typography>
      {error && typeof error === "string" && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        className={classes.formRow}
      >
        <TextField
          size="small"
          label="User Handle"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          required
          data-testid="add-member-handle"
          sx={{ minWidth: 180 }}
        />
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="add-role-label">Role</InputLabel>
          <Select
            labelId="add-role-label"
            value={role}
            label="Role"
            onChange={e => setRole(Number(e.target.value))}
            data-testid="add-member-role"
          >
            {availableRoles.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          disabled={!isLoaded || !handle.trim()}
          data-testid="add-member-submit"
        >
          Add
        </Button>
      </Box>
    </Paper>
  );
}

function AuditLogPanel({ orgHandle }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const firestore = useFirestore();

  const auditLog = useSelector(({ admin }) => admin?.auditLog ?? []);
  const loading = useSelector(({ admin }) => admin?.loading ?? false);

  useEffect(() => {
    if (!orgHandle) return;
    getOrgAuditLog(orgHandle, 10)(firestore, dispatch);
  }, [orgHandle, firestore, dispatch]);

  const formatTimestamp = ts => {
    if (!ts) return "—";
    if (ts.toDate) return ts.toDate().toLocaleString();
    return new Date(ts).toLocaleString();
  };

  return (
    <Paper elevation={1} className={classes.auditPaper}>
      <Typography variant="subtitle1" gutterBottom>
        Recent Role Changes (last 10)
      </Typography>
      {loading && (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} />
        </Box>
      )}
      {!loading && auditLog.length === 0 && (
        <Typography variant="body2" color="textSecondary">
          No audit entries yet.
        </Typography>
      )}
      {!loading && auditLog.length > 0 && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Actor</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Old Role</TableCell>
              <TableCell>New Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditLog.map((entry, i) => (
              <TableRow key={entry.id ?? i}>
                <TableCell>{formatTimestamp(entry.timestamp)}</TableCell>
                <TableCell>{entry.actor_uid}</TableCell>
                <TableCell>{entry.target_uid}</TableCell>
                <TableCell>
                  {entry.old_permissions
                    ? getRoleName(entry.old_permissions)
                    : "—"}
                </TableCell>
                <TableCell>
                  {entry.new_permissions
                    ? getRoleName(entry.new_permissions)
                    : "Removed"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

function Users() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const firestore = useFirestore();

  const data = useSelector(({ org: { user: { data } } }) => data ?? []);
  const isLoaded = useSelector(({ org: { user: { isLoaded } } }) => isLoaded);
  const error = useSelector(({ org: { user: { error } } }) => error ?? null);
  const orgHandle = useSelector(({ org: { general: { current } } }) => current);
  const actorHandle = useSelector(({ firebase: { profile } }) => profile?.handle ?? null);

  const { level: currentUserLevel, permissions: actorPermissions } = useOrgPermission();

  const loadData = () => {
    if (orgHandle) getOrgUserData(orgHandle)(firestore, dispatch);
  };

  useEffect(() => {
    if (orgHandle && !isLoaded) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgHandle]);

  const handleRoleChange = (handle, newPermissions) => {
    updateOrgUserPermissions({
      org_handle: orgHandle,
      handle,
      newPermissions,
      actorPermissions
    })(firestore, dispatch);
  };

  const handleRemove = handle => {
    removeOrgUser({ org_handle: orgHandle, handle })(firestore, dispatch);
  };

  return (
    <React.Fragment>
      <Grid
        container
        className={classes.root}
        direction="column"
        spacing={3}
        data-testid="organization-users-page"
      >
        {/* Heading */}
        <Grid item>
          <Typography className={classes.heading}>Users</Typography>
          {isLoaded && !error && (
            <Typography className={classes.subheading}>
              {data.length} member{data.length !== 1 ? "s" : ""}
            </Typography>
          )}
        </Grid>

        {/* Loading */}
        {!isLoaded && (
          <Grid item className={classes.loadingContainer}>
            <CircularProgress data-testid="users-loading" />
          </Grid>
        )}

        {/* Error */}
        {isLoaded && error && (
          <Grid item className={classes.errorContainer}>
            <Alert severity="error" data-testid="users-error">
              {error}
            </Alert>
            <Button
              variant="outlined"
              color="primary"
              className={classes.retryButton}
              onClick={loadData}
              data-testid="users-retry-button"
            >
              Retry
            </Button>
          </Grid>
        )}

        {/* Member list */}
        {isLoaded && !error && (
          <Grid item container direction="column" className={classes.memberList} spacing={1}>
            {data.map((member, index) => (
              <Grid item key={member.handle ?? index}>
                <MemberCard
                  member={member}
                  currentUserLevel={currentUserLevel}
                  currentUserHandle={actorHandle}
                  orgHandle={orgHandle}
                  onRoleChange={handleRoleChange}
                  onRemove={handleRemove}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add Member Form */}
        <Grid item>
          <RequiresRole minLevel={2}>
            <AddMemberForm orgHandle={orgHandle} currentUserLevel={currentUserLevel} />
          </RequiresRole>
        </Grid>

        {/* Audit Log Panel  */}
        <Grid item>
          <RequiresRole minLevel={3}>
            <AuditLogPanel orgHandle={orgHandle} />
          </RequiresRole>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Users;
