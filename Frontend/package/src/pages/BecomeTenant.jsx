import React, { useState, useContext, useEffect } from "react";
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
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BecomeTenant = () => {
  const [tenantName, setTenantName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { user, tenantRequestId, setTenantRequestId } = useContext(AuthContext);
  const navigate = useNavigate();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        if (result?.data?.id) {
          setTenantRequestId(result.data.id);
        }
        setSubmitted(true);
        // ✅ Navigate after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(result.message || "Something went wrong");
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

              <TextField
                fullWidth
                label="Tenant Name"
                variant="outlined"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                error={!!error}
                helperText={error}
                InputProps={{
                  startAdornment: ( <BusinessIcon sx={{ mr: 1, color: "#5e35b1" }} /> ),
                }}
                sx={{ mb: 3 }}
              />

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
              <Typography sx={{ mt: 1, color: "gray" }}>
                Redirecting to homepage...
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default BecomeTenant;
