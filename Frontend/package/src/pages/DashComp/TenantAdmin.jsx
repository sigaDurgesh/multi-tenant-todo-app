import React, { useContext, useEffect, useState, useCallback } from "react";
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
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
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
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
      setRefreshing(false);
    } catch (err) {
      setRefreshing(false);
      setSnackbar({ open: true, message: "Failed to fetch users", severity: "error" });
    }
  }, [tenantId, fetchTenantUsers]);

  // useEffect(() => {
  //   fetchUsers();
  //   const interval = setInterval(fetchUsers, 30000); // Auto refresh every 30s
  //   return () => clearInterval(interval);
  // }, [fetchUsers]);

  const filteredUsers = tenantUsers.filter(
    (user) =>
      (statusFilter === "all" || user.status?.toLowerCase() === statusFilter.toLowerCase()) &&
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Tenant Admin Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Welcome back! Here’s a complete overview of your tenant.
      </Typography>

      {/* Loading/Error */}
      {(loadingUsers || refreshing) && (
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
            { title: "Total Users", value: userStats.totalUsers || 0, color: "primary" },
            { title: "Active Users", value: userStats.byStatus?.Active || 0, color: "success" },
            { title: "Pending Users", value: userStats.byStatus?.Pending || 0, color: "warning" },
            { title: "Rejected Users", value: userStats.byStatus?.Rejected || 0, color: "error" },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">{stat.title}</Typography>
                  <Typography variant="h4" color={stat.color}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Quick Actions */}
      {/* <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item>
              <Button variant="contained" color="primary" startIcon={<PersonAddIcon />}>Add User</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary" startIcon={<GroupIcon />}>Manage Users</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="success" startIcon={<AssessmentIcon />}>View Reports</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="warning" startIcon={<SettingsIcon />}>Tenant Settings</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="info" startIcon={<RefreshIcon />} onClick={fetchUsers}>Refresh</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card> */}

      {/* Filters */}
      {!loadingUsers && !errorUsers && (
        <Card sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField fullWidth size="small" label="Search Users" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              
              <FormControl fullWidth size="small">
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              
            </Grid>
                            <InputLabel style={{color:'orange'}}>Status Filter</InputLabel>

          </Grid>
        </Card>
      )}

      {/* Recent Requests */}
      {!loadingUsers && !errorUsers && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Tenant Requests</Typography>
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
                          <Avatar sx={{ mr: 1, bgcolor: "primary.main" }}>{user.name?.charAt(0) || user.email.charAt(0)}</Avatar>
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
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TenantAdminDashboard;
