// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { tenantApi } from "../services/tenantAdminAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // --- STATE ---
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [tenantRequestId, setTenantRequestId] = useState(() => {
    try {
      return localStorage.getItem("tenantRequestId") || null;
    } catch {
      return null;
    }
  });

  const [tenantRequestsCount, setTenantRequestsCount] = useState(0);
  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.token) localStorage.setItem("token", user.token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);
  
  // Fetch tenant requests count
  useEffect(() => {
    if (tenantRequestId) {
      localStorage.setItem("tenantRequestId", tenantRequestId);
    } else {
      localStorage.removeItem("tenantRequestId");
    }
  }, [tenantRequestId]);

  // --- FETCH TENANT REQUEST COUNT ---
  const fetchTenantRequestsCount = async () => {
    try {
      const data = await tenantApi.list();
      if (Array.isArray(data?.data)) {
        setTenantRequestsCount(data.data.length);
      } else {
        setTenantRequestsCount(0);
      }
    } catch (err) {
      console.error("❌ Failed to fetch tenant requests count", err);
    }
  };

  useEffect(() => {
    fetchTenantRequestsCount();
    const interval = setInterval(fetchTenantRequestsCount, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // --- AUTH FUNCTIONS ---
  const login = (userData) => {
    const role = Array.isArray(userData.roles) ? userData.roles[0] : userData.role;
    const newUser = { ...userData, role };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setTenantRequestId(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tenantRequestId");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenantRequestId,
        setTenantRequestId,
        tenantRequestsCount,
        fetchTenantRequestsCount,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
