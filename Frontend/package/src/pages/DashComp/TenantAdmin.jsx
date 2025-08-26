import React from "react";
import { Box, Grid, Card, CardContent, Typography, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const TenantAdminDashboard = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Tenant Admin Dashboard</Typography>
      <Typography variant="body1" gutterBottom color="textSecondary">
        Welcome back! Here’s an overview of your tenant’s performance.
      </Typography>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {[
          { title: "Total Users", value: 48, color: "primary", desc: "Active in your tenant" },
          { title: "Pending Invitations", value: 5, color: "secondary", desc: "Users yet to accept" },
          { title: "Monthly Reports", value: 12, color: "success.main", desc: "Reports submitted this month" },
        ].map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{stat.title}</Typography>
                <Typography variant="h4" color={stat.color}>{stat.value}</Typography>
                <Typography variant="body2" color="textSecondary">{stat.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
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
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default TenantAdminDashboard;
