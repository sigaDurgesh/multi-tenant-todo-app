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

} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TenantRequestContext } from "../../context/TenantRequestContext";
import { Box } from "@mui/system";
import { useNavigate } from "react-router";

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
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({ open: false, type: "", msg: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (tenantId) {
      fetchTenantUsers(tenantId);
      setNewTenantId(tenantId);
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

  const handleCloseSnack = () => setSnack({ open: false, type: "", msg: "" });

  const getStatusColor = (status) => {
    switch ((status || "Active").toLowerCase()) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "blocked":
        return "error";
      default:
        return "default";
    }
  };

  const filteredUsers = tenantUsers.filter(
    (u) =>
      (statusFilter === "all" ||
        u.status?.toLowerCase() === statusFilter.toLowerCase()) &&
      (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      {/* Header + Stats */}
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
            {tenantDetails ? `Tenant: ${tenantDetails.name}` : ""} | Total
            Users: <strong>{userStats.totalUsers || 0}</strong>
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

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Search by name/email"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        {/* <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status Filter</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>
        </Grid> */}
      </Grid>

      {/* Loading/Error */}
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
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Tenant Users
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.name || user.email.split("@")[0]}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.status || "Active"}
                            color={getStatusColor(user.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <Tooltip title="Edit User">
                              <IconButton color="primary">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
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
    </Box>
  );
};

export default UsersList;
