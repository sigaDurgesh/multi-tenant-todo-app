// import React, { useContext, useState } from "react";
// import {
//   Grid,
//   Box,
//   Card,
//   Typography,
//   Button,
//   Alert,
//   Stack,
//   CircularProgress,
// } from "@mui/material";
// import { useNavigate, Link } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { AuthContext } from "../../context/AuthContext";
// import { authApi } from "../../services/api";
// import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

// // Validation Schema
// const validationSchema = Yup.object({
//   tenantName: Yup.string(),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
// });

// const Login = () => {
//   const { login } = useContext(AuthContext);
//     const { setUser } = useContext(AuthContext);
  

//   const navigate = useNavigate();

//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState(null);

//   const formik = useFormik({
//     initialValues: {
//       tenantName: "",
//       email: "",
//       password: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values, { setSubmitting }) => {
//       setError(null);
//       setMessage(null);

//       try {
//         const { token, user } = await authApi.login(values);

//         const role = Array.isArray(user.roles) ? user.roles[0] : user.role;

//         // Require tenantName for tenantAdmin
//         if (!values.tenantName && role === "tenantAdmin") {
//           setError("Please enter tenant name");
//           setSubmitting(false);
//           return;
//         }

//         // Save token & context
//         localStorage.setItem("token", token);
//         login({ ...user, token, role });

//         // Save tenantId if tenantAdmin
//         if (role === "tenantAdmin") {
//           localStorage.setItem("tenantId", user.tenant_id);
//         }

//         setMessage("Login successful!");

//         // Redirect based on role
//         if (role === "superAdmin" || role === "tenantAdmin") {
//           navigate("/dashboard");
//         } else {
//           navigate("/user/todos");
//         }
//       } catch (err) {
//         setError(err.message || "Login failed");
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
//         p: 2,
//       }}
//     >
//       <Grid container justifyContent="center">
//         <Grid item xs={12} sm={8} md={5} lg={4}>
//           <Card sx={{ p: 4, borderRadius: 3, boxShadow: 6 }}>
//             <Typography variant="h4" textAlign="center" mb={3}>
//               Welcome Back
//             </Typography>

//             {message && (
//               <Alert severity="success" sx={{ mb: 2 }}>
//                 {message}
//               </Alert>
//             )}
//             {error && (
//               <Alert severity="error" sx={{ mb: 2 }}>
//                 {error}
//               </Alert>
//             )}

//             <Box component="form" noValidate onSubmit={formik.handleSubmit}>
//               {/* Tenant Name */}
//               <Box mb={2}>
//                 <Typography
//                   variant="subtitle1"
//                   fontWeight={600}
//                   component="label"
//                   htmlFor="tenantName"
//                   mb="5px"
//                 >
//                   Tenant Name
//                 </Typography>
//                 <CustomTextField
//                   id="tenantName"
//                   name="tenantName"
//                   variant="outlined"
//                   fullWidth
//                   value={formik.values.tenantName}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.tenantName &&
//                     Boolean(formik.errors.tenantName)
//                   }
//                   helperText={
//                     formik.touched.tenantName && formik.errors.tenantName
//                   }
//                 />
//               </Box>

//               {/* Email */}
//               <Box mb={2}>
//                 <Typography
//                   variant="subtitle1"
//                   fontWeight={600}
//                   component="label"
//                   htmlFor="email"
//                   mb="5px"
//                 >
//                   Email
//                 </Typography>
//                 <CustomTextField
//                   id="email"
//                   name="email"
//                   type="email"
//                   variant="outlined"
//                   fullWidth
//                   value={formik.values.email}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.email && Boolean(formik.errors.email)}
//                   helperText={formik.touched.email && formik.errors.email}
//                 />
//               </Box>

//               {/* Password */}
//               <Box mb={3}>
//                 <Typography
//                   variant="subtitle1"
//                   fontWeight={600}
//                   component="label"
//                   htmlFor="password"
//                   mb="5px"
//                 >
//                   Password
//                 </Typography>
//                 <CustomTextField
//                   id="password"
//                   name="password"
//                   type="password"
//                   variant="outlined"
//                   fullWidth
//                   value={formik.values.password}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.password && Boolean(formik.errors.password)
//                   }
//                   helperText={formik.touched.password && formik.errors.password}
//                 />
//               </Box>

