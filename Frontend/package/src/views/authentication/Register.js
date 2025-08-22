import React, {useState} from 'react';
import { Grid, Box, Card, Typography, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import PageContainer from 'src/components/container/PageContainer';
import AuthRegister from './auth/AuthRegister';
import {AuthContext}  from "../../context/AuthContext";
import { useContext } from 'react';

const Register2 = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // default
  });

  // 🔄 Update form state when AuthRegister inputs change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔑 Call API
  const handleRegister = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error("Signup failed");
        return;
      }

      const data = await response.json();

      // Store user in context
      setUser({
        name: data.username || formData.username,
        role: data.role || formData.role,
      });

      // Navigate based on role
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ✅ Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(formData);
  };

  return (
    <PageContainer title="Register" description="this is Register page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          alignItems="center"
          size={{
            xs: 12,
            sm: 12,
            lg: 4,
            xl: 3
          }}>
          <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
           <AuthRegister
  onSubmit={handleRegister}
  subtext={
    <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
      Your Social Campaigns
    </Typography>
  }
  subtitle={
    <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
      <Typography color="textSecondary" variant="h6" fontWeight="400">
        Already have an Account?
      </Typography>
      <Typography
        component={Link}
        to="/login"
        fontWeight="500"
        sx={{ textDecoration: "none", color: "primary.main" }}
      >
        Sign In
      </Typography>
    </Stack>
  }
/>
            </Card>
          </Grid>
        
      </Box>
      
    </PageContainer>
  );
};

export default Register2;
