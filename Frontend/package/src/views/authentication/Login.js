import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Card,
  Stack,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import PageContainer from "src/components/container/PageContainer";
import AuthLogin from "./auth/AuthLogin";
import { AuthContext } from "../../context/AuthContext";

const Login2 = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔑 Handle login success (mock auth)
  const handleLogin = (credentials) => {
    const { username, password } = credentials;

    if (username === "super" && password === "123") {
      setUser({ name: "Super Admin", role: "super-admin" });
      navigate("/superAdmin/tenants");
    } else if (username === "tenant" && password === "123") {
      setUser({ name: "Tenant Admin", role: "tenant-admin" });
      navigate("/tenant-admin/users");
    } else if (username === "user" && password === "123") {
      setUser({ name: "Regular User", role: "user" });
      navigate("/user/todos");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: "relative",
          background:
            "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Card
          elevation={12}
          sx={{
            p: 5,
            width: "100%",
            maxWidth: 480,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Welcome Back 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please sign in to continue
            </Typography>
          </Box>

          {/* Auth Form */}
          <AuthLogin
            onLogin={handleLogin}
            subtext={
              <Typography
                variant="subtitle2"
                textAlign="center"
                color="textSecondary"
                mb={1}
              >
                Access your dashboard
              </Typography>
            }
          />

          {/* Divider */}
          <Divider sx={{ my: 3 }}>OR</Divider>

          {/* Social Login Buttons (optional) */}
          <Stack spacing={2} mb={2}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ textTransform: "none" }}
            >
              Continue with Google
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ textTransform: "none" }}
            >
              Continue with GitHub
            </Button>
          </Stack>

          {/* Footer */}
          <Stack direction="row" spacing={1} justifyContent="center">
            <Typography color="textSecondary" variant="body2">
              New to Modernize?
            </Typography>
            <Typography
              component={Link}
              to="/register"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              Create an account
            </Typography>
          </Stack>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default Login2;
