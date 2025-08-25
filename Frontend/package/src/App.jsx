
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
import Login2 from "./views/authentication/Login";
import Register2 from "./views/authentication/Register";
import Forbidden from "./pages/Forbbiden";
import LandingPage from "./pages/LandingPage";
import BecomeTenant from "./pages/BecomeTenant";

// Routes
import PrivateRoute from "./routes/PrivateRoute";

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login2 />} />
      <Route path="/register" element={<Register2 />} />
      <Route path="/" element={<LandingPage />} />

      {/* Only logged-in users with role=user can see BecomeTenant */}
      <Route
        path="/becometenant"
        element={
          <PrivateRoute allowedRoles={["user"]}>
            <BecomeTenant />
          </PrivateRoute>
        }
      />

      {/* Root → Redirect by role */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            {user?.role === "superAdmin" && (
              <Navigate to="/dashboard" replace />
            )}
            {user?.role === "tenantAdmin" && (
              <Navigate to="/dashboard" replace />
            )}
            {user?.role === "user" && <Navigate to="/user/todos" replace />}
            {!user?.role && <Navigate to="/landingpage" replace />}
          </PrivateRoute>
        }
      />

      {/* Authenticated Routes with Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Common Dashboard */}
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

        {/* Super Admin Routes */}
        <Route
          path="superAdmin/tenants"
          element={
            <PrivateRoute allowedRoles={["superAdmin"]}>
              <TenantList />
            </PrivateRoute>
            // /superAdmin/tenants/create
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
        <Route path="user/addtodos" element={
            <PrivateRoute allowedRoles={["user", "tenantAdmin"]}>
              <CreateTodo />
            </PrivateRoute>
          } />
        <Route path="user/todos" element={
            <PrivateRoute allowedRoles={["user", "tenantAdmin"]}>
              <TodosList />
            </PrivateRoute>
          } />

       {/* 404 */}
        <Route path="/403" element={<Forbidden />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/landingpage" replace />} />
    </Routes>
  );
}

function App() {
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
