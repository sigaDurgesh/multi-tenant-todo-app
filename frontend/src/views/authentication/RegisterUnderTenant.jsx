import React, { useState } from "react";
import {
  Grid,
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PageContainer from "src/components/container/PageContainer";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import registerimage from "../../assets/registerimage.jpg"; 

const RegisterUnderTenant = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Formik + Yup validation
  const formik = useFormik({
    initialValues: { tenantName: "", email: "", password: "" },
    validationSchema: Yup.object({
      tenantName: Yup.string().required("Tenant Name is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .matches(/[!@#$%^&*(),.?\":{}|<>]/, "Must contain one special character")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setError(null);
      setSuccess(null);
      setLoading(true);

      try {
        const response = await fetch("http://localhost:5000/tenant-requests/register-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Registration failed");
          setLoading(false);
          return;
        }

        setSuccess("🎉 Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        console.error("Error:", err);
        setError("Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Register Under Tenant" description="Tenant user registration">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0f7fa 0%, #fce4ec 100%)",
          p: 3,
        }}
      >
        <Card
          elevation={10}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: 4,
            overflow: "hidden",
            maxWidth: 950,
            width: "100%",
          }}
        >
          {/* Left side - Form */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 3, sm: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "white",
            }}
          >
            <Typography variant="h4" fontWeight="700" textAlign="center" mb={2}>
              Register Under Tenant
            </Typography>
            <Typography variant="body2" textAlign="center" mb={3} color="text.secondary">
              Create your account under the tenant workspace
            </Typography>

            {/* Alerts */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {/* Form */}
            <Box component="form" noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={2} mb={3}>
                <CustomTextField
                  id="tenantName"
                  name="tenantName"
                  label="Tenant Name"
                  value={formik.values.tenantName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tenantName && Boolean(formik.errors.tenantName)}
                  helperText={formik.touched.tenantName && formik.errors.tenantName}
                />
                <CustomTextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <CustomTextField
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
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
              </Stack>

              {/* Buttons */}
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate(-1)}
                  sx={{ py: 1.4, fontWeight: 600 }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!formik.isValid || formik.isSubmitting || loading}
                  sx={{
                    py: 1.4,
                    fontWeight: 600,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Register"}
                </Button>
              </Stack>
            </Box>

            {/* Login link */}
            <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
              <Typography color="textSecondary" variant="body2">
                Already have an account?
              </Typography>
              <Typography
                component={Link}
                to="/login"
                color="primary"
                sx={{ textDecoration: "none", fontWeight: 600 }}
              >
                Login
              </Typography>
            </Stack>
          </Box>

          {/* Right side - Illustration */}
         <Box
  sx={{
    flex: 1,
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    p: 0, // remove padding so image fills container
    height: "65vh", // or parent container height
    width: "100%",
    position: "relative",
    overflow: "hidden",
  }}
>
  <Box
    component="img"
    src={registerimage}
    alt="Register Illustration"
    loading="lazy" // fast loading
    sx={{ width: "100%", height: "65vh", objectFit: "cover" }}
  />
</Box>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default RegisterUnderTenant;
