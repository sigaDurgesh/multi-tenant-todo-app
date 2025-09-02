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
  const [successMsg, setSuccessMsg] = useState(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    phone: user?.phone || "+1 987 654 3210",
    role: user?.role || "user",
    tenant: user?.tenant || "N/A",
    joined: "Sep 2, 2025",
    status: "Active",
  });

  const handleSaveProfile = () => {
    setSuccessMsg("Profile updated successfully!");
    setEditMode(false);
  };

  const handleSubmitRequest = () => {
    alert("Request sent to Super Admin!");
    setTenantRequest({ tenantName: "", description: "" });
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage your account details, preferences, and tenant requests.
      </Typography>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      {/* Profile Card */}
      <Card sx={{ borderRadius: 3, boxShadow: 6, mt: 3 }}>
        <CardContent>
          <Grid container spacing={4}>
            {/* Left - Avatar & Basic Info */}
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Avatar sx={{ width: 120, height: 120, bgcolor: "primary.main", fontSize: 40 }}>
                {profileData.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" mt={2}>
                {profileData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileData.email}
              </Typography>
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
                sx={{ mt: 1, px: 1.5, py: 0.5 }}
              />
            </Grid>

            {/* Right - Details & Actions */}
            <Grid item xs={12} md={8}>
              {editMode ? (
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                  <TextField
                    label="Phone"
                    fullWidth
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSaveProfile}>
                      Save
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">{profileData.phone}</Typography>
                    </Grid>
                    {user.role !== "superAdmin" && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tenant
                        </Typography>
                        <Typography variant="body1">{profileData.tenant}</Typography>
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Joined
                      </Typography>
                      <Typography variant="body1">{profileData.joined}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={profileData.status}
                        color={profileData.status === "Active" ? "success" : "default"}
                        size="small"
                      />
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
                    <Button variant="outlined" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/change-pass")}>
                      Change Password
                    </Button>
                    
                  </Stack>
                </Stack>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Role-specific Info Cards */}
      <Stack spacing={2} mt={3}>
        {user.role === "superAdmin" && (
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Super Admin Privileges
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Full control over all tenants, users, and system-wide settings.
              </Typography>
            </CardContent>
          </Card>
        )}
        {user.role === "tenantAdmin" && (
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tenant Admin Info
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage users, assign roles, and configure settings for your tenant.
              </Typography>
            </CardContent>
          </Card>
        )}
        {user.role === "user" && (
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your tasks, update profile, and request to become a tenant.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Stack>

      
    </Box>
  );
};

export default Profile;
