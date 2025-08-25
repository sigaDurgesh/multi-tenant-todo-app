import React, { useContext } from "react";
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
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const menuItems = {
    superAdmin: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
      { text: "Tenants", icon: <ApartmentIcon />, path: "/superAdmin/tenants" },
      { text: "Create Tenant", icon: <AddBusinessIcon />, path: "/superAdmin/create" },
      {
        text: "Tenant Requests",
        icon: <NoteAddIcon />,
        path: "superAdmin/tenantrequest",
      },
      { text: "Profile", icon: <PersonIcon />, path: "/profile" },
    ],
    tenantAdmin: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
      { text: "Users", icon: <PeopleIcon />, path: "/tenant-admin/users" },
      { text: "Profile", icon: <PersonIcon />, path: "/profile" },
    ],
    user: [
      { text: "Add Todos", icon: <NoteAddIcon />, path: "/user/addtodos" },
      { text: "My Todos", icon: <ListAltIcon />, path: "/user/todos" },
      { text: "Profile", icon: <PersonIcon />, path: "/profile" },
      { text: "Become a Tenant", icon: <PersonIcon />, path: "/" },
    ],
    guest: [
      { text: "Login", icon: <LoginIcon />, path: "/login" },
      { text: "Register", icon: <AppRegistrationIcon />, path: "/register" },
    ],
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#fafafa",
        },
      }}
    >
      {/* User Info Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          p: 2,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Avatar sx={{ bgcolor: "secondary.main", mb: 1 }}>
          {user?.name ? user.name[0].toUpperCase() : "?"}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {user?.name || "Guest"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {user?.role || "guest"}
        </Typography>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List>
        {(menuItems[user.role] || []).map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
