// src/App.jsx
import React, { useContext } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { baselightTheme } from "./theme/DefaultColors";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { TenantRequestProvider } from "./context/TenantRequestContext";
import { TodosProvider } from "./context/TodoContext";

import Layout from "./layouts/full/Layout";

import TenantList from "./pages/superAdmin/TenantList";
import TenantRequest from "./pages/superAdmin/TenantRequest";
import CreateTenant  from "./pages/superAdmin/CreateTenant";
import UsersList from "./pages/tenant-admin/UsersList";
import CreateUser from "./pages/tenant-admin/CreateUser";
import TodosList from "./pages/user/TodosList";
import CreateTodo from "./pages/user/CreateTodo";
import CommonDashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RegisterUnderTenant from "./views/authentication/RegisterUnderTenant";
import Forbidden from "./pages/Forbbiden";
import LandingPage from "./pages/LandingPage";
import BecomeTenant from "./pages/BecomeTenant";
import ChangePassword from "./pages/ChangePass";

import PrivateRoute from "./routes/PrivateRoute";
import Login from "./views/authentication/Login";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/change-pass" element={<ChangePassword />} />
      <Route path="/register-under-tenant" element={<RegisterUnderTenant />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/becometenant" element={<BecomeTenant />} />

      {/* Role-Based Redirect */}
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

      {/* Authenticated Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Common Routes */}
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
        <Route
          path="tenant-admin/createuser"
          element={
            <PrivateRoute allowedRoles={["tenantAdmin"]}>
              <CreateUser />
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
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={baselightTheme}>
      <CssBaseline />
      <AuthProvider>
        <TenantRequestProvider>
          <TodosProvider>
            <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>

              <AppRoutes />
              </LocalizationProvider>
            </BrowserRouter>
          </TodosProvider>
        </TenantRequestProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
