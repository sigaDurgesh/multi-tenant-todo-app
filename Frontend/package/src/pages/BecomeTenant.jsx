import React, { useState, useContext } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Stack,
    InputAdornment,
  IconButton
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import InfoIcon from "@mui/icons-material/Info";
import { TenantRequestContext } from "../context/TenantRequestContext";
import { useNavigate } from "react-router-dom";

import { Visibility, VisibilityOff } from "@mui/icons-material";


const BecomeTenant = () => {
  const navigate = useNavigate();
  const { setTenantRequestId } = useContext(TenantRequestContext);

  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  

  const handleSubmit = async () => {
    if (!tenantName.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const payload = { tenantName, email, password };
      const res = await fetch("http://localhost:5000/tenant-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (res.ok && result?.data?.id) {
        setTenantRequestId(result.data.id);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubmitted(true);
      } else {
        setError(result.message || "Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        py: 8,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f6f9ff 0%, #eef1ff 100%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="stretch">
          {/* Left: Form */}
          <Grid item xs={12} md={6} display="flex">
            <Paper
              elevation={6}
              sx={{
                p: 5,
                borderRadius: 4,
                textAlign: "center",
                background: "rgba(255,255,255,0.95)",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {!submitted ? (
                <>
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3, alignSelf: "flex-start" }}
                  >
                    Back
                  </Button>

                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, mb: 4, color: "#1a237e" }}
                  >
                    Tenant Request
                  </Typography>

                  <Typography sx={{ mb: 3, color: "#555" }}>
                    Fill out the form to submit your tenant request. Our Super
                    Admin will review it shortly.
                  </Typography>

                  <TextField
                    fullWidth
                    label="Tenant Name"
                    variant="outlined"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    error={!!error && !tenantName.trim()}
                    helperText={
                      !!error && !tenantName.trim() ? error : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <BusinessIcon sx={{ mr: 1, color: "#5e35b1" }} />
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!error && !email.trim()}
                    helperText={!!error && !email.trim() ? error : ""}
                    InputProps={{
                      startAdornment: (
                        <EmailIcon sx={{ mr: 1, color: "#5e35b1" }} />
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error && !password.trim()}
                    helperText={!!error && !password.trim() ? error : ""}
                    InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                              {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                          </InputAdornment>
                                        ),
                                      }}
                    sx={{ mb: 4 }}
                  />

                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    endIcon={
                      loading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <CheckCircleIcon />
                      )
                    }
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: 3,
                    }}
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </Button>

                  {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {error}
                    </Typography>
                  )}
                </>
              ) : (
                <Stack alignItems="center" spacing={2}>
                  <CheckCircleIcon
                    sx={{ fontSize: 80, color: "limegreen" }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#1a237e" }}
                  >
                    Your request has been sent!
                  </Typography>
                  <Typography sx={{ color: "#333" }}>
                    Thank you! We will review your request and get back to you
                    soon.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/")}
                    sx={{
                      mt: 3,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    OK
                  </Button>
                </Stack>
              )}
            </Paper>
          </Grid>

          {/* Right: Product Info */}
          <Grid item xs={12} md={6} display="flex">
            <Box
              sx={{
                p: 5,
                background:
                  "linear-gradient(135deg, #e0f7fa 0%, #e1bee7 100%)",
                borderRadius: 4,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 3, color: "#4a148c" }}
              >
                Why Choose Our Product?
              </Typography>
              <Stack spacing={3} sx={{ color: "#333" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InfoIcon sx={{ mr: 2, color: "#4a148c" }} />
                  <Typography>
                    Secure and reliable multi-tenant system.
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InfoIcon sx={{ mr: 2, color: "#4a148c" }} />
                  <Typography>
                    Easy management of tenants and requests.
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InfoIcon sx={{ mr: 2, color: "#4a148c" }} />
                  <Typography>
                    24/7 support and quick approval process.
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InfoIcon sx={{ mr: 2, color: "#4a148c" }} />
                  <Typography>
                    Intuitive interface designed for super admins.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BecomeTenant;
