import React from 'react';
import { Link } from 'react-router';
import { Grid, Box, Card, Stack, Typography } from '@mui/material';

// components
import PageContainer from 'src/components/container/PageContainer';
// import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from './auth/AuthLogin';


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
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            size={{
              xs: 12,
              sm: 12,
              lg: 4,
              xl: 3
            }}>
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
              {/* <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box> */}
              <AuthLogin
                subtext={
                  <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                    Your Social Campaigns
                  </Typography>
                }
                subtitle={
                  <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                    <Typography color="textSecondary" variant="h6" fontWeight="500">
                      New to Modernize?
                    </Typography>
                    <Typography
                      component={Link}
                      to="/register"
                      fontWeight="500"
                      sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                      }}
                    >
                      Create an account
                    </Typography>
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>

      </Box>
    </PageContainer>
  );
};

export default Login2;
