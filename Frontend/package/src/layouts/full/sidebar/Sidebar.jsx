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
  useMediaQuery,
  useTheme,
  Switch,
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
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import TenantRequestContext from "../../../context/TenantRequestContext";

const drawerWidth = 260;
const collapsedWidth = 80;

const Sidebar = () => {
  const { user, openLogoutDialog } = useContext(AuthContext);
  const { userStats } = useContext(TenantRequestContext);
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [collapsed, setCollapsed] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(!isMobile);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const handleDrawerToggle = () => setOpen(!open);

  // Dropdown handlers
  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  // Role-based menu config
  const menuItems = {
    superAdmin: [
      {
        section: "Main",
        items: [
          { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
          { text: "Tenants", icon: <ApartmentIcon />, path: "/superAdmin/tenants" },
          { text: "Create Tenant", icon: <AddBusinessIcon />, path: "/superAdmin/create" },
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
            badge: userStats?.totalUsers,
          },
          { text: "Invite People", icon: <PersonAddIcon />, path: "/tenant-admin/createuser" },
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
      },
    ],
  };

  const role = user?.roles?.[0] || "guest";
  const currentMenuItems = menuItems[role] || [];

  return (
    <>
      {/* Mobile hamburger button */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            "&:hover": { bgcolor: theme.palette.grey[200] },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: "border-box",
            backgroundColor: darkMode ? "#452446" : "#fff",
            color: darkMode ? "#fff" : "#000",
            transition: "width 0.3s",
            display: "flex",
            flexDirection: "column",
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
            bgcolor: theme.palette.primary.main,
            color: "white",
            cursor: "pointer",
          }}
          onClick={handleMenuOpen}
        >
          {!collapsed && (
            <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
              <Avatar sx={{ bgcolor: "primary.light", mr: 1 }}>
                {user?.tenant_name ? user.tenant_name[0].toUpperCase() : "?"}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {user?.tenant_name || user?.name || "User"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {role}
                </Typography>
              </Box>
              {(role === "tenantAdmin" || role === "superAdmin") && (
                <KeyboardArrowDownIcon fontSize="small" sx={{ ml: "auto" }} />
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
        {(role === "tenantAdmin" || role === "superAdmin") && (
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
                if (role === "tenantAdmin") {
                  navigate("/tenant-admin/createuser");
                } else if (role === "superAdmin") {
                  navigate("/superAdmin/create");
                }
              }}
            >
              <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
              Invite People
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <AddBusinessIcon fontSize="small" sx={{ mr: 1 }} />
              Upgrade Plan
            </MenuItem>
            <Divider />
            <MenuItem onClick={openLogoutDialog}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        )}

        {/* Role-based Menu */}
        <List sx={{ flexGrow: 1 }}>
          {currentMenuItems.map((section) => (
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
                <Tooltip key={item.text} title={collapsed ? item.text : ""} placement="right" arrow>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      selected={location.pathname === item.path}
                      onClick={isMobile ? handleDrawerToggle : null}
                      sx={{
                        "&.Mui-selected": {
                          bgcolor: theme.palette.action.selected,
                          color: theme.palette.primary.main,
                          "& .MuiListItemIcon-root": { color: theme.palette.primary.main },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {item.badge ? (
                          <Box sx={{ position: "relative", display: "inline-flex" }}>
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
          <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
            {/* Notifications */}
            <Tooltip title="Notifications" placement="top">
              <IconButton>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

           

            {/* Logout */}
            {user && (
              <Tooltip title="Logout" placement="top">
                <IconButton onClick={openLogoutDialog}>
                  <LogoutIcon color="error" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
