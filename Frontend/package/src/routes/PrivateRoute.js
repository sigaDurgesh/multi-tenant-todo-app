// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// // Props: allowedRoles = ["superAdmin", "tenantAdmin", "user"]
// const PrivateRoute = ({ allowedRoles, children }) => {
//   const { user } = useContext(AuthContext);

//   // ✅ fallback: load from localStorage if context is empty
//   const storedUser = localStorage.getItem("user");
//   const finalUser = user || (storedUser ? JSON.parse(storedUser) : null);

//   // If no user → redirect to login
//   if (!finalUser) {
//     return <Navigate to="/login" replace />;
//   }

//   // If route requires role check
//   if (allowedRoles && !allowedRoles.includes(finalUser.role)) {
//     // Not authorized → redirect to dashboard (or a 403 page)
//     return <Navigate to="/dashboard" replace />;
//   }

//   // Authorized → render the child component
//   return children;
// };

// export default PrivateRoute;


import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Props: allowedRoles = ["superAdmin", "tenantAdmin", "user"]
const PrivateRoute = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext);

  // ✅ fallback: load from localStorage if context is empty
  const storedUser = localStorage.getItem("user");
  const finalUser = user || (storedUser ? JSON.parse(storedUser) : null);

  // If no user → redirect to login
  if (!finalUser) {
    return <Navigate to="/login" replace />;
  }

  // If route requires role check → block access
  if (allowedRoles && !allowedRoles.includes(finalUser.role)) {
    return <Navigate to="/403" replace />; // 🚨 show Unauthorized page instead of dashboard
  }

  // Authorized → render the child component
  return children;
};

export default PrivateRoute;
