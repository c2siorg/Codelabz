import React, { useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import {
  getAdminStats,
  getAdminOrgs,
  getAdminUsers
} from "../../store/actions/adminActions";
import AnalyticsWidget from "./AnalyticsWidget";
import OrgManagement from "./OrgManagement";
import AuditLogViewer from "./AuditLogViewer";

function AdminDashboard() {
  const dispatch = useDispatch();
  const firestore = useFirestore();

  const stats = useSelector(({ admin }) => admin?.stats ?? {});
  const recentOrgs = useSelector(({ admin }) => admin?.recentOrgs ?? []);
  const recentUsers = useSelector(({ admin }) => admin?.recentUsers ?? []);
  const loading = useSelector(({ admin }) => admin?.loading ?? false);
  const error = useSelector(({ admin }) => admin?.error ?? null);

  const fetchAll = () => {
    getAdminStats()(firestore, dispatch);
    getAdminOrgs()(firestore, dispatch);
    getAdminUsers()(firestore, dispatch);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    dispatch({ type: "CLEAR_ADMIN_STATE" });
    fetchAll();
  };

  const formatDate = ts => {
    if (!ts) return "—";
    if (ts.toDate) return ts.toDate().toLocaleDateString();
    return new Date(ts).toLocaleDateString();
  };

  return (
    <Container maxWidth="xl" data-testid="admin-dashboard">
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={4} mb={3}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          data-testid="refresh-button"
        >
          Refresh
        </Button>
      </Box>

      {/* Analytics widgets */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={4}>
          <AnalyticsWidget
            title="Total Users"
            value={stats.totalUsers ?? null}
            loading={loading}
            error={error}
            onRetry={handleRefresh}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AnalyticsWidget
            title="Total Organizations"
            value={stats.totalOrgs ?? null}
            loading={loading}
            error={error}
            onRetry={handleRefresh}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AnalyticsWidget
            title="Total Tutorials"
            value={stats.totalTutorials ?? null}
            loading={loading}
            error={error}
            onRetry={handleRefresh}
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Recent Organizations */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
        <Typography variant="h6" gutterBottom>
          Recently Created Organizations
        </Typography>
        {loading && recentOrgs.length === 0 ? (
          <CircularProgress size={20} />
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Handle</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrgs.slice(0, 10).map(org => (
                <TableRow key={org.org_handle}>
                  <TableCell>{org.org_name}</TableCell>
                  <TableCell>{org.org_handle}</TableCell>
                  <TableCell>{formatDate(org.createdAt)}</TableCell>
                  <TableCell>{org.memberCount ?? "—"}</TableCell>
                  <TableCell>
                    <Chip
                      label={org.org_published ? "Published" : "Unpublished"}
                      color={org.org_published ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {recentOrgs.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No organizations yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Recent Users */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
        <Typography variant="h6" gutterBottom>
          Recently Registered Users
        </Typography>
        {loading && recentUsers.length === 0 ? (
          <CircularProgress size={20} />
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Display Name</TableCell>
                <TableCell>Handle</TableCell>
                <TableCell>Registered</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentUsers.slice(0, 10).map((user, i) => (
                <TableRow key={user.uid ?? i}>
                  <TableCell>{user.displayName || "—"}</TableCell>
                  <TableCell>{user.handle || "—"}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                </TableRow>
              ))}
              {recentUsers.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={3} align="center">No users yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Org Management — searchable, paginated, force-unpublish */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
        <OrgManagement />
      </Paper>

      {/* Audit Log Viewer */}
      <Paper sx={{ p: 2, mb: 4 }} elevation={1}>
        <AuditLogViewer />
      </Paper>
    </Container>
  );
}

export default AdminDashboard;
