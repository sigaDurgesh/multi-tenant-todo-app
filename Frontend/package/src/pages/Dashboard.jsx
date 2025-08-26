import AssessmentIcon from "@mui/icons-material/Assessment";
import React, { useContext } from "react";
import {useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,Grid,
  Typography, Card,
  CardContent,
  Button,
  Divider,
  Box
} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AuthContext } from "../context/AuthContext";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";



const CommonDashboard = () => {

    // Mock activity data (replace with API data)
  const activityData = [
    { month: "Jan", users: 30 },
    { month: "Feb", users: 35 },
    { month: "Mar", users: 40 },
    { month: "Apr", users: 45 },
    { month: "May", users: 48 },
  ];

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  // 🔑 Handlers for each action
  const handleCreateTenant = () => {
    navigate("/superAdmin/create"); // page where super admin creates a tenant
  };

  const handleManageTenants = () => {
    navigate("/superAdmin/tenants"); // tenant list page
  };

  const handleViewReports = () => {
    navigate("/reports"); // reports dashboard
  };

  const handleSystemSettings = () => {
    navigate("/settings"); // system-wide settings page
  };


  if (user.role === "superAdmin") {
    return (
       <div>
         
    <Box>
      {/* Header */}
      <Typography variant="h5" gutterBottom>
        Super Admin Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom color="textSecondary">
        Welcome back! Here’s a quick overview of the system.
      </Typography>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Tenants</Typography>
              <Typography variant="h4" color="primary">
                15
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Across the system
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" color="secondary">
                480
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Across all tenants
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Active Tenants</Typography>
              <Typography variant="h4" color="success.main">
                12
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Currently subscribed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Inactive Tenants</Typography>
              <Typography variant="h4" color="error">
                3
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Suspended / expired
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

     <Grid item xs={12} sx={{ mt: 3 }}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
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
                startIcon={<AddBusinessIcon />}
                onClick={handleCreateTenant}
              >
                Create Tenant
              </Button>
            </Grid>

            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<PeopleIcon />}
                onClick={handleManageTenants}
              >
                Manage Tenants
              </Button>
            </Grid>

            {/* <Grid item>
              <Button
                variant="outlined"
                color="success"
                startIcon={<AssessmentIcon />}
                onClick={handleViewReports}
              >
                View Reports
              </Button>
            </Grid> */}

            {/* <Grid item>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<SettingsIcon />}
                onClick={handleSystemSettings}
              >
                System Settings
              </Button>
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>
    </Grid>

      {/* System Health */}
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color="success.main">
              ✅ All systems operational
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last checked: 2 mins ago
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Activity</TableCell>
                    <TableCell>Tenant</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <CheckCircleIcon color="success" fontSize="small" /> New
                      Tenant Created
                    </TableCell>
                    <TableCell>Acme Corp</TableCell>
                    <TableCell>Super Admin</TableCell>
                    <TableCell>2 mins ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <CheckCircleIcon color="warning" fontSize="small" /> User
                      Suspended
                    </TableCell>
                    <TableCell>Globex Ltd</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>10 mins ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <CheckCircleIcon color="info" fontSize="small" /> Report
                      Generated
                    </TableCell>
                    <TableCell>Initech</TableCell>
                    <TableCell>System</TableCell>
                    <TableCell>30 mins ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Box>
       </div>
    );
  }

  if (user.role === "tenantAdmin") {
    return (
       <div>
        <Box>
      {/* Header */}
      <Typography variant="h5" gutterBottom>
        Tenant Admin Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom color="textSecondary">
        Welcome back! Here’s an overview of your tenant’s performance.
      </Typography>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" color="primary">
                48
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Active in your tenant
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Pending Invitations</Typography>
              <Typography variant="h4" color="secondary">
                5
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Users yet to accept
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Monthly Reports</Typography>
              <Typography variant="h4" color="success.main">
                12
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Reports submitted this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="contained" color="primary" startIcon={<PersonAddIcon />}>
                  Add User
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="secondary" startIcon={<GroupIcon />}>
                  Manage Users
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="success" startIcon={<AssessmentIcon />}>
                  View Reports
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="warning" startIcon={<SettingsIcon />}>
                  Tenant Settings
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      

      {/* Recent Activity */}
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Activity</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <CheckCircleIcon color="success" fontSize="small" /> New User Invited
                    </TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>5 mins ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <CheckCircleIcon color="warning" fontSize="small" /> Role Updated
                    </TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>20 mins ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <CheckCircleIcon color="info" fontSize="small" /> Report Submitted
                    </TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>1 hr ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Tenant System Status */}
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tenant System Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color="success.main">
              ✅ Tenant services operational
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last checked: 3 mins ago
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Box>
       </div>
    );
  }

  if (user.role === "user") {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        My Tasks
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Priority</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Update profile information</TableCell>
              <TableCell align="right">Pending</TableCell>
              <TableCell align="right">High</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Review tenant guidelines</TableCell>
              <TableCell align="right">In Progress</TableCell>
              <TableCell align="right">Medium</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Submit monthly report</TableCell>
              <TableCell align="right">Completed</TableCell>
              <TableCell align="right">Low</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}


  // Default fallback
  return (
    <Typography variant="h6" color="textSecondary">
      No dashboard available for this role.
    </Typography>
  );
};

export default CommonDashboard;
