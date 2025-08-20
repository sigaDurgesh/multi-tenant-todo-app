import React, { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import RestoreIcon from "@mui/icons-material/Restore";

const TenantList = () => {
  // Example tenant data (replace with API later)
  const initialTenants = [
    {
      id: 1,
      name: "Acme Corp",
      adminEmail: "admin@acme.com",
      users: 25,
      status: "Active",
      deleted: false,
    },
    {
      id: 2,
      name: "Globex Ltd",
      adminEmail: "contact@globex.com",
      users: 12,
      status: "Inactive",
      deleted: false,
    },
    {
      id: 3,
      name: "Initech",
      adminEmail: "support@initech.com",
      users: 40,
      status: "Active",
      deleted: false,
    },
  ];

  const [tenants, setTenants] = useState(initialTenants);
  const [success, setSuccess] = useState("");
  const [selectedTenant, setSelectedTenant] = useState(null);

  // Toggle block/unblock
  const handleToggleStatus = (id) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Active" ? "Inactive" : "Active" }
          : t
      )
    );
    setSuccess("Tenant status updated successfully!");
  };

  // Soft delete
  const handleDelete = (id) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, deleted: true } : t))
    );
    setSuccess("Tenant moved to recycle bin!");
  };

  // Restore deleted tenant
  const handleRestore = (id) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, deleted: false } : t))
    );
    setSuccess("Tenant restored successfully!");
  };

  // View tenant details
  const handleView = (tenant) => {
    setSelectedTenant(tenant);
  };

  const handleCloseView = () => setSelectedTenant(null);

  return (
    <div>
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Tenant Management</Typography>
        <Button variant="contained" color="primary">
          Create New Tenant
        </Button>
      </Grid>

      {/* Card Wrapper */}
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Tenants
          </Typography>

          {/* Tenants Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tenant Name</TableCell>
                  <TableCell>Admin Email</TableCell>
                  <TableCell>Total Users</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow
                    key={tenant.id}
                    sx={{ opacity: tenant.deleted ? 0.5 : 1 }}
                  >
                    <TableCell>{tenant.name}</TableCell>
                    <TableCell>{tenant.adminEmail}</TableCell>
                    <TableCell>{tenant.users}</TableCell>
                    <TableCell>
                      {tenant.deleted ? (
                        <Chip label="Deleted" color="error" size="small" />
                      ) : (
                        <Chip
                          label={tenant.status}
                          color={
                            tenant.status === "Active" ? "success" : "default"
                          }
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {!tenant.deleted ? (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleView(tenant)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            color={
                              tenant.status === "Active" ? "warning" : "success"
                            }
                            onClick={() => handleToggleStatus(tenant.id)}
                          >
                            <BlockIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(tenant.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton
                          color="secondary"
                          onClick={() => handleRestore(tenant.id)}
                        >
                          <RestoreIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* View Tenant Modal */}
      <Dialog open={!!selectedTenant} onClose={handleCloseView}>
        <DialogTitle>Tenant Details</DialogTitle>
        <DialogContent>
          {selectedTenant && (
            <>
              <Typography variant="subtitle1">
                <strong>Name:</strong> {selectedTenant.name}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Admin Email:</strong> {selectedTenant.adminEmail}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Total Users:</strong> {selectedTenant.users}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Status:</strong> {selectedTenant.status}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success messages */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TenantList;
