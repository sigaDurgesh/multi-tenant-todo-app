import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  Button,
  Chip,
} from "@mui/material";

const Profile = ({ takerole }) => {
  // Dummy profile data (replace later with API)
  const profileData = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 987 654 3210",
    role: takerole || "user",
    tenant: "Acme Corp",
    joined: "Jan 12, 2023",
    status: "Active",
  };

  return (
    <div>
      {/* Page Header */}
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Manage your account information and preferences
      </Typography>

      {/* Profile Card */}
      <Card sx={{ borderRadius: 2, boxShadow: 3, mt: 2 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            {/* Avatar + Basic Info */}
            <Grid item>
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: 28 }}
              >
                {profileData.name.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h6">{profileData.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {profileData.email}
              </Typography>
              <Chip
                label={profileData.role.toUpperCase()}
                color={
                  profileData.role === "super_admin"
                    ? "error"
                    : profileData.role === "tenant_admin"
                    ? "secondary"
                    : "primary"
                }
                size="small"
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary">
                Edit Profile
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Profile Details */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Phone
              </Typography>
              <Typography variant="body1">{profileData.phone}</Typography>
            </Grid>

            {takerole !== "super_admin" && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Tenant
                </Typography>
                <Typography variant="body1">{profileData.tenant}</Typography>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Joined
              </Typography>
              <Typography variant="body1">{profileData.joined}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              <Chip
                label={profileData.status}
                color={profileData.status === "Active" ? "success" : "default"}
                size="small"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Role-specific content */}
      {takerole === "super_admin" && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Super Admin Privileges
            </Typography>
            <Typography variant="body2" color="textSecondary">
              You have full control over all tenants, users, and system-wide settings.
            </Typography>
          </CardContent>
        </Card>
      )}

      {takerole === "tenant_admin" && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tenant Admin Information
            </Typography>
            <Typography variant="body2" color="textSecondary">
              You can manage users, assign roles, and configure settings for your tenant.
            </Typography>
          </CardContent>
        </Card>
      )}

      {takerole === "user" && (
        <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <Typography variant="body2" color="textSecondary">
              You can view your tasks, update your profile, and adjust personal settings.
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
    