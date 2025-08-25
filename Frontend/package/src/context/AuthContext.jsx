import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load from localStorage on startup
  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem("user"); // actually storing role only
    return savedRole ? { role: JSON.parse(savedRole) } : null;
  });

  // Save only role to localStorage whenever user changes
  useEffect(() => {
    if (user?.roles && user.roles.length > 0) {
      const role = user.roles[0]; // safe now
      localStorage.setItem("user", JSON.stringify(role));
    } else if (user?.role) {
      // if role already normalized
      localStorage.setItem("user", JSON.stringify(user.role));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Real login (backend provides token + user info)
  const login = (userData) => {
    // userData = { id, email, name, tenant_id, roles, token }
    const role = Array.isArray(userData.roles) ? userData.roles[0] : userData.role;
    setUser({ ...userData, role });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
