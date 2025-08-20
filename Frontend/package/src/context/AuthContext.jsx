// src/context/AuthContext.jsx
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // You’d normally decode JWT token here
  const [takerole, setTakerole] = useState("user"); // mock role for testing
 
  return (
    <AuthContext.Provider value={{ takerole, setTakerole }}>
      {children}
    </AuthContext.Provider>
  );
};
