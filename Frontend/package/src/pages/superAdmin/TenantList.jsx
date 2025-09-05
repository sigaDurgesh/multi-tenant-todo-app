import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import RestoreIcon from "@mui/icons-material/Restore";
import { useNavigate } from "react-router";
import { superAdmin } from "../../services/superAdminAPI"; // API helper

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [totalTenantCount, setTotalTenantCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Fetch tenants from API
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await superAdmin.totalTenantCount();

      const tenantsWithDefaults = (data.tenants || []).map((t) => ({
        ...t,
        is_deleted: t.is_deleted || false,
        is_active: t.is_active !== undefined ? t.is_active : true,
      }));

      setTenants(tenantsWithDefaults);
      setTotalTenantCount(data.totalCount || tenantsWithDefaults.length);
    } catch (err) {
      console.error("Failed to fetch tenants:", err);
      setSuccess("Failed to fetch tenants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Toggle Active / Inactive
  const handleToggleStatus = async (id) => {
    try {
      setTenants((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_active: !t.is_active } : t
        )
      );
      setSuccess("Tenant status updated successfully!");
    } catch (err) {
      console.error(err);
      setSuccess("Failed to update tenant status.");
    }
  };

  // Soft delete
  const handleDelete = async (id) => {
    try {
      await superAdmin.softDelete(id); // API call
      setTenants((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_deleted: true, is_active: false } : t
        )
      );
      setSuccess("Tenant moved to Inactive state!");
    } catch (err) {
      console.error(err);
      setSuccess("Tenant is already deleted.");
    }
  };

  // Restore
  const handleRestore = async (id) => {
    try {
      setTenants((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_deleted: false, is_active: true } : t
        )
      );
      setSuccess("Tenant restored successfully!");
    } catch (err) {
      console.error(err);
      setSuccess("Failed to restore tenant.");
    }
  };

  // View tenant
  const handleView = (tenant) => setSelectedTenant(tenant);
  const handleCloseView = () => setSelectedTenant(null);

  // Filter tenants by status & search
  const filteredTenants = tenants.filter((t) => {
    if (tabValue === 0 && (!t.is_active || t.is_deleted)) return false; // Active
    if (tabValue === 1 && (t.is_active || t.is_deleted)) return false; // Inactive
    if (tabValue === 2 && !t.is_deleted) return false; // Deleted

    if (searchQuery) {
      return (
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  if (loading) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 5 }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div>
      {/* Header */}
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5">Tenant Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/superAdmin/create")}
        >
          Create New Tenant
        </Button>
      </Grid>

      {/* Total Tenant Count */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Total Tenants: <strong>{totalTenantCount}</strong>
      </Typography>

      {/* Tabs for Status */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Active" />
        <Tab label="Inactive" />
        {/* <Tab label="Deleted" /> */}
      </Tabs>

      {/* Search Bar */}
      <TextField
        placeholder="Search by name or email..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Card Wrapper */}
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {tabValue === 0 && "Active Tenants"}
            {tabValue === 1 && "Inactive Tenants"}
            {tabValue === 2 && "Deleted Tenants"}
          </Typography>

          {/* Tenants Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell style={{ fontSize: "14px", fontWeight: "bold" }}>
                    Tenant Name
                  </TableCell>
                  <TableCell style={{ fontSize: "14px", fontWeight: "bold" }}>
                    Admin Email
                  </TableCell>
                  <TableCell style={{ fontSize: "14px", fontWeight: "bold" }}>
                    Total Users
                  </TableCell>
                  <TableCell style={{ fontSize: "14px", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ fontSize: "14px", fontWeight: "bold" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTenants.length > 0 ? (
                  filteredTenants.map((tenant) => (
                    <TableRow
                      key={tenant.id}
                      sx={{ opacity: tenant.is_deleted ? 0.5 : 1 }}
                    >
                      <TableCell>{tenant.name}</TableCell>
                      <TableCell>{tenant.email}</TableCell>
                      <TableCell>{tenant.userCount}</TableCell>
                      <TableCell>
                        {tenant.is_deleted ? (
                          <Chip label="Deleted" color="error" size="small" />
                        ) : tenant.is_active ? (
                          <Chip label="Active" color="success" size="small" />
                        ) : (
                          <Chip label="Inactive" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {!tenant.is_deleted ? (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => handleView(tenant)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            {/* <IconButton
                              color={tenant.is_active ? "warning" : "success"}
                              onClick={() => handleToggleStatus(tenant.id)}
                            >
                              <BlockIcon />
                            </IconButton> */}
                             <IconButton
                              color={tenant.is_active ? "warning" : "success"}
                              onClick={() => handleDelete(tenant.id)}
                            >
                              <BlockIcon />
                            </IconButton> 

                            {/* <IconButton
                              color="error"
                              onClick={() => handleDelete(tenant.id)}
                            >
                              <DeleteIcon />
                            </IconButton> */}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No tenants found.
                    </TableCell>
                  </TableRow>
                )}
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
                <strong>Admin Email:</strong> {selectedTenant.email}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Total Users:</strong> {selectedTenant.userCount}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Status:</strong>{" "}
                {selectedTenant.is_deleted
                  ? "Deleted"
                  : selectedTenant.is_active
                  ? "Active"
                  : "Inactive"}
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
