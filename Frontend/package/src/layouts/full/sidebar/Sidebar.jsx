import React, { useContext, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Switch,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import TenantRequestContext from "../../../context/TenantRequestContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { requestCounts, userStats } = useContext(TenantRequestContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Role-based menu config
  const menuItems = {
    superAdmin: [
      {
        section: "Main",
        items: [
          { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
          { text: "Tenants", icon: <ApartmentIcon />, path: "/superAdmin/tenants" },
          { text: "Create Tenant", icon: <AddBusinessIcon />, path: "/superAdmin/create" },
          {
            text: "Tenant Requests",
            icon: <NoteAddIcon />,
            path: "/superAdmin/tenantrequest",
            badge: requestCounts.totalPending,
          },
        ],
      },
      {
        section: "Account",
        items: [{ text: "Profile", icon: <PersonIcon />, path: "/profile" }],
      },
    ],
    tenantAdmin: [
      {
        section: "Main",
        items: [
          { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
          {
            text: "Users",
            icon: <PeopleIcon />,
            path: "/tenant-admin/users",
            badge: userStats.totalUsers,
          },
        ],
      },
      {
        section: "Account",
        items: [{ text: "Profile", icon: <PersonIcon />, path: "/profile" }],
      },
    ],
    user: [
      {
        section: "Todos",
        items: [
          { text: "Add Todos", icon: <NoteAddIcon />, path: "/user/addtodos" },
          { text: "My Todos", icon: <ListAltIcon />, path: "/user/todos" },
        ],
      },
      {
        section: "Account",
        items: [{ text: "Profile", icon: <PersonIcon />, path: "/profile" }],
      },
    ],
    guest: [
      {
        section: "Access",
        items: [
          { text: "Login", icon: <LoginIcon />, path: "/login" },
          { text: "Register", icon: <AppRegistrationIcon />, path: "/register" },
        ],
      },
    ],
  };

  const role = user?.roles?.[0] || "guest";

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 80 : 260,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: collapsed ? 80 : 260,
          boxSizing: "border-box",
          backgroundColor: darkMode ? "#1e1e1e" : "#fff",
          color: darkMode ? "#fff" : "#000",
          transition: "width 0.3s",
          borderRight: "1px solid #eee",
        },
      }}
    >
      {/* Header / User Info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          p: 2,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        {!collapsed && (
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
              {user?.tenant_name ? user.tenant_name[0].toUpperCase() : "?"}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {user?.name || (role === "superAdmin" ? "Super Admin" : "Guest")}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {role}
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton size="small" onClick={toggleCollapse}>
          <MenuIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>

      {/* Back Button */}
      <Box sx={{ px: 1, py: 1 }}>
        <Tooltip title="Back to Home" placement="right">
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon>
              <ArrowBackIcon sx={{ color: "primary.main" }} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Back to Home" />}
          </ListItemButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* Menu Sections */}
      <List sx={{ flexGrow: 1 }}>
        {(menuItems[role] || []).map((section) => (
          <Box key={section.section} sx={{ mb: 2 }}>
            {!collapsed && (
              <Typography
                variant="caption"
                sx={{ pl: 2, pb: 1, fontWeight: "bold", color: "text.secondary" }}
              >
                {section.section}
              </Typography>
            )}
            {section.items.map((item) => (
              <Tooltip
                key={item.text}
                title={collapsed ? item.text : ""}
                placement="right"
                arrow
              >
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                      "&.Mui-selected": {
                        bgcolor: "primary.light",
                        color: "primary.main",
                        "& .MuiListItemIcon-root": { color: "primary.main" },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.badge ? (
                        <Box
                          sx={{
                            position: "relative",
                            display: "inline-flex",
                          }}
                        >
                          {item.icon}
                          <Box
                            sx={{
                              position: "absolute",
                              top: -4,
                              right: -4,
                              bgcolor: "error.main",
                              color: "#fff",
                              borderRadius: "50%",
                              px: 0.6,
                              fontSize: "0.7rem",
                              fontWeight: "bold",
                            }}
                          >
                            {item.badge}
                          </Box>
                        </Box>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary={item.text} />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </Box>
        ))}
      </List>

      <Divider />

      {/* Footer / Quick Settings */}
      <Box sx={{ p: 2 }}>
        {!collapsed && (
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 1, color: "text.secondary" }}
          >
            Quick Settings
          </Typography>
        )}
        <Box display="flex" justifyContent="center" gap={1}>
          {/* Dark Mode Toggle */}
          <Tooltip title="Toggle Dark Mode" placement="top">
            <IconButton onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications" placement="top">
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          {/* Logout */}
          {user && (
            <Tooltip title="Logout" placement="top">
              <IconButton onClick={logout}>
                <LogoutIcon color="error" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
