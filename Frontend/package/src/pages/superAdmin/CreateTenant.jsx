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
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { superAdmin } from "../../services/superAdminAPI";
import { useNavigate } from "react-router";

export const CreateTenant = () => {
  const [tenantName, setTenantName] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!tenantName || !tenantEmail) {
      toast.error("Please fill in all required fields", {
        duration: 4000,
        style: { fontSize: "16px" },
      });
      return;
    }

    try {
      setLoading(true);

      const res = await superAdmin.createTenant({ tenantName, email: tenantEmail });
      const data = res?.data ?? res;
      // Treat as success if message exists and doesn't contain "failed" or "error"
      const success =
        typeof data.message === "string" &&
        !/fail|error/i.test(data.message);

      const message =
        typeof data.message === "string"
          ? data.message
          : success
          ? "Tenant admin created successfully!"
          : "Failed to create tenant admin";

      if (success) {
        toast.success(message, {
          duration: 4000,
          style: { fontSize: "18px", fontWeight: "bold" },
        });

        // Clear form fields
        setTenantName("");
        setTenantEmail("");
      } else {
        throw new Error(message);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to create tenant admin",
        {
          duration: 4000,
          style: { fontSize: "16px", fontWeight: "bold" },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6, px: 2 }}>
      <Toaster position="top-center" reverseOrder={false} />
      <Card sx={{ width: "100%", maxWidth: 600, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Create a Tenant 
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tenant Name"
                variant="outlined"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tenant Email"
                type="email"
                variant="outlined"
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
              <Button
                variant="outlined"
                sx={{ mr: 2, borderRadius: 2 }}
                onClick={() => {
                  setTenantName("");
                  setTenantEmail("");
                  navigate("/dashboard");
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
    </Box>
  );
};
