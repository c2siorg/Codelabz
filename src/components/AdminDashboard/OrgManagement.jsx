import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { forceUnpublishOrg } from "../../store/actions/adminActions";

const ROWS_PER_PAGE = 10;

function OrgManagement() {
  const dispatch = useDispatch();
  const firestore = useFirestore();

  const allOrgs = useSelector(({ admin }) => admin?.allOrgs ?? []);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [unpublishTarget, setUnpublishTarget] = useState(null);

  // Client-side filter with debounce via useMemo + search state
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return allOrgs;
    return allOrgs.filter(
      o =>
        (o.org_name || "").toLowerCase().includes(q) ||
        (o.org_handle || "").toLowerCase().includes(q)
    );
  }, [allOrgs, search]);

  // Reset to page 0 on search change
  useEffect(() => {
    setPage(0);
  }, [search]);

  const paged = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const handleForceUnpublish = () => {
    if (!unpublishTarget) return;
    forceUnpublishOrg(unpublishTarget)(firestore, dispatch);
    setUnpublishTarget(null);
  };

  const formatDate = ts => {
    if (!ts) return "—";
    if (ts.toDate) return ts.toDate().toLocaleDateString();
    return new Date(ts).toLocaleDateString();
  };

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Organization Management
      </Typography>

      <TextField
        size="small"
        placeholder="Search by name or handle…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          )
        }}
        sx={{ mb: 2, minWidth: 280 }}
        data-testid="org-search"
      />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Handle</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Members</TableCell>
            <TableCell>Tutorials</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paged.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No organizations found.
              </TableCell>
            </TableRow>
          )}
          {paged.map(org => (
            <TableRow key={org.org_handle} data-testid={`org-row-${org.org_handle}`}>
              <TableCell>{org.org_name}</TableCell>
              <TableCell>{org.org_handle}</TableCell>
              <TableCell>
                <Chip
                  label={org.org_published ? "Published" : "Unpublished"}
                  color={org.org_published ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>{org.memberCount ?? "—"}</TableCell>
              <TableCell>{org.tutorialCount ?? "—"}</TableCell>
              <TableCell>{formatDate(org.createdAt)}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  disabled={!org.org_published}
                  onClick={() => setUnpublishTarget(org.org_handle)}
                  data-testid={`unpublish-btn-${org.org_handle}`}
                >
                  Force Unpublish
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        rowsPerPage={ROWS_PER_PAGE}
        rowsPerPageOptions={[ROWS_PER_PAGE]}
        onPageChange={(_, newPage) => setPage(newPage)}
      />

      {/* Confirm dialog */}
      <Dialog open={Boolean(unpublishTarget)} onClose={() => setUnpublishTarget(null)}>
        <DialogTitle>Force Unpublish</DialogTitle>
        <DialogContent>
          <Typography>
            Unpublish <strong>{unpublishTarget}</strong>? It will no longer be visible to the
            public.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnpublishTarget(null)}>Cancel</Button>
          <Button onClick={handleForceUnpublish} color="warning" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OrgManagement;
