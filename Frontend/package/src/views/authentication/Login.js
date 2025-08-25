import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { jwtDecode } from "jwt-decode";


// components
import PageContainer from 'src/components/container/PageContainer';
// import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from './auth/AuthLogin';
import { AuthContext } from '../../context/AuthContext';


const Login2 = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 const handleLogin = async (credentials) => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.status === 200) {
      const { token, user } = data;

      // build new user object with token
      const newUser = {
        ...user,
        token, // keep JWT for API calls
      };

      setUser(newUser);
      // navigate by role
      const role = user.roles[0];
      if (role === "superAdmin") {
        navigate("/superAdmin/tenants");
      } else if (role === "tenantAdmin") {
        navigate("/tenant-admin/users");
      } else {
        navigate("/user/todos");
      }
    } else {
      alert(data.message || "Invalid username or password");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please try again.");
  } finally {
    setLoading(false);
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
          <Grid item xs={12} sm={10} md={6} lg={4} xl={3}>
            <Card elevation={9} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, width: '100%', maxWidth: '500px', mx: 'auto', }} >
              {/* <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box> */}
              <AuthLogin
                onSubmit={handleLogin}
                subtext={
                  <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                    Your Social Campaigns
                  </Typography>
                }
                subtitle={
                  <Stack direction="row" spacing={1} justifyContent="center" mt={3} flexWrap="wrap">
                    <Typography color="textSecondary" variant="h6" fontWeight="500">
                      New to Modernize?
                    </Typography>
                    <Typography
                      component={Link}
                      to="/register"
                      fontWeight="500"
                      sx={{ textDecoration: 'none', color: 'primary.main' }}
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
