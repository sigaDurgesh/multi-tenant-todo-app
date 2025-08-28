import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

export const CreateTenant = () => {
  const [tenantName, setTenantName] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

  

 

  const handleSubmit = async () => {
    if (!tenantName || !tenantEmail) {
      setSnackbar({ open: true, message: "Please fill in all required fields", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/create-tenant-admin", {
        name: tenantName,
        email: tenantEmail,
      });

      if (res.status === 201 || res.status === 200) {
        setSnackbar({
          open: true,
          message: "Tenant admin created successfully! Credentials sent via email.",
          type: "success",
        });
        setTenantName("");
        setTenantEmail("");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to create tenant admin",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6, px: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 600, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          {/* Header */}
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Create Tenant Admin
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Form */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tenant Name"
                variant="outlined"
                required
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tenant Email"
                type="email"
                variant="outlined"
                required
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.target.value)}
              />
            </Grid>


            {/* Buttons */}
            <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
              <Button
                variant="outlined"
                sx={{ mr: 2, borderRadius: 2 }}
                onClick={() => {
                  setTenantName("");
                  setTenantEmail("");
                  setPassword("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: 2 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Tenant"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};
