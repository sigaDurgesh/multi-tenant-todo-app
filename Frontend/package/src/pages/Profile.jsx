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
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  // For dialog/form state
  const [openDialog, setOpenDialog] = useState(false);
  const [tenantRequest, setTenantRequest] = useState({
    tenantName: "",
    description: "",
  });

  const profileData = {
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    phone: user?.phone || "+1 987 654 3210",
    role: user?.role || "user",
    tenant: user?.tenant || "N/A",
    joined: "Jan 12, 2023",
    status: "Active",
  };

  const handleSubmitRequest = async () => {
    console.log("Tenant Request Submitted:", tenantRequest);

    // 🚀 Example: send request to backend
    // await fetch("/api/tenant-requests", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     userId: user.id,
    //     ...tenantRequest,
    //   }),
    // });

    setOpenDialog(false);
    setTenantRequest({ tenantName: "", description: "" });
    alert("Request sent to Super Admin!");
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

            {user.role !== "super_admin" && (
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
      {user.role === "superAdmin" && (
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

      {user.role === "tenantAdmin" && (
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

      {user.role === "user" && (
        <>
          <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You can view your tasks, update your profile, and adjust personal settings.
              </Typography>

              {/* Become Tenant Button */}
              <Button
                variant="contained"
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => setOpenDialog(true)}
              >
                Become a Tenant
              </Button>
            </CardContent>
          </Card>

          {/* Tenant Request Dialog */}
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Request to Become a Tenant</DialogTitle>
            <DialogContent dividers>
              <TextField
                margin="normal"
                label="Tenant Name"
                fullWidth
                value={tenantRequest.tenantName}
                onChange={(e) =>
                  setTenantRequest({ ...tenantRequest, tenantName: e.target.value })
                }
              />
              <TextField
                margin="normal"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={tenantRequest.description}
                onChange={(e) =>
                  setTenantRequest({ ...tenantRequest, description: e.target.value })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmitRequest}>
                Submit Request
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Profile;
