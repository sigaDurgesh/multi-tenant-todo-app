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
  IconButton,
  InputAdornment,
  LinearProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authApi } from "../services/api";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password validation rules
  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Must contain at least 1 uppercase letter";
    if (!/[a-z]/.test(password)) return "Must contain at least 1 lowercase letter";
    if (!/[0-9]/.test(password)) return "Must contain at least 1 number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Must contain at least 1 special character";
    return null;
  };

  // Password strength indicator
  const getStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    return score;
  };

  const strength = getStrength(newPassword);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { style: { fontSize: "16px" } });
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError, { style: { fontSize: "16px" } });
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const data = await authApi.changePassword(newPassword, token);

      // Clear sensitive data
      sessionStorage.clear();
      sessionStorage.clear();

      toast.success(data.message || "Password updated successfully", {
        style: { fontSize: "15px", fontWeight: "bold" },
        duration: 2500,
      });

      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      toast.error(err.message || "Failed to update password", {
        style: { fontSize: "16px" },
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
          <Card sx={{ p: 4, borderRadius: 4, boxShadow: 8 }}>
            <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
              🔒 Change Password
            </Typography>

            <Box component="form" onSubmit={handleChangePassword}>
              {/* New Password */}
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Strength Meter */}
              {newPassword && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(strength / 4) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: "#eee",
                      "& .MuiLinearProgress-bar": {
                        background:
                          strength < 2
                            ? "#e53935"
                            : strength < 3
                            ? "#ffb300"
                            : "#43a047",
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {strength < 2
                      ? "Weak"
                      : strength < 3
                      ? "Medium"
                      : "Strong"} Password
                  </Typography>
                </Box>
              )}

              {/* Confirm Password */}
              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
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
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Change Password"
                )}
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
