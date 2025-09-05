import React, { useContext, useEffect, useState } from "react";
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
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  Stack,
  Tooltip,
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";

import BlockIcon from "@mui/icons-material/Block";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import { useNavigate } from "react-router";
import { TenantRequestContext } from "../../context/TenantRequestContext";
import { AuthContext } from "../../context/AuthContext";
import { tenantApi } from "../../services/tenantAdminAPI";

const UsersList = () => {
  const {
    tenantUsers,
    tenantDetails,
    fetchTenantUsers,
    tenantId,
    loadingUsers,
    errorUsers,
  } = useContext(TenantRequestContext);
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [snack, setSnack] = useState({ open: false, type: "", msg: "" });
  const [tabValue, setTabValue] = useState("active");
  const [actionLoading, setActionLoading] = useState(false);

  // Confirm delete state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // View modal state
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (tenantId) fetchTenantUsers(tenantId);
  }, [tenantId]);

  const handleCloseSnack = () => setSnack({ open: false, type: "", msg: "" });

  // ✅ Deactivate → move to inactive
  const handleDeactivate = async (userId) => {
    if (!user?.token) return;
    try {
      setActionLoading(true);
      await tenantApi.deactivateUser(userId, user.token);
      setSnack({
        open: true,
        type: "success",
        msg: "User deactivated successfully!",
      });
      fetchTenantUsers(tenantId);
    } catch (err) {
      setSnack({
        open: true,
        type: "error",
        msg: err.message || "Failed to deactivate user",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Restore → move back to active
  const handleRestore = async (userId) => {
    if (!user?.token) return;
    try {
      setActionLoading(true);
      await tenantApi.activateUser(userId, user.token);
      setSnack({
        open: true,
        type: "success",
        msg: "User restored successfully!",
      });
      fetchTenantUsers(tenantId);
    } catch (err) {
      setSnack({
        open: true,
        type: "error",
        msg: err.message || "Failed to restore user",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Confirm delete
  const confirmDelete = (userId) => {
    setSelectedUserId(userId);
    setConfirmOpen(true);
  };

  // ✅ Actual delete
  const handleDelete = async () => {
    if (!user?.token || !selectedUserId) return;
    try {
      setActionLoading(true);
      await tenantApi.softDeleteUser(selectedUserId, user.token);
      setSnack({
        open: true,
        type: "success",
        msg: "User deleted successfully!",
      });
      fetchTenantUsers(tenantId);
    } catch (err) {
      setSnack({
        open: true,
        type: "error",
        msg: err.message || "Failed to delete user",
      });
    } finally {
      setActionLoading(false);
      setConfirmOpen(false);
      setSelectedUserId(null);
    }
  };

  // ✅ Filter users for each tab
  const filteredUsers = tenantUsers
    .filter((u) => {
      if (tabValue === "active") return u.is_active === true && !u.is_deleted;
      if (tabValue === "inactive") return u.is_active === false && !u.is_deleted;
      if (tabValue === "deleted") return u.is_deleted === true;
      return true;
    })
    .filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Box>
      {/* Header */}
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Users Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {tenantDetails ? `Tenant: ${tenantDetails.name}` : ""}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/tenant-admin/createuser")}
        >
          Add New User
        </Button>
      </Grid>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, newVal) => setTabValue(newVal)}
        sx={{ mb: 2 }}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Active Users" value="active" />
        <Tab label="Inactive Users" value="inactive" />
        <Tab label="Deleted Users" value="deleted" />
      </Tabs>

      {/* Search */}
      <TextField
        label="Search by name/email"
        fullWidth
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Loader / Error */}
      {loadingUsers ? (
        <Grid container justifyContent="center" sx={{ mt: 5 }}>
          <CircularProgress />
        </Grid>
      ) : errorUsers ? (
        <Typography color="error" textAlign="center" sx={{ mt: 5 }}>
          {errorUsers}
        </Typography>
      ) : (
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>{u.name || u.email.split("@")[0]}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              u.is_deleted
                                ? "Deleted"
                                : u.is_active
                                ? "Active"
                                : "Inactive"
                            }
                            color={
                              u.is_deleted
                                ? "default"
                                : u.is_active
                                ? "success"
                                : "error"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            {/* Active Users → Deactivate */}
                            {u.is_active && !u.is_deleted && (
                              <>
                                <Tooltip title="View User">
                                  <IconButton
                                    color="info"
                                    onClick={() => {
                                      setSelectedUser(u);
                                      setViewOpen(true);
                                    }}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Deactivate User">
                                  <IconButton
                                    color="warning"
                                    disabled={actionLoading}
                                    onClick={() => handleDeactivate(u.id)}
                                  >
                                    <BlockIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}

                            {/* Inactive Users → Restore or Delete */}
                            {!u.is_active && !u.is_deleted && (
                              <>
                                <Tooltip title="Restore User">
                                  <IconButton
                                    color="success"
                                    disabled={actionLoading}
                                    onClick={() => handleRestore(u.id)}
                                  >
                                    <RestoreIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete User">
                                  <IconButton
                                    color="error"
                                    disabled={actionLoading}
                                    onClick={() => confirmDelete(u.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}

                            {/* Deleted Users → Only View (no actions) */}
                            {u.is_deleted && (
                              <Tooltip title="View User">
                                <IconButton
                                  color="info"
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setViewOpen(true);
                                  }}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snack.type === "success" ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View User Modal */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent dividers>
          {selectedUser ? (
            <>
              <Typography><strong>Name:</strong> {selectedUser.name || "N/A"}</Typography>
              <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
              <Typography>
                <strong>Status:</strong>{" "}
                {selectedUser.is_deleted
                  ? "Deleted"
                  : selectedUser.is_active
                  ? "Active"
                  : "Inactive"}
              </Typography>
            </>
          ) : (
            <Typography>No user details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList;
