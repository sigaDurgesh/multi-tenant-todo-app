import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import { authApi } from "../services/api";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // -----------------------------
  // Validate password strength
  // -----------------------------
  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const data = await authApi.changePassword(newPassword, token);
      setMessage(data.message || "Password updated successfully");

      // Clear fields
      setNewPassword("");
      setConfirmPassword("");

      // Redirect after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
        p: 2,
      }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={5} lg={4}>
          <Card sx={{ p: 4, borderRadius: 3, boxShadow: 6 }}>
            <Typography variant="h4" textAlign="center" mb={3}>
              Change Password
            </Typography>

            {/* Success Message */}
            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleChangePassword}>
              {/* New Password */}
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
                required
              />

              {/* Confirm Password */}
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 3 }}
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Change Password"}
              </Button>

              {/* Back to Login */}
              <Stack direction="row" justifyContent="center" mt={3}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Typography>
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChangePassword;
