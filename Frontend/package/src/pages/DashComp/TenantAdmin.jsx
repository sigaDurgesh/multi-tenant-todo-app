import React, { useContext, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

import { TenantRequestContext } from "../../context/TenantRequestContext";

const TenantAdminDashboard = () => {
  const {
    tenantUsers,
    userStats,
    fetchTenantUsers,
    tenantId,
    loadingUsers,
    errorUsers,
  } = useContext(TenantRequestContext);

  // ✅ Fetch tenant users when tenantId changes
  useEffect(() => {
    if (tenantId) fetchTenantUsers(tenantId);
  }, [tenantId]);

  // ----------------------------
  // Helper functions
  // ----------------------------
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
      case "active":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <PendingIcon fontSize="small" />;
      case "approved":
      case "active":
        return <CheckCircleIcon fontSize="small" />;
      case "rejected":
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // ----------------------------
  // Dummy Recent Requests
  // (replace with API if available)
  // ----------------------------
  const recentRequests = tenantUsers.slice(0, 5).map((user, index) => ({
    id: index + 1,
    name: user.name || user.email.split("@")[0],
    email: user.email,
    status: user.status || "Active",
    created_at: user.createdAt?.split("T")[0] || "2025-01-01",
  }));

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Tenant Admin Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Welcome back! Here’s an overview of your tenant.
      </Typography>

      {/* ---------------- Loading / Error States ---------------- */}
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

      {/* ---------------- Summary Stats ---------------- */}
      {!loadingUsers && !errorUsers && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            {
              title: "Total Users",
              value: userStats.totalUsers,
              color: "primary",
              desc: "All users in this tenant",
            },
            {
              title: "Active Users",
              value: userStats.byStatus?.Active || 0,
              color: "success",
              desc: "Users with active status",
            },
            {
              title: "Pending Users",
              value: userStats.byStatus?.Pending || 0,
              color: "warning",
              desc: "Users waiting for approval",
            },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={4} key={stat.title}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">{stat.title}</Typography>
                  <Typography variant="h4" color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stat.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ---------------- Quick Actions ---------------- */}
      <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
              >
                Add User
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<GroupIcon />}
              >
                Manage Users
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="success"
                startIcon={<AssessmentIcon />}
              >
                View Reports
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<SettingsIcon />}
              >
                Tenant Settings
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ---------------- Recent Tenant Requests ---------------- */}
      {!loadingUsers && !errorUsers && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Tenant Requests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={{ mr: 1, bgcolor: "primary.main" }}>
                            {request.name.charAt(0)}
                          </Avatar>
                          {request.name}
                        </Box>
                      </TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={request.status.toUpperCase()}
                          color={getStatusColor(request.status)}
                          icon={getStatusIcon(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{request.created_at}</TableCell>
                      <TableCell>
                        {request.status.toLowerCase() === "pending" && (
                          <>
                            <Tooltip title="Approve">
                              <Button size="small" color="success">
                                Approve
                              </Button>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <Button size="small" color="error">
                                Reject
                              </Button>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TenantAdminDashboard;
