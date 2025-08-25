import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const TenantRequest = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedTenant, setSelectedTenant] = useState(null);

  // Fetch tenant requests
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/tenant-requests");
      const data = await res.json();
      if (data && data.data) {
        setTenants(
          data.data.map((t, index) => ({
            id: t.id,
            sr: index + 1,
            name: t.tenant_name,
            email: t.requester?.email || "N/A",
            status: t.status,
            requestedAt: new Date(t.requested_at).toLocaleString(),
            deleted: false,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching tenants:", err);
      setError("Failed to fetch tenant requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
    
    const interval = setInterval(fetchTenants, 30000);
    return () => clearInterval(interval);
  }, []);

  // Approve / Reject tenant
  const handleApprove = (id) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "approved" } : t))
    );
    setSuccess("Tenant request approved!");
  };

  const handleReject = (id) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "rejected" } : t))
    );
    setSuccess("Tenant request rejected!");
  };

  // Soft delete / Restore
  const handleDelete = (id) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, deleted: true } : t))
    );
    setSuccess("Tenant moved to recycle bin!");
  };

  const handleRestore = (id) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, deleted: false } : t))
    );
    setSuccess("Tenant restored successfully!");
  };

  // View tenant
  const handleView = (tenant) => setSelectedTenant(tenant);
  const handleCloseView = () => setSelectedTenant(null);


  const formatTime12h = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
// setTenants(
//   data.data.map((t, index) => ({
//     id: t.id,
//     sr: index + 1,
//     name: t.tenant_name,
//     email: t.requester?.email || "N/A",
//     status: t.status,
//     requestedAtRaw: t.requested_at, // keep raw timestamp
//     requestedAt: formatTime12h(t.requested_at), // formatted for table
//     deleted: false,
//   }))
// );

  
  // DataGrid Columns
  const columns = [
    { field: "sr", headerName: "Sr", width: 70, sortable: false },
    { field: "name", headerName: "Tenant Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const color =
          params.row.deleted
            ? "red"
            : params.value === "approved"
            ? "green"
            : params.value === "rejected"
            ? "gray"
            : "orange";
        return (
          <span style={{ color, fontWeight: 600 }}>{params.value}</span>
        );
      },
    },
    { field: "requestedAt", headerName: "Requested At", flex: 1.2 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <>
            {!row.deleted ? (
              <>
                {row.status === "pending" && (
                  <>
                    <Button
                      size="small"
                      color="success"
                      onClick={() => handleApprove(row.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleReject(row.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  size="small"
                  onClick={() => handleView(row)}
                >
                  View
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(row.id)}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button
                size="small"
                color="secondary"
                onClick={() => handleRestore(row.id)}
              >
                Restore
              </Button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div>
      {/* Header */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Tenant Requests Dashboard
      </Typography>

      {/* DataGrid */}
      <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
        <CardContent>
          <DataGrid
            rows={tenants}
            columns={columns}
            loading={loading}
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

      {/* View Tenant Modal */}
      <Dialog open={!!selectedTenant} onClose={handleCloseView}>
        <DialogTitle>Tenant Details</DialogTitle>
        <DialogContent>
          {selectedTenant && (
            <>
              <Typography>
                <strong>Name:</strong> {selectedTenant.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedTenant.email}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedTenant.status}
              </Typography>
              <Typography>
  <strong>Requested At:</strong> {formatTime12h(selectedTenant.requestedAtRaw)}
</Typography>

            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={!!success || !!error}
        autoHideDuration={3000}
        onClose={() => {
          setSuccess("");
          setError("");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={success ? "success" : "error"} sx={{ width: "100%" }}>
          {success || error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TenantRequest;
