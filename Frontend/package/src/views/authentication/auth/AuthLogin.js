import React, { useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";

const AuthLogin = ({ onLogin, subtext }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(credentials);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {/* email */}
        <TextField
          label="email"
          name="email"
          variant="outlined"
          fullWidth
          value={credentials.email}
          onChange={handleChange}
        />

        {/* Password */}
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          value={credentials.password}
          onChange={handleChange}
        />

        {/* Login button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          type="submit"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Login
        </Button>
      </Stack>

      {/* Subtext */}
      {subtext && (
        <Box mt={2} textAlign="center">
          {subtext}
        </Box>
      )}
    </Box>
  );
};

export default AuthLogin;
