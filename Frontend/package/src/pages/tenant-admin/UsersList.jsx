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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Stack,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TenantRequestContext } from "../../context/TenantRequestContext";
import { tenantApi } from "../../services/tenantAdminAPI"; // 👈 import api

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

  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newTenantId, setNewTenantId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({ open: false, type: "", msg: "" });

  useEffect(() => {
    if (tenantId) {
      fetchTenantUsers(tenantId);
      setNewTenantId(tenantId); // auto-fill tenantId
    }
  }, [tenantId]);

  const validate = () => {
    let temp = {};
    if (!newTenantId.trim()) temp.tenantId = "Tenant ID is required";
    if (!newEmail.trim()) temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(newEmail)) temp.email = "Enter a valid email";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleAddUser = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await tenantApi.addTenantUser(newTenantId, newEmail);

      setSnack({
        open: true,
        type: "success",
        msg: result.message || "User invited successfully",
      });

      setNewEmail("");
      setOpen(false);
      fetchTenantUsers(newTenantId); // refresh list
    } catch (err) {
      console.error("Add user error:", err);

      // Handle duplicate user error specifically
      if (err.message?.toLowerCase().includes("exists")) {
        setErrors({ email: "This user already exists in tenant. Try another email." });
      }

      setSnack({
        open: true,
        type: "error",
        msg: err.message || "Failed to add user",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnack = () => setSnack({ open: false, type: "", msg: "" });

  if (loadingUsers) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 5 }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (errorUsers) {
    return (
      <Typography color="error" textAlign="center" sx={{ mt: 5 }}>
        {errorUsers}
      </Typography>
    );
  }

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">
          Users Management {tenantDetails ? `- ${tenantDetails.name}` : ""}
          <Typography component="span" variant="subtitle2" sx={{ ml: 1, color: "text.secondary" }}>
            ({userStats.totalUsers || 0} users)
          </Typography>
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add New User
        </Button>
      </Grid>

      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tenant Users
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Email</TableCell>
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

      {/* Add User Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite New User</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Tenant ID"
              fullWidth
              value={newTenantId}
              onChange={(e) => setNewTenantId(e.target.value)}
              error={!!errors.tenantId}
              helperText={errors.tenantId}
              disabled={!!tenantId}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            
            <FormHelperText>Select the role for this user in tenant</FormHelperText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddUser}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
};

export default UsersList;
