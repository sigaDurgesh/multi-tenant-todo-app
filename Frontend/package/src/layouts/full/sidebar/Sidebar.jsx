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
  Menu,
  MenuItem,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ApartmentIcon from '@mui/icons-material/Apartment';

import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import TenantRequestContext from "../../../context/TenantRequestContext";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AssignmentIcon from "@mui/icons-material/Assignment";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { requestCounts, userStats } = useContext(TenantRequestContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Dropdown handlers
  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

 const handleLogout = () => {
  
    logout();
    
  handleMenuClose();
};


  const handleInvitePeople = () => {
    navigate("superAdmin/create");
    handleMenuClose();
  };

  // Role-based menu config
  const menuItems = {
    superAdmin: [
      {
        section: "Main",
        items: [
          { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
          {
            text: "Tenants",
            icon: <ApartmentIcon />,
            path: "/superAdmin/tenants",
          },
          {
            text: "Create Tenant",
            icon: <AddBusinessIcon />,
            path: "/superAdmin/create",
          },
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
          {
            text: "Invite People",
            icon: <PersonAddIcon />,
            path: "/tenant-admin/createuser",
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
      section: "Main",
      items: [
        
        { text: "Add Todo", icon: <AddTaskIcon />, path: "/user/addtodos" },
        { text: "My Todos", icon: <AssignmentIcon />, path: "/user/todos" },
      ],
    },
   {
        section: "Account",
        items: [{ text: "Profile", icon: <PersonIcon />, path: "/profile" }],
      },]
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
          backgroundColor: darkMode ? "#452446ff" : "#fff",
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
    bgcolor: "#b144faff",
    color: "white",
    cursor: "pointer",
  }}
  onClick={handleMenuOpen}
>
  {!collapsed && (
    <Box display="flex" alignItems="center">
      <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
        {user?.tenant_name ? user.tenant_name[0].toUpperCase() : "?"}
      </Avatar>

      <Box>
        <Typography variant="subtitle2" fontWeight="bold">
          {user?.tenant_name || user?.name || "Tenant Admin"}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {role}
        </Typography>
      </Box>

      {(user.roles[0] === "tenantAdmin" || user.roles[0] === "superAdmin") && (
        <KeyboardArrowDownIcon fontSize="small" />
      )}
    </Box>
  )}

  <IconButton
    size="small"
    onClick={(e) => {
      e.stopPropagation();
      toggleCollapse();
    }}
  >
    <MenuIcon sx={{ color: "white" }} />
  </IconButton>
</Box>

{/* Dropdown Menu */}
{(user.roles[0] === "tenantAdmin" || user.roles[0] === "superAdmin") && (
  <Menu
    anchorEl={menuAnchor}
    open={Boolean(menuAnchor)}
    onClose={handleMenuClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "left" }}
  >
    <MenuItem
      onClick={() => {
        handleMenuClose();
        if (user.roles[0] === "tenantAdmin") {
          navigate("tenant-admin/createuser");
        } else if (user.roles[0] === "superAdmin") {
          navigate("/superAdmin/create");
        }
      }}
    >
      <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
      Invite People
    </MenuItem>

    <MenuItem onClick={handleMenuClose}>
      <AddBusinessIcon fontSize="small" sx={{ mr: 1 }} />
      Upgrade Tenant
    </MenuItem>

    <Divider />

    <MenuItem
      onClick={() => {
        handleMenuClose();
        handleLogout();
      }}
    >
      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
      Logout
    </MenuItem>
  </Menu>
)}


      {/* Role-based Menu */}
      <List sx={{ flexGrow: 1 }}>
        {(menuItems[role] || []).map((section) => (
          <Box key={section.section} sx={{ mb: 2 }}>
            {!collapsed && (
              <Typography
                variant="caption"
                sx={{
                  pl: 2,
                  pb: 1,
                  fontWeight: "bold",
                  color: "text.secondary",
                }}
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
                          sx={{ position: "relative", display: "inline-flex" }}
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
              <IconButton onClick={handleLogout}>
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
