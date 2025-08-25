import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";

// ✅ Example AuthContext (adjust path as per your project)
import { AuthContext } from "../context/AuthContext";

const BecomeTenant = () => {
  const { user } = useContext(AuthContext); // { id, email, name, roles, ... }
  const [tenantName, setTenantName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!tenantName.trim()) {
      setError("Tenant name is required");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      user_id: user.id,
      tenant_name: tenantName,
      email: user.email,
    };

    try {
      const res = await fetch("http://localhost:5000/tenant-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errData = await res.json();
        setError(errData.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting tenant request:", err);
      setError("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        py: 10,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f6f9ff 0%, #eef1ff 100%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 4,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {!submitted ? (
            <>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: "#1a237e" }}>
                Tenant Request
              </Typography>

              {/* Tenant Name */}
              <TextField
                fullWidth
                label="Tenant Name"
                variant="outlined"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                error={!!error}
                helperText={error}
                InputProps={{
                  startAdornment: <BusinessIcon sx={{ mr: 1, color: "#5e35b1" }} />,
                }}
                sx={{ mb: 3 }}
              />

              {/* Email (readonly from auth) */}
              <TextField
                fullWidth
                label="Email"
                value={user.email}
                InputProps={{
                  readOnly: true,
                  startAdornment: <EmailIcon sx={{ mr: 1, color: "#5e35b1" }} />,
                }}
                sx={{ mb: 3 }}
              />

              {/* Submit */}
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  borderRadius: 3,
                }}
              >
                Submit
              </Button>
            </>
          ) : (
            <Box>
              <CheckCircleIcon sx={{ fontSize: 80, color: "limegreen", mb: 3 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a237e" }}>
                Tenant Request Submitted!
              </Typography>
              <Typography sx={{ mt: 2, color: "#333" }}>
                Thank you {user.name}, we’ll review your request and get back to you soon.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default BecomeTenant;
