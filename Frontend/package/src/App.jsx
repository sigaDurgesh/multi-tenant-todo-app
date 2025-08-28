import "./App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { baselightTheme } from "./theme/DefaultColors";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

// Layout
import Layout from "./layouts/full/Layout";

// Pages
import TenantList from "./pages/superAdmin/TenantList";
import TenantRequest from "./pages/superAdmin/TenantRequest";
import { CreateTenant } from "./pages/superAdmin/CreateTenant";
import UsersList from "./pages/tenant-admin/UsersList";
import TodosList from "./pages/user/TodosList";
import CreateTodo from "./pages/user/CreateTodo";
import CommonDashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./views/authentication/Login";
import Register from "./views/authentication/Register";
import Forbidden from "./pages/Forbbiden";
import LandingPage from "./pages/LandingPage";
import BecomeTenant from "./pages/BecomeTenant";
import ChangePassword from "./pages/ChangePass";
import RegisterUnderTenant from "./views/authentication/RegisterUnderTenant";

// Routes
import PrivateRoute from "./routes/PrivateRoute";

// Context
import { TenantRequestProvider } from "./context/TenantRequestContext";

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/change-pass" element={<ChangePassword />} />
      <Route path="/register-under-tenant" element={<RegisterUnderTenant />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/becometenant" element={<BecomeTenant />} />

      {/* Role-Based Redirects */}
      <Route
        path="/redirect"
        element={
          <PrivateRoute>
            {user?.role === "superAdmin" && <Navigate to="/dashboard" replace />}
            {user?.role === "tenantAdmin" && <Navigate to="/dashboard" replace />}
            {user?.role === "user" && <Navigate to="/user/todos" replace />}
            {!user?.role && <Navigate to="/" replace />}
          </PrivateRoute>
        }
      />

      {/* Authenticated Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Common */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute allowedRoles={["superAdmin", "tenantAdmin"]}>
              <CommonDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute allowedRoles={["user", "tenantAdmin", "superAdmin"]}>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Super Admin */}
        <Route
          path="superAdmin/tenants"
          element={
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <TenantList />
            </PrivateRoute>
          }
        />
        <Route
          path="superAdmin/create"
          element={
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <CreateTenant />
            </PrivateRoute>
          }
        />
        <Route
          path="superAdmin/tenantrequest"
          element={
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <TenantRequest />
            </PrivateRoute>
          }
        />

        {/* Tenant Admin */}
        <Route
          path="tenant-admin/users"
          element={
            <PrivateRoute allowedRoles={["tenantAdmin"]}>
              <UsersList />
            </PrivateRoute>
          }
        />

        {/* User */}
        <Route
          path="user/addtodos"
          element={
            <PrivateRoute allowedRoles={["user", "tenantAdmin"]}>
              <CreateTodo />
            </PrivateRoute>
          }
        />
        <Route
          path="user/todos"
          element={
            <PrivateRoute allowedRoles={["user", "tenantAdmin"]}>
              <TodosList />
            </PrivateRoute>
          }
        />


        {/* Forbidden */}
        <Route path="/403" element={<Forbidden />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TenantRequestProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TenantRequestProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
