import React, { useContext, useEffect } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TenantRequestContext } from "../../context/TenantRequestContext";

const UsersList = () => {
  const {
    tenantUsers,
    tenantDetails,
    userStats,
    fetchTenantUsers,
    tenantId,
    loadingUsers,
    errorUsers,
  } = useContext(TenantRequestContext);

  // ✅ Fetch tenant users on page load / tenantId change
  useEffect(() => {
    if (tenantId) fetchTenantUsers(tenantId);
  }, [tenantId]);

  // ----------------------------
  // Render Loading
  // ----------------------------
  if (loadingUsers) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 5 }}>
        <CircularProgress />
      </Grid>
    );
  }

  // ----------------------------
  // Render Error
  // ----------------------------
  if (errorUsers) {
    return (
      <Typography color="error" textAlign="center" sx={{ mt: 5 }}>
        {errorUsers}
      </Typography>
    );
  }

  return (
    <div>
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">
          Users Management {tenantDetails ? `- ${tenantDetails.name}` : ""}
          <Typography component="span" variant="subtitle2" sx={{ ml: 1, color: "text.secondary" }}>
            ({userStats.totalUsers || 0} users)
          </Typography>
        </Typography>
        <Button variant="contained" color="primary">
          Add New User
        </Button>
      </Grid>

      {/* Card Wrapper */}
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tenant Users
          </Typography>

          {/* Users Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenantUsers.length > 0 ? (
                  tenantUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name || user.email.split("@")[0]}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.Roles?.[0]?.name || "User"}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.status || "Active"}
                          color={(user.status || "Active") === "Active" ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersList;
