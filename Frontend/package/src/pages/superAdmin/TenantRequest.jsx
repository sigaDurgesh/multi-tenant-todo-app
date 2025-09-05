import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tenantApi } from "../../services/tenantAdminAPI";
import TenantRequestContext from "../../context/TenantRequestContext";
import { useContext } from "react";

// Utils
const formatLocalDateTime = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const statusColor = (status, deleted = false) => {
  if (deleted) return "error";
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "default";
    case "pending":
    default:
      return "warning";
  }
};

const TenantRequest = () => {
  const [rows, setRows] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [snack, setSnack] = useState({ type: "", msg: "" });
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [acting, setActing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const {superAdminId} = useContext(TenantRequestContext);

  const handleCloseSnack = () => setSnack({ type: "", msg: "" });
  // Fetch table properly
  const fetchTable = useCallback(async () => {
    setLoadingTable(true);
    try {
      const data = await tenantApi.list();
      const list = Array.isArray(data?.data) ? data.data : [];

      setRows(
        list.map((t, idx) => ({
          id: t.id,
          sr: idx + 1,
          name: t.tenant_name,
          email: t.email || t.requester?.email || "N/A",
          status: t.status,
          requestedAtRaw: t.requested_at,
          requestedAt: formatLocalDateTime(t.requested_at),
          deleted: Boolean(t.deleted),
        }))
      );
    } catch (err) {
      setSnack({ type: "error", msg: err.message || "Failed to fetch tenant requests." });
      setRows([]);
    } finally {
      setLoadingTable(false);
    }
  }, []);

  useEffect(() => {
    fetchTable();
    const interval = setInterval(fetchTable, 30000); // auto-refresh
    return () => clearInterval(interval);
  }, [fetchTable]);

  // Filtered rows based on status and search query
  const filteredRows = rows.filter(
    (r) =>
      (statusFilter === "all" || r.status === statusFilter || (statusFilter === "deleted" && r.deleted)) &&
      (r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openView = async (id) => {
    setSelectedId(id);
    setViewOpen(true);
    setViewLoading(true);
    setDetail(null);
    try {
      const data = await tenantApi.getById(id);
      setDetail(data?.data || null);
    } catch (err) {
      setSnack({ type: "error", msg: err.message || "Failed to load details." });
      setViewOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  const closeView = () => {
    setViewOpen(false);
    setSelectedId(null);
    setDetail(null);
    setActing(false);
  };

  const doStatusUpdate = async (id, nextStatus) => {
    setActing(true);
    try {
      await tenantApi.updateStatus(id, nextStatus, superAdminId);
      setSnack({ type: "success", msg: `Request ${nextStatus} successfully.` });
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
      setDetail((prev) => (prev ? { ...prev, status: nextStatus } : prev));
    } catch (err) {
      setSnack({ type: "error", msg: err.message || "Update failed." });
    } finally {
      setActing(false);
    }
  };

  const handleDeleteRow = async (id) => {
    setActing(true);
    try {
      await tenantApi.softDelete(id);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, deleted: true } : r)));
      setSnack({ type: "success", msg: "Moved to recycle bin." });
    } catch (err) {
      setSnack({ type: "error", msg: err.message || "Delete failed." });
    } finally {
      setActing(false);
    }
  };

  const handleRestoreRow = async (id) => {
    setActing(true);
    try {
      await tenantApi.restore(id);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, deleted: false } : r)));
      setSnack({ type: "success", msg: "Restored successfully." });
    } catch (err) {
      setSnack({ type: "error", msg: err.message || "Restore failed." });
    } finally {
      setActing(false);
    }
  };

  const columns = [
    { field: "sr", headerName: "Sr", width: 70 },
    { field: "name", headerName: "Tenant Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.deleted ? "deleted" : params.value}
          color={statusColor(params.value, params.row.deleted)}
          variant="outlined"
          sx={{ textTransform: "capitalize" }}
        />
      ),
    },
    { field: "requestedAt", headerName: "Requested At", flex: 1.2 },
    {
      field: "actions",
      headerName: "Actions",
      width: 320,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Stack direction="row" spacing={1}>
            {!row.deleted && (
              <>
                <Button size="small" onClick={() => openView(row.id)}>
                  View
                </Button>
                {row.status === "pending" && (
                  <>
                   
                  </>
                )}
                
              </>
            )}
            {row.deleted && (
              <Button
                size="small"
                color="secondary"
                onClick={() => handleRestoreRow(row.id)}
                disabled={acting}
              >
                Restore
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Tenant Requests
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={(e, val) => val && setStatusFilter(val)}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="pending">Pending</ToggleButton>
          <ToggleButton value="approved">Approved</ToggleButton>
          <ToggleButton value="rejected">Rejected</ToggleButton>
          {/* <ToggleButton value="deleted">Deleted</ToggleButton> */}
        </ToggleButtonGroup>
        <TextField
          size="small"
          placeholder="Search by name/email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Stack>

      <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
        <CardContent>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loadingTable}
            autoHeight
            pagination
            pageSizeOptions={[10, 15, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: "requestedAtRaw", sort: "asc" }] },
            }}
          />
        </CardContent>
      </Card>

      {/* Tenant Details Dialog */}
<Dialog open={viewOpen} onClose={closeView} fullWidth maxWidth="sm">
  <DialogTitle>Tenant Details</DialogTitle>
  <DialogContent dividers>
    {viewLoading ? (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress />
      </Stack>
    ) : detail ? (
      <Stack spacing={1.5}>
        {Object.entries({
          "Tenant Name": detail.tenant_name,
          Email: detail.email || detail.requester?.email || "N/A",
          Status: detail.status,
          "Requested At": formatLocalDateTime(detail.requested_at),
          "Reviewed By": detail.reviewed_by || "N/A",
          "Reviewed At": detail.reviewed_at
            ? formatLocalDateTime(detail.reviewed_at)
            : "N/A",
        }).map(([label, value]) => (
          <Stack key={label} direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ width: 140, color: "text.secondary" }}>
              {label}
            </Typography>
            {label === "Status" ? (
              <Chip
                size="small"
                label={detail.deleted ? "deleted" : value}
                color={statusColor(detail.status, detail.deleted)}
                variant="outlined"
                sx={{ textTransform: "capitalize" }}
              />
            ) : (
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {value}
              </Typography>
            )}
          </Stack>
        ))}

        <Divider sx={{ my: 1.5 }} />

        {/* Approve/Reject buttons only for pending & not deleted */}
        {detail.status === "pending" && !detail.deleted && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => doStatusUpdate(detail.id, "approved")}
              disabled={acting}
            >
              {acting ? "Approving..." : "Approve"}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => doStatusUpdate(detail.id, "rejected")}
              disabled={acting}
            >
              {acting ? "Rejecting..." : "Reject"}
            </Button>
          </Stack>
        )}
      </Stack>
    ) : (
      <Typography color="text.secondary">No details.</Typography>
    )}
  </DialogContent>
  <Divider />
  <Stack direction="row" spacing={1} sx={{ p: 2 }}>
    <Button onClick={closeView} sx={{ ml: "auto" }}>
      Close
    </Button>
  </Stack>
</Dialog>

      <Snackbar
        open={!!snack.msg}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.type === "success" ? "success" : "error"}
          sx={{ width: "100%" }}
          onClose={handleCloseSnack}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TenantRequest;
