// src/components/PrivateRoute.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router";

// ✅ PrivateRoute Component
// Protects routes based on authentication and user roles
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not allowed, redirect to 403 page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default PrivateRoute;
