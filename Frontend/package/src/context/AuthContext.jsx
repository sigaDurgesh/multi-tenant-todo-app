import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load from localStorage on startup
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [tenantRequestsCount, setTenantRequestsCount] = useState(0);
  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Fetch tenant requests count
  const fetchTenantRequestsCount = async () => {
    try {
      const res = await fetch("http://localhost:5000/tenant-requests");
      const data = await res.json();
      if (data && data.data) {
        setTenantRequestsCount(data.data.length);
      }
    } catch (err) {
      console.error("Failed to fetch tenant requests count", err);
    }
  };

  useEffect(() => {
    fetchTenantRequestsCount();

    // optional: keep refreshing every 30 seconds
    const interval = setInterval(fetchTenantRequestsCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Real login (backend provides token + user info)
  const login = (userData) => {
    const role = Array.isArray(userData.roles)
      ? userData.roles[0]
      : userData.role;
    const newUser = { ...userData, role };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setUser,
        tenantRequestsCount,   // ✅ expose count globally
        fetchTenantRequestsCount, // ✅ also expose refetch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
