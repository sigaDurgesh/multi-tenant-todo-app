// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load from localStorage OR use demo user for dev
  const [user, setUser] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("auth"));
      return saved || { name: "Lalit", role: "tenantAdmin" };
    } catch (err) {
      console.error("Error parsing auth from localStorage", err);
      return { name: "Lalit", role: "tenantAdmin" };
    }
  });

  // Persist to localStorage only when `user` changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
