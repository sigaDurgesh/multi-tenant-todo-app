import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  Grid,
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { authApi } from "../services/api";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { style: { fontSize: "18px" } });
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError, { style: { fontSize: "18px" } });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const data = await authApi.changePassword(newPassword, token);

      // Clear sensitive data
      localStorage.clear();
      sessionStorage.clear();

      // Show success toast with bigger font
      toast.success(data.message || "Password updated successfully", {
        style: { fontSize: "15px", fontWeight: "bold" },
        duration: 2000,
      });

      // Navigate immediately
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.message || "Failed to update password", {
        style: { fontSize: "18px" },
      });
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
      <Toaster position="top-center" reverseOrder={false} />
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={5} lg={4}>
          <Card sx={{ p: 4, borderRadius: 3, boxShadow: 6 }}>
            <Typography variant="h4" textAlign="center" mb={3}>
              Change Password
            </Typography>

            <Box component="form" onSubmit={handleChangePassword}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 3 }}
                required
              />
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
