// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

 

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.token) localStorage.setItem("token", user.token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  const login = (userData) => {
    const role = Array.isArray(userData.roles) ? userData.roles[0] : userData.role;
    const newUser = { ...userData, role };
    setUser(newUser);
  };

  const logout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (!confirmLogout) {
    return;
  }  setUser(null);
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
