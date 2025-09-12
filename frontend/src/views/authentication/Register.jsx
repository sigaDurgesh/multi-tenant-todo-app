// src/views/authentication/Register.jsx
import React, { useState, useContext } from "react";
import { Grid, Box, Card, Typography, Stack, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import PageContainer from "src/components/container/PageContainer";
import CustomTextField from "src/components/forms/theme-elements/CustomTextField";
import { AuthContext } from "src/context/AuthContext";

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setError(null);
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const err = await response.json();
          setError(err.message || "Registration failed");
          setLoading(false);
          return;
        }

        const data = await response.json();

        setUser({
          name: data.username || values.name,
          role: data.role || "user",
        });

        navigate("/login");
      } catch (err) {
        console.error(err);
        setError("Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Register" description="Create an account page">
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
            <Card
              elevation={10}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                width: "100%",
                maxWidth: "500px",
                mx: "auto",
              }}
            >
              <Typography
                variant="h4"
                fontWeight="700"
                textAlign="center"
                mb={2}
              >
                Create Account
              </Typography>

              {error && (
                <Typography color="error" textAlign="center" mb={2}>
                  {error}
                </Typography>
              )}

              <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={2} mb={3}>
                  <CustomTextField
                    id="name"
                    name="name"
                    label="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
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
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={formik.touched.password && formik.errors.password}
                  />
                </Stack>

                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!formik.isValid || formik.isSubmitting || loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </Box>

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
                  Sign In
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Register;
