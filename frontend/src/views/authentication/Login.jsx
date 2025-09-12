import React, { useContext, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Alert,
  Stack,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { AuthContext } from "../../context/AuthContext";
import { authApi } from "../../services/api";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import loginimage from "../../assets/loginimage.jpg"; 

const validationSchema = Yup.object({
  tenantName: Yup.string(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const { login, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  

  const formik = useFormik({
    initialValues: { tenantName: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      setMessage(null);
      try {
        const { token, user } = await authApi.login(values);
        const role = Array.isArray(user.roles) ? user.roles[0] : user.role;

        if (!values.tenantName && role === "tenantAdmin") {
          setError("Please enter tenant name");
          setSubmitting(false);
          return;
        }

        sessionStorage.setItem("token", token);
        if (role === "tenantAdmin") sessionStorage.setItem("tenantId", user.tenant_id);

        setUser({ ...user, token, role });
        login({ ...user, token, role });

        setMessage("Login successful!");
        navigate(
          role === "superAdmin" || role === "tenantAdmin"
            ? "/dashboard"
            : "/user/todos"
        );
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
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 1000,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          minHeight: "600px",
        }}
      >
        <Grid container sx={{ minHeight: "600px" }}>
          {/* Left Column: Form */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 3, md: 5 },
              backgroundColor: "#fff",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 400 }}>
              <Typography
                variant="h4"
                textAlign="center"
                mb={3}
                fontWeight={700}
                color="primary"
              >
                Login to Your Account
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
                    variant="subtitle2"
                    fontWeight={600}
                    mb="5px"
                    color="textSecondary"
                  >
                    Tenant Name
                  </Typography>
                  <CustomTextField
                    fullWidth
                    id="tenantName"
                    name="tenantName"
                    value={formik.values.tenantName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.tenantName && Boolean(formik.errors.tenantName)
                    }
                    helperText={
                      formik.touched.tenantName && formik.errors.tenantName
                    }
                  />
                </Box>

                {/* Email */}
                <Box mb={2}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    mb="5px"
                    color="textSecondary"
                  >
                    Email
                  </Typography>
                  <CustomTextField
                    fullWidth
                    id="email"
                    name="email"
                    type="email"
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
                    variant="subtitle2"
                    fontWeight={600}
                    mb="5px"
                    color="textSecondary"
                  >
                    Password
                  </Typography>
                  <CustomTextField
                    fullWidth
                    id="password"
                    name="password"
                    
                  type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
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
                </Box>

                {/* Buttons */}
                <Stack direction="row" spacing={2} mb={3}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={() => navigate("/")}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!formik.isValid || formik.isSubmitting}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    {formik.isSubmitting ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Stack>

                {/* Links */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={2}
                >
                  {/* <Typography
                    variant="body2"
                    color="primary"
                    fontSize={14}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/change-pass")}
                  >
                    Change Password
                  </Typography> */}
                  <Typography
                    variant="body2"
                    color="primary"
                    fontSize={14}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/register-under-tenant")}
                  >
                    Register Under Tenant
                  </Typography>
                  <Typography
                    variant="body2"
                    component={Link}
                    to="/becometenant"
                    color="primary"
                    fontSize={14}
                    sx={{ textDecoration: "none" }}
                  >
                    Become a Tenant
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Image */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <img
  src={loginimage}
  alt="Login Illustration"
  loading="lazy"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
/>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Login;
