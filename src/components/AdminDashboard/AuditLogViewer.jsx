import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { getOrgAuditLog } from "../../store/actions/adminActions";
import { getRoleName } from "../../helpers/rbac";

function AuditLogViewer() {
  const dispatch = useDispatch();
  const firestore = useFirestore();

  const [orgHandle, setOrgHandle] = useState("");
  const auditLog = useSelector(({ admin }) => admin?.auditLog ?? []);
  const loading = useSelector(({ admin }) => admin?.loading ?? false);

  const handleSearch = e => {
    const val = e.target.value;
    setOrgHandle(val);
    if (val.trim()) {
      getOrgAuditLog(val.trim(), 20)(firestore, dispatch);
    }
  };

  const formatTimestamp = ts => {
    if (!ts) return "—";
    if (ts.toDate) return ts.toDate().toLocaleString();
    return new Date(ts).toLocaleString();
  };

  return (
    <Box mt={3} data-testid="audit-log-viewer">
      <Typography variant="h6" gutterBottom>
        Audit Log
      </Typography>

      <TextField
        size="small"
        label="Organization Handle"
        value={orgHandle}
        onChange={handleSearch}
        placeholder="Enter org handle…"
        sx={{ mb: 2, minWidth: 240 }}
        data-testid="audit-org-handle-input"
      />

      {loading && (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!loading && orgHandle && auditLog.length === 0 && (
        <Typography variant="body2" color="textSecondary">
          No audit entries found for <strong>{orgHandle}</strong>.
        </Typography>
      )}

      {!loading && auditLog.length > 0 && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Actor UID</TableCell>
              <TableCell>Target UID</TableCell>
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
                  {entry.old_permissions ? getRoleName(entry.old_permissions) : "—"}
                </TableCell>
                <TableCell>
                  {entry.new_permissions ? getRoleName(entry.new_permissions) : "Removed"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default AuditLogViewer;
