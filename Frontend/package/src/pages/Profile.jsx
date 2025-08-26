import React, { useContext, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
  Box,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [tenantRequest, setTenantRequest] = useState({ tenantName: "", description: "" });
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    phone: user?.phone || "+1 987 654 3210",
    role: user?.role || "user",
    tenant: user?.tenant || "N/A",
    joined: "Jan 12, 2023",
    status: "Active",
  });
  const [successMsg, setSuccessMsg] = useState(null);

  // Update profile info locally (replace with API call)
  const handleSaveProfile = () => {
    // TODO: Send updated profile to backend
    setSuccessMsg("Profile updated successfully!");
    setEditMode(false);
  };

  // Submit tenant request (user role only)
  const handleSubmitRequest = () => {
    // TODO: Send tenant request to backend
    alert("Request sent to Super Admin!");
    setTenantRequest({ tenantName: "", description: "" });
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Manage your account information, preferences, and tenant requests
      </Typography>

      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

      {/* Profile Card */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, mt: 2 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: 28 }}>
                {profileData.name.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              {editMode ? (
                <>
                  <TextField
                    label="Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    fullWidth
                  />
                </>
              ) : (
                <>
                  <Typography variant="h6">{profileData.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{profileData.email}</Typography>
                  <Chip
                    label={profileData.role.toUpperCase()}
                    color={
                      profileData.role === "superAdmin"
                        ? "error"
                        : profileData.role === "tenantAdmin"
                        ? "secondary"
                        : "primary"
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </>
              )}
            </Grid>
            <Grid item>
              {editMode ? (
                <Stack spacing={1}>
                  <Button variant="contained" size="small" onClick={handleSaveProfile}>Save</Button>
                  <Button variant="outlined" size="small" onClick={() => setEditMode(false)}>Cancel</Button>
                </Stack>
              ) : (
                <Stack spacing={1}>
                  <Button variant="outlined" size="small" onClick={() => setEditMode(true)}>Edit Profile</Button>
                  <Button variant="outlined" size="small" onClick={() => navigate("/change-pass")}>Change Password</Button>
                </Stack>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Profile Details */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
              <Typography variant="body1">{profileData.phone}</Typography>
            </Grid>
            {user.role !== "superAdmin" && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Tenant</Typography>
                <Typography variant="body1">{profileData.tenant}</Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">Joined</Typography>
              <Typography variant="body1">{profileData.joined}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">Status</Typography>
              <Chip
                label={profileData.status}
                color={profileData.status === "Active" ? "success" : "default"}
                size="small"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Role-specific Cards */}
      {user.role === "superAdmin" && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Super Admin Privileges</Typography>
            <Typography variant="body2" color="textSecondary">
              You have full control over all tenants, users, and system-wide settings.
            </Typography>
          </CardContent>
        </Card>
      )}
      {user.role === "tenantAdmin" && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Tenant Admin Information</Typography>
            <Typography variant="body2" color="textSecondary">
              You can manage users, assign roles, and configure settings for your tenant.
            </Typography>
          </CardContent>
        </Card>
      )}
      {user.role === "user" && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>User Information</Typography>
            <Typography variant="body2" color="textSecondary">
              You can view your tasks, update your profile, and request to become a tenant.
            </Typography>
            
          </CardContent>
        </Card>
      )}

      {/* Tenant Request Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Request Tenant Access</DialogTitle>
        <DialogContent>
          <TextField
            label="Tenant Name"
            fullWidth
            sx={{ mb: 2 }}
            value={tenantRequest.tenantName}
            onChange={(e) => setTenantRequest({ ...tenantRequest, tenantName: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={tenantRequest.description}
            onChange={(e) => setTenantRequest({ ...tenantRequest, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitRequest}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
