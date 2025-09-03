import React, { useContext, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  FormHelperText,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import TenantRequestContext from "../../context/TenantRequestContext";

// Mock API for demo purposes, replace with your real API
const tenantApi = {
  addTenantUser: async (tenantId, email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "exists@example.com") {
          reject(new Error("User already exists"));
        } else {
          resolve({ message: "User invited successfully" });
        }
      }, 1000);
    });
  },
};

const CreateUser = () => {
    const {tenantId} = useContext(TenantRequestContext);

  const [newTenantId, setNewTenantId] = useState(tenantId);
  const [newEmail, setNewEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, type: "success", msg: "" });

  console.log("Tenant id",tenantId) 
  const validate = () => {
    const tempErrors = {};
    if (!newTenantId) tempErrors.tenantId = "Tenant ID is required";
    if (!newEmail) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(newEmail)) tempErrors.email = "Email is invalid";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddUser = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await tenantApi.addTenantUser(newTenantId, newEmail);
      setSnack({ open: true, type: "success", msg: result.message || "User invited successfully" });
      setNewEmail("");
      // fetchTenantUsers(newTenantId); // Uncomment if you want to refresh the user list
    } catch (err) {
      console.error("Add user error:", err);
      if (err.message?.toLowerCase().includes("exists")) {
        setErrors({ email: "This user already exists in tenant." });
      }
      setSnack({ open: true, type: "error", msg: err.message || "Failed to add user" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4, boxShadow: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Add New User
        </Typography>

        <Stack spacing={3}>
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
          <FormHelperText>New user will be added under this Tenant.</FormHelperText>

          <Button
            variant="contained"
            onClick={handleAddUser}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Add User"}
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.type} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateUser;