//               {/* Submit & Back Buttons */}
//               <Stack direction="row" spacing={2} justifyContent="space-between">
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   fullWidth
//                   onClick={() => navigate("/")}
//                   sx={{ py: 1.5, fontWeight: 600 }}
//                 >
//                   Back
//                 </Button>

//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   disabled={!formik.isValid || formik.isSubmitting}
//                   sx={{
//                     py: 1.5,
//                     fontWeight: 600,
//                     background:
//                       "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                   }}
//                 >
//                   {formik.isSubmitting ? (
//                     <CircularProgress size={24} sx={{ color: "white" }} />
//                   ) : (
//                     "Login"
//                   )}
//                 </Button>
//               </Stack>

//               {/* Links */}
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 mt={4}
//                 fontFamily="Roboto, sans-serif"
//                 gap={3}
//               >
//                 <Typography
//                   variant="body2"
//                   color="primary"
//                   sx={{ cursor: "pointer", textDecoration: "none" }}
//                   onClick={() => navigate("/change-pass")}
//                   fontSize={14}
//                 >
//                   Change Password
//                 </Typography>

//                 <Typography
//                   variant="body2"
//                   color="primary"
//                   fontSize={14}
//                   sx={{ cursor: "pointer", textDecoration: "none" }}
//                   onClick={() => navigate("/register-under-tenant")}
//                 >
//                   Register Under Tenant
//                 </Typography>

//                 {/* <Typography
//                   variant="body2"
//                   component={Link}
//                   to="/register"
//                   color="primary"
//                   sx={{ textDecoration: "none" }}
//                 >
//                   Create an Account
//                 </Typography> */}
//                 <Typography
//                   variant="body2"
//                   component={Link}
//                   to="/becometenant"
//                   color="primary"
//                   fontSize={14}
//                   sx={{ textDecoration: "none" }}
//                 >
//                   Become a Tenant
//                 </Typography>
//               </Stack>
//             </Box>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Login;
  


import React, { useContext, useState } from "react";
import {
  Grid,
  Box,
  Card,
  Typography,
  Button,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { authApi } from "../../services/api";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

// Validation Schema
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

  const formik = useFormik({
    initialValues: {
      tenantName: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      setMessage(null);

      try {
        const { token, user } = await authApi.login(values);

        const role = Array.isArray(user.roles) ? user.roles[0] : user.role;

        // Require tenantName for tenantAdmin
        if (!values.tenantName && role === "tenantAdmin") {
          setError("Please enter tenant name");
          setSubmitting(false);
          return;
        }

        // Save token in localStorage
        localStorage.setItem("token", token);

        // Save tenantId if tenantAdmin
        if (role === "tenantAdmin") {
          localStorage.setItem("tenantId", user.tenant_id);
        }

        // Store user in context using setUser
        const userData = { ...user, token, role };
        setUser(userData);
        login(userData); // optional, if you have login() method to handle state globally

        setMessage("Login successful!");

        // Redirect based on role
        if (role === "superAdmin" || role === "tenantAdmin") {
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
                  error={
                    formik.touched.tenantName &&
                    Boolean(formik.errors.tenantName)
                  }
                  helperText={
                    formik.touched.tenantName && formik.errors.tenantName
                  }
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

              {/* Submit & Back Buttons */}
              <Stack direction="row" spacing={2} justifyContent="space-between">
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
                  color="primary"
                  fullWidth
                  disabled={!formik.isValid || formik.isSubmitting}
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                mt={4}
                fontFamily="Roboto, sans-serif"
                gap={3}
              >
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer", textDecoration: "none" }}
                  onClick={() => navigate("/change-pass")}
                  fontSize={14}
                >
                  Change Password
                </Typography>

                <Typography
                  variant="body2"
                  color="primary"
                  fontSize={14}
                  sx={{ cursor: "pointer", textDecoration: "none" }}
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
