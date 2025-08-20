import React, { useContext } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import NoteIcon from "@mui/icons-material/Note";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PersonIcon from "@mui/icons-material/Person";
import ListAltIcon from "@mui/icons-material/ListAlt";

import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const Sidebar = () => {
  const { takerole } = useContext(AuthContext);

  console.log("User role:", takerole);

  const menuItems = {
    super_admin: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/commondashboard" },
      { text: "Tenants", icon: <ApartmentIcon />, path: "/superAdmin/tenants" },
      { text: "Profile", icon: <NoteIcon />, path: "profile" },
    ],
    tenant_admin: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/commondashboard" },
      { text: "Users", icon: <PeopleIcon />, path: "/tenant-admin/users" },
      { text: "Profile", icon: <NoteIcon />, path: "profile" },
    ],
    user: [
  { text: "Add Todos", icon: <NoteAddIcon />, path: "/user/addtodos" },
  { text: "My Todos", icon: <ListAltIcon />, path: "/user/todos" },
  { text: "Profile", icon: <NoteIcon />, path: "profile" },


],
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
      }}
    >
            <h3 style={{padding:"10px", paddingLeft:"20px" , backgroundColor:"yellow"}}>Role : {takerole}</h3>

      <List>
        {(menuItems[takerole] || []).map((item) => (
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
