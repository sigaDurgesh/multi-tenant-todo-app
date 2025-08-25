import React, { useState, useContext } from "react";
import { Grid, Box, Card, Typography, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "src/components/container/PageContainer";
import AuthRegister from "./auth/AuthRegister";
import { AuthContext } from "../../context/AuthContext";

const Register2 = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // default
  });

  // 🔄 Handle input changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔑 API call
  const handleRegister = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.message || "Signup failed");
        return;
      }

      const data = await response.json();

      // Store user context (optional at register stage)
      setUser({
        name: data.username || formData.username,
        role: data.role || formData.role,
      });

      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <PageContainer title="Register" description="This is Register page">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "linear-gradient(135deg, #e0f7fa 0%, #fce4ec 100%)",
          p: 2,
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={6} lg={4} xl={3} w={3}>
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
              <AuthRegister
                onSubmit={handleRegister}
                subtext={
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    color="textSecondary"
                    mb={1}
                  >
                    Create your account to get started 🚀
                  </Typography>
                }
                subtitle={
                  <Stack
                    direction="row"
                    justifyContent="center"
                    spacing={1}
                    mt={3}
                  >
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      fontWeight="400"
                    >
                      Already have an account?
                    </Typography>
                    <Typography
                      component={Link}
                      to="/login"
                      fontWeight="500"
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                      }}
                    >
                      Sign In
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

export default Register2;
