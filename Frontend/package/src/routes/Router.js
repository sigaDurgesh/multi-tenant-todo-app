// src/routes/Router.js
import { createBrowserRouter } from "react-router-dom";


// import ForgotPassword from "../pages/auth/ForgotPassword";
// import NotFound from "../pages/NotFound";
import TenantAdminRoutes from "./TenantRoutes";
import UserRoutes from "./UserRoutes";
import { Dashboard } from "../pages/superAdmin/Dashboard";
import SuperAdminRoutes from "./SuperAdminRoutes";
// import Dashboard from "../pages/tenant-admin/Dashboard";


const router = createBrowserRouter([
  // Auth routes
  // { path: "/login", element: <Login /> },
  // { path: "/register", element: <Register /> },
  // { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/", element: <Dashboard /> },

  // Super Admin dashboard
  { path: "/super-admin/*", element: <SuperAdminRoutes /> },

  // Tenant Admin dashboard
  { path: "/tenant-admin/*", element: <TenantAdminRoutes /> },

  // User dashboard
  { path: "/user/*", element: <UserRoutes /> },

  // Fallback 404
  // { path: "*", element: <NotFound /> },
]);

export default router;
