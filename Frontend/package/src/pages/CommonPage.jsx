import React from "react";
import { Box, Typography, Button, Container, Stack, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CommonPage = () => {
  const navigate = useNavigate();

  const handleBecomeTenant = () => {
    navigate("/becomeTenant"); // 👈 route to your BecomeTenant.jsx
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 🔘 Button at the top */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", // change to "flex-start" if you want left side
          p: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleBecomeTenant}
          sx={{ borderRadius: "20px", fontWeight: "bold" }}
        >
          Become a Tenant
        </Button>
      </Box>

      {/* 📦 Main Content */}
      <Container maxWidth="md" sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
        <Card
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            width: "100%",
          }}
        >
          <Typography variant="h3" fontWeight="700" gutterBottom>
            Welcome to Multi-Tenant App
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            This is a common page accessible to everyone.  
            Here you can showcase information about your platform, key features, or instructions.
          </Typography>

          <Stack spacing={2} mt={4}>
            <Typography variant="body1">
              ✅ Manage tenants and users in one platform
            </Typography>
            <Typography variant="body1">
              ✅ Role-based dashboards for Super Admin, Tenant Admin, and Users
            </Typography>
            <Typography variant="body1">
              ✅ Secure authentication and authorization
            </Typography>
            <Typography variant="body1">
              ✅ Create and manage todos easily
            </Typography>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
};

export default CommonPage;
