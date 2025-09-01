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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage your account information, preferences, and tenant requests.
      </Typography>

      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

      {/* Profile Card */}
      <Card sx={{ borderRadius: 3, boxShadow: 4, mt: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Left Column - Avatar & Basic Info */}
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Avatar sx={{ width: 100, height: 100, bgcolor: "primary.main", fontSize: 36 }}>
                {profileData.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" mt={2}>{profileData.name}</Typography>
              <Typography variant="body2" color="text.secondary">{profileData.email}</Typography>
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
            </Grid>

            {/* Right Column - Detailed Info & Actions */}
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
                    <Button variant="outlined" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveProfile}>Save</Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack spacing={1}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{profileData.phone}</Typography>
                    </Grid>
                    {user.role !== "superAdmin" && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Tenant</Typography>
                        <Typography variant="body1">{profileData.tenant}</Typography>
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Joined</Typography>
                      <Typography variant="body1">{profileData.joined}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <Chip
                        label={profileData.status}
                        color={profileData.status === "Active" ? "success" : "default"}
                        size="small"
                      />
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                    <Button variant="outlined" onClick={() => setEditMode(true)}>Edit Profile</Button>
                    <Button variant="outlined" onClick={() => navigate("/change-pass")}>Change Password</Button>
                    {user.role === "user" && (
                      <Button variant="contained" onClick={() => setOpenDialog(true)}>Request Tenant Access</Button>
                    )}
                  </Stack>
                </Stack>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Role-specific Cards */}
      {user.role === "superAdmin" && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Super Admin Privileges</Typography>
            <Typography variant="body2" color="text.secondary">
              Full control over all tenants, users, and system-wide settings.
            </Typography>
          </CardContent>
        </Card>
      )}
      {user.role === "tenantAdmin" && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Tenant Admin Information</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage users, assign roles, and configure settings for your tenant.
            </Typography>
          </CardContent>
        </Card>
      )}
      {user.role === "user" && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>User Information</Typography>
            <Typography variant="body2" color="text.secondary">
              View your tasks, update profile, and request to become a tenant.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Tenant Request Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Tenant Access</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Tenant Name"
              fullWidth
              value={tenantRequest.tenantName}
              onChange={(e) => setTenantRequest({ ...tenantRequest, tenantName: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={tenantRequest.description}
              onChange={(e) => setTenantRequest({ ...tenantRequest, description: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitRequest}>Submit Request</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
