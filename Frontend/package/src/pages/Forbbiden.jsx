// src/pages/Forbidden.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Forbidden = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "linear-gradient(135deg, #f8f9fa, #e0e7ff)",
        p: 3,
      }}
    >
      {/* Big 403 Number */}
      <Typography
        variant="h1"
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "6rem", md: "8rem" },
          color: "error.main",
          lineHeight: 1,
        }}
      >
        403
      </Typography>

      {/* Error Title */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        Access Denied
      </Typography>

      {/* Message */}
      <Typography variant="body1" sx={{ mb: 3, maxWidth: "500px" }}>
        Sorry, you don’t have permission to view this page.  
        Please contact your administrator if you think this is a mistake.
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dashboard"
        >
          Go to Dashboard
        </Button> */}
        <Button
          variant="outlined"
          color="error"
          component={Link}
          to="/login"
        >
          Login Again
        </Button>
      </Box>

      {/* Decorative Illustration */}
      <Box
        sx={{
          mt: 5,
          fontSize: "5rem",
          opacity: 0.2,
        }}
      >
        🚫
      </Box>
    </Box>
  );
};

export default Forbidden;
