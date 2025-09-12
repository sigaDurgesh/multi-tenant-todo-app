// src/context/AuthContext.js
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    // Logout dialog state
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

 

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
      if (user.token) sessionStorage.setItem("token", user.token);
    } else {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    }
  }, [user]);

  const login = (userData) => {
    const role = Array.isArray(userData.roles) ? userData.roles[0] : userData.role;
    const newUser = { ...userData, role };
    setUser(newUser);
  };

  const logout = () => {
  // const confirmLogout = window.confirm("Are you sure you want to logout?");
  // if (!confirmLogout) {
    //   return;
    // }  
  setUser(null);
  sessionStorage.removeItem("tenantId");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
};

// Control dialog
  const openLogoutDialog = () => setLogoutDialogOpen(true);
  const closeLogoutDialog = () => setLogoutDialogOpen(false);

  // Confirm logout
  const confirmLogout = () => {
    logout();
    closeLogoutDialog();
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setUser,
         openLogoutDialog, // 👈 expose
      }}
    >
      {children}

      {/* ✅ Global Logout Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout? You’ll need to log in again to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>


    </AuthContext.Provider>
  );
};
