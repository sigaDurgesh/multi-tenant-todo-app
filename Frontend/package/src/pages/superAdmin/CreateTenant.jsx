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
  CircularProgress,
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

      const res = await superAdmin.createTenant({
        tenantName,
        email: tenantEmail,
      });
      const data = res?.data ?? res;

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

        setTenantName("");
        setTenantEmail("");
      } else {
        throw new Error(message);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to create tenant admin",
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 8,
        px: 2,
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <Card
        sx={{
          width: "100%",
          maxWidth: 600,
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            py: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Create a New Tenant
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Set up a new organization in just a few clicks
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tenant Name"
                placeholder="e.g. Acme Corp"
                variant="outlined"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                required
                InputProps={{ sx: { borderRadius: 2 } }}
                helperText="This will be the organization’s display name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tenant Admin Email"
                type="email"
                placeholder="e.g. admin@acme.com"
                variant="outlined"
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.target.value)}
                required
                InputProps={{ sx: { borderRadius: 2 } }}
                helperText="Primary email for the tenant admin"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                sx={{ borderRadius: 2 }}
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
                sx={{
                  borderRadius: 2,
                  px: 3,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Create Tenant"
                )}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
