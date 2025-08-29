import React, { useState, useContext } from "react";
import { Grid, Box, Card, Typography, Stack, Button, Alert, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import PageContainer from "src/components/container/PageContainer";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
// import { AuthContext } from "../../context/AuthContext";

const RegisterUnderTenant = () => {
  // const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Formik + Yup validation
  const formik = useFormik({
    initialValues: { tenantName: "", email: "", password: "" },
    validationSchema: Yup.object({
      tenantName: Yup.string().required("Tenant Name is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setError(null);
      setSuccess(null);
      setLoading(true);

      try {
        const response = await fetch(
          "http://localhost:5000/tenant-requests/register-user",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Registration failed");
          setLoading(false);
          return;
        }

        // ✅ Success: set user context
        // setUser({
        //   name: data.username || values.email,
        //   role: data.role || "tenantUser",
        //   tenantName: values.tenantName,
        // });

        setSuccess("Registration successful! Redirecting to login...");
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
          p: 2,
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={6} lg={4}>
            <Card elevation={10} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
              <Typography variant="h4" fontWeight="700" textAlign="center" mb={2}>
                Register Under Tenant
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
                    type="password"
                    label="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                  />
                </Stack>

                {/* Buttons */}
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={() => navigate(-1)}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!formik.isValid || formik.isSubmitting || loading}
                    sx={{ py: 1.5, fontWeight: 600, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
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
                  sx={{ textDecoration: "none", fontWeight: 500 }}
                >
                  Login
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default RegisterUnderTenant;
