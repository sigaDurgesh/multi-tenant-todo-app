import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  InputLabel,
} from "@mui/material";
import {
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { TenantRequestContext } from "../../context/TenantRequestContext";
import { format } from "date-fns";

const TenantAdminDashboard = () => {
  const {
    tenantUsers,
    userStats,
    fetchTenantUsers,
    tenantId,
    loadingUsers,
    errorUsers,
  } = useContext(TenantRequestContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const safeFormatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d) ? "-" : format(d, "MMM dd, yyyy HH:mm");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "warning";
      case "approved":
      case "active": return "success";
      case "rejected": return "error";
      default: return "default";
    }
  };


  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return <PendingIcon fontSize="small" />;
      case "approved":
      case "active": return <CheckCircleIcon fontSize="small" />;
      case "rejected": return <CancelIcon fontSize="small" />;
      default: return null;
    }
  };

const fetchUsers = useCallback(async () => {
  if (!tenantId) return;
  try {
    setRefreshing(true);
    await fetchTenantUsers(tenantId);
  } catch (err) {
    console.error("Error fetching tenant users:", err);
  } finally {
    setRefreshing(false);
  }
}, [tenantId, fetchTenantUsers]);

useEffect(() => {
  if (!tenantId) return;
  fetchUsers();
  const interval = setInterval(fetchUsers, 30000);
  return () => clearInterval(interval);
}, [tenantId, fetchUsers]);

  const filteredUsers = tenantUsers.filter(
    (user) =>
      (statusFilter === "all" || user.status?.toLowerCase() === statusFilter.toLowerCase()) &&
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // At the very top of your TenantAdminDashboard.js file
if (!sessionStorage.getItem("tenantAdminReloaded")) {
  sessionStorage.setItem("tenantAdminReloaded", "true");
  window.location.reload();
}



  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Tenant Admin Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Welcome back! Here’s a complete overview of your tenant.
      </Typography>

      {/* Loading/Error */}
      {loadingUsers && (
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <CircularProgress />
        </Grid>
      )}
      {errorUsers && (
        <Typography color="error" sx={{ mt: 3 }}>
          {errorUsers}
        </Typography>
      )}

      {/* Summary Cards */}
{!loadingUsers && !errorUsers && (
  <Grid container spacing={3} sx={{ mt: 2 }}>
    {[
      {
        title: "Total Users",
        value: userStats.totalUsers || 0,
        color: "primary",
      },
      {
        title: "Active Users",
        value: userStats.totalUsers || 0,
        color: "success",
      },
      // {
      //   title: "Pending Users",
      //   value: userStats.byStatus?.Pending || 0,
      //   color: "warning",
      // },
      // {
      //   title: "Rejected Users",
      //   value: userStats.byStatus?.Rejected || 0,
      //   color: "error",
      // },
      // {
      //   title: "Approved Users",
      //   value: userStats.byStatus?.Approved || 0,
      //   color: "success",
      // },
      {
        title: "Inactive Users",
        value: userStats.byStatus?.Inactive || 0,
        color: "default",
      },
    ].map((stat) => (
      <Grid item xs={12} sm={6} md={3} key={stat.title}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6">{stat.title}</Typography>
            <Typography
              variant="h4"
              color={stat.color === "default" ? "textSecondary" : stat.color}
            >
              {stat.value}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
)}


      {/* Filters */}
      {!loadingUsers && !errorUsers && (
        <Card sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Search Users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel >Status Filter</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Recent Requests */}
      {!loadingUsers && !errorUsers && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Users</Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={{ mr: 1, bgcolor: "primary.main" }}> {user.name?.charAt(0) || user.email.charAt(0)} </Avatar>
                          {user.name || user.email.split("@")[0]}
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip label={user.status?.toUpperCase() || "ACTIVE"} color={getStatusColor(user.status)} icon={getStatusIcon(user.status)} size="small" />
                      </TableCell>
                      <TableCell>{safeFormatDate(user.createdAt)}</TableCell>
                      <TableCell>{safeFormatDate(user.updatedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TenantAdminDashboard;
