import React, { useContext } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import NoteIcon from "@mui/icons-material/Note";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ListAltIcon from "@mui/icons-material/ListAlt";

import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const role = user?.role || "user"; // fallback role

  const menuItems = {
    superAdmin: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/commondashboard" },
      { text: "Tenants", icon: <ApartmentIcon />, path: "/superAdmin/tenants" },
      { text: "Profile", icon: <NoteIcon />, path: "/profile" },
    ],
    tenantAdmin: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/commondashboard" },
      { text: "Users", icon: <PeopleIcon />, path: "/tenant-admin/users" },
      { text: "Profile", icon: <NoteIcon />, path: "/profile" },
    ],
    user: [
      { text: "Add Todos", icon: <NoteAddIcon />, path: "/user/addtodos" },
      { text: "My Todos", icon: <ListAltIcon />, path: "/user/todos" },
      { text: "Profile", icon: <NoteIcon />, path: "/profile" },
    ],
    guest: [
      { text: "Login", icon: <DashboardIcon />, path: "/login" },
      { text: "Register", icon: <PeopleIcon />, path: "/register" },
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
      <Box sx={{ p: 2, backgroundColor: "#1976d2", color: "#fff" }}>
        <Typography variant="subtitle1">
          {user?.name || "Guest User"}
        </Typography>
        <Typography variant="body2">
          Role: {role}
        </Typography>
      </Box>

      {/* Menu Items */}
      <List>
        {(menuItems[role] || []).map((item) => (
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
