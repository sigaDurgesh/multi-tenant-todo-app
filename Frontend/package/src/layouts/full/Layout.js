// src/layouts/full/Layout.js
import React, { useContext, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./sidebar/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Layout = () => {
  const {user , setUser ,openLogoutDialog} = useContext(AuthContext);
  const role = typeof user.role === "string" ? user.role : user.role?.takerole || "user";

  const navigate = useNavigate();

  // Sidebar toggle state (for mobile)
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // User menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);


  // Notifications dropdown
  const [notifAnchor, setNotifAnchor] = useState(null);
  const openNotif = Boolean(notifAnchor);
  const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  const notifications = [
    { id: 1, message: "New tenant registered: Acme Corp" },
    { id: 2, message: "Your password will expire in 7 days" },
    { id: 3, message: "New feature deployed 🎉" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Desktop Sidebar */}
      <Sidebar takerole={user.role} />

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 240 },
        }}
      >
        <Sidebar takerole={role} />
      </Drawer>
      {/* Main content area */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Top AppBar */}
        <AppBar
          position="sticky"
          elevation={1}
          sx={{
            backgroundColor: "#fff",
            color: "text.primary",
            borderBottom: "1px solid #eee",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Left side */}
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                color="primary"
                edge="start"
                sx={{ display: { md: "none" } }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" fontWeight="bold">
                Multi-Tenant App
              </Typography>
            </Box>

            {/* Right side */}
            <Box display="flex" alignItems="center" gap={2}>
              {/* <IconButton onClick={handleNotifOpen}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
              <Menu
                anchorEl={notifAnchor}
                open={openNotif}
                onClose={handleNotifClose}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ px: 2, pt: 1, fontWeight: "bold" }}
                >
                  Notifications
                </Typography>
                <Divider />
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <MenuItem key={n.id} onClick={handleNotifClose}>
                      {n.message}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No notifications</MenuItem>
                )}
              </Menu>

              <IconButton onClick={handleMenuOpen}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {role.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem disabled>Role: {user.role}</MenuItem>
                <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                <MenuItem onClick={() => navigate("/change-pass")}>
                  Change password
                </MenuItem>
                <MenuItem onClick={openLogoutDialog}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
          
        </AppBar>

        <Box sx={{ p: 3, minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
          <Outlet /> 
        </Box>
        
      </Box>
      
    </Box>
  );
};

export default Layout;
