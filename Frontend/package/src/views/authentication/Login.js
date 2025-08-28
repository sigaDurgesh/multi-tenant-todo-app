import React, { useContext, useState } from "react";
import {
  Grid,
  Box,
  Card,
  Typography,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { authApi } from "../../services/api";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

// Base validation schema (email + password)
const baseValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [tenantId, setTenantId] = useState(() => {
    try {
      return localStorage.getItem("tenantId") || null;
    } catch {
      return null;
    }
  });

  const formik = useFormik({
    initialValues: { tenantName: "", email: "", password: "" },
    validationSchema: baseValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      setMessage(null);

      try {
        const { token, user } = await authApi.login(values); // Backend returns role

        // Determine role
        const role = Array.isArray(user.roles) ? user.roles[0] : user.role;

        // ✅ Conditional validation
        if (!values.tenantName && role !== "superAdmin") {
          // tenantName empty and not superAdmin → block login
          setError("Please enter tenant name");
          setSubmitting(false);
          return;
        }

        // ✅ Save token
        localStorage.setItem("token", token);

        // ✅ Login context
        login({ ...user, token, role });

        // ✅ Store tenantId if tenantAdmin
        if (role === "tenantAdmin") {
          setTenantId(user.tenant_id);
          localStorage.setItem("tenantId", user.tenant_id);
        }

        setMessage("Login successful!");

        // ✅ Navigate based on role
        if (role === "superAdmin" || role === "tenantAdmin") {
          setTenantId(user.tenant_id); // store in context
          localStorage.setItem("tenantId", user.tenant_id); // persist
          navigate("/dashboard");
        } else {
          navigate("/user/todos");
        }
      } catch (err) {
        setError(err.message || "Login failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

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
              Welcome Back
            </Typography>

            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" noValidate onSubmit={formik.handleSubmit}>
              {/* Tenant Name */}
              <Box mb={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  htmlFor="tenantName"
                  mb="5px"
                >
                  Tenant Name
                </Typography>
                <CustomTextField
                  id="tenantName"
                  name="tenantName"
                  variant="outlined"
                  fullWidth
                  value={formik.values.tenantName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Box>

              {/* Email */}
              <Box mb={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  htmlFor="email"
                  mb="5px"
                >
                  Email
                </Typography>
                <CustomTextField
                  id="email"
                  name="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Box>

              {/* Password */}
              <Box mb={3}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  htmlFor="password"
                  mb="5px"
                >
                  Password
                </Typography>
                <CustomTextField
                  id="password"
                  name="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Box>

              {/* Submit */}
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {formik.isSubmitting ? "Logging in..." : "Login"}
              </Button>

              {/* Links */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate("/change-pass")}
                >
                  Change Password
                </Typography>
                <Typography
                  variant="body2"
                  component={Link}
                  to="/register"
                  color="primary"
                  sx={{ textDecoration: "none" }}
                >
                  Create an Account
                </Typography>
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
