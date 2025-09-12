// components/LogoutDialog.js
import React, { useContext } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LogoutDialog = () => {
  const { logout, logoutDialogOpen, closeLogoutDialog } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect after logout
  };

  return (
    <Dialog open={logoutDialogOpen} onClose={closeLogoutDialog}>
      <DialogTitle>Confirm Logout</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to logout?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeLogoutDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLogout} color="error">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
