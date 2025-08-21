import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
} from "@mui/material";

export const CreateTenant = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 6,
        px: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 600, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          {/* Header */}
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Create Tenant
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Form */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tenant Name"
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tenant Email"
                type="email"
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                type="tel"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>

            {/* Buttons */}
            <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
              <Button
                variant="outlined"
                sx={{ mr: 2, borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: 2 }}
              >
                Create Tenant
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
