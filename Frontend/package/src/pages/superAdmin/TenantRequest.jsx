import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  DialogActions,
  Stack,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tenantApi } from "../../services/tenantAdminAPI";


// Utility
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

  const [acting, setActing] = useState(false); // approve/reject loading

  // Pretend superAdmin id is known (replace with your AuthContext if you have it)
  const superAdminId = "0cdf325e-573b-4d79-9dcf-c1fe29c4a74f";

  const handleCloseSnack = () => setSnack({ type: "", msg: "" });

  const fetchTable = useCallback(async () => {
    try {
      setLoadingTable(true);
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
    } catch (e) {
      setSnack({ type: "error", msg: e.message || "Failed to fetch tenant requests." });
    } finally {
      setLoadingTable(false);
    }
  }, []);

  useEffect(() => {
    fetchTable();
    const interval = setInterval(fetchTable, 30000);
    return () => clearInterval(interval);
  }, [fetchTable]);

  const openView = async (id) => {
    setSelectedId(id);
    setViewOpen(true);
    setViewLoading(true);
    setDetail(null);
    try {
      const data = await tenantApi.getById(id);
      // backend returns { data: {...} }
      setDetail(data?.data || null);
    } catch (e) {
      setSnack({ type: "error", msg: e.message || "Failed to load details." });
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
    try {
      setActing(true);
      await tenantApi.updateStatus(id, nextStatus, superAdminId);
      setSnack({
        type: "success",
        msg: `Request ${nextStatus === "approved" ? "approved" : "rejected"} successfully.`,
      });
      // Update table row in place
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
      // Update detail if open
      setDetail((prev) => (prev ? { ...prev, status: nextStatus } : prev));
    } catch (e) {
      setSnack({ type: "error", msg: e.message || "Update failed." });
    } finally {
      setActing(false);
    }
  };

  const handleApproveRow = (id) => doStatusUpdate(id, "approved");
  const handleRejectRow = (id) => doStatusUpdate(id, "rejected");

  const handleDeleteRow = async (id) => {
    try {
      setActing(true);
      await tenantApi.softDelete(id);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, deleted: true } : r)));
      setSnack({ type: "success", msg: "Moved to recycle bin." });
    } catch (e) {
      setSnack({ type: "error", msg: e.message || "Delete failed." });
    } finally {
      setActing(false);
    }
  };

  const handleRestoreRow = async (id) => {
    try {
      setActing(true);
      await tenantApi.restore(id);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, deleted: false } : r)));
      setSnack({ type: "success", msg: "Restored successfully." });
    } catch (e) {
      setSnack({ type: "error", msg: e.message || "Restore failed." });
    } finally {
      setActing(false);
    }
  };

  const columns = useMemo(
    () => [
      { field: "sr", headerName: "Sr", width: 70, sortable: false },
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
              {!row.deleted ? (
                <>
                  {row.status === "pending" && (
                    <>
                      {/* <Button
                        size="small"
                        color="success"
                        onClick={() => handleApproveRow(row.id)}
                        disabled={acting}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRejectRow(row.id)}
                        disabled={acting}
                      >
                        Reject
                      </Button> */}
                    </>
                  )}
                  <Button size="small" onClick={() => openView(row.id)}>
                    View
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteRow(row.id)}
                    disabled={acting}
                  >
                    Delete
                  </Button>
                </>
              ) : (
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
    ],
    [acting]
  );

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Tenant Requests Dashboard
      </Typography>

      <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loadingTable}
            autoHeight
            pagination
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
              sorting: { sortModel: [{ field: "requestedAt", sort: "desc" }] },
            }}
          />
        </CardContent>
      </Card>

      {/* View / Manage Modal */}
      <Dialog open={viewOpen} onClose={closeView} fullWidth maxWidth="sm">
        <DialogTitle>Tenant Details</DialogTitle>
        <DialogContent dividers>
          {viewLoading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress />
            </Stack>
          ) : detail ? (
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ width: 140, color: "text.secondary" }}>
                  ID
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {detail.id}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ width: 140, color: "text.secondary" }}>
                  Tenant Name
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {detail.tenant_name}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ width: 140, color: "text.secondary" }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {detail.email || detail.requester?.email || "N/A"}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ width: 140, color: "text.secondary" }}>
                  Status
                </Typography>
                <Chip
                  size="small"
                  label={detail.deleted ? "deleted" : detail.status}
                  color={statusColor(detail.status, detail.deleted)}
                  variant="outlined"
                  sx={{ textTransform: "capitalize" }}
                />
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ width: 140, color: "text.secondary" }}>
                  Requested At
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatLocalDateTime(detail.requested_at)}
                </Typography>
              </Stack>

              {detail.reviewed_by && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ width: 140, color: "text.secondary" }}>
                    Reviewed By
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {detail.reviewed_by}
                  </Typography>
                </Stack>
              )}

              {detail.reviewed_at && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ width: 140, color: "text.secondary" }}>
                    Reviewed At
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatLocalDateTime(detail.reviewed_at)}
                  </Typography>
                </Stack>
              )}

              <Divider sx={{ my: 1.5 }} />

              <Stack direction="row" spacing={1}>
                {detail.status === "pending" && !detail.deleted && (
                  <>
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
                  </>
                )}
                <Button onClick={closeView} sx={{ ml: "auto" }}>
                  Close
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Typography color="text.secondary">No details.</Typography>
          )}
        </DialogContent>
        <DialogActions />
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
