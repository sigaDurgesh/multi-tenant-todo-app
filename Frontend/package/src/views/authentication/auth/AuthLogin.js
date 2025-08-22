import React from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";

// ✅ Validation Schema
const validationSchema = Yup.object({
   email: Yup.string()
  .email("Invalid email format")
  .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AuthLogin = ({ title, subtitle, subtext , onSubmit}) => {
  const formik = useFormik({
    initialValues: { email: "", password: "", remember: true },
    validationSchema,
    onSubmit: (values) => {
      if (onSubmit) {
        onSubmit(values); // 🔥 call parent’s handleLogin
      }
    },
  });

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}
      {subtext}

      <Box component="form" noValidate onSubmit={formik.handleSubmit}>
        <Stack>
          {/* Username */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="username"
              mb="5px"
            >
              Email
            </Typography>
            <CustomTextField
              id="username"
              name="email"
              variant="outlined"
              fullWidth
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </Box>

          {/* Password */}
          <Box mt="25px">
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
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Box>

          {/* Remember Me + Forgot Password */}
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    checked={formik.values.remember}
                    onChange={formik.handleChange}
                  />
                }
                label="Remember this device"
              />
            </FormGroup>
            <Typography
              component={Link}
              to="/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              Forgot Password?
            </Typography>
          </Stack>
        </Stack>

        {/* Submit Button */}
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Login
          </Button>
        </Box>
      </Box>

      {subtitle}
    </>

  );
};

export default AuthLogin;
