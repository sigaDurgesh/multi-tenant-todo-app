
import "./App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { baselightTheme } from "./theme/DefaultColors";
import { AuthProvider } from "./context/AuthContext";

// Layout
import Layout from "./layouts/full/Layout";
import TenantList from "./pages/superAdmin/TenantList";
import TodosList from "./pages/user/TodosList";
import CommonDashboard from "./pages/Dashboard";
import UsersList from "./pages/tenant-admin/UsersList";
import CreateTodo from "./pages/user/CreateTodo";
import Profile from "./pages/Profile";
import Login2 from "./views/authentication/Login";
import Register2 from "./views/authentication/Register";
import { useContext } from 'react';
import { CreateTenant } from "./pages/superAdmin/CreateTenant";
import PrivateRoute from './routes/PrivateRoute';
import Forbidden from './pages/Forbbiden';
function App() {
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login2 />} />
            <Route path="/register" element={<Register2 />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route
                path="dashboard"
                element={
                  <PrivateRoute>
                    <CommonDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <PrivateRoute>
                    <Profile />
                   </PrivateRoute>
                }
              />
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
                 <PrivateRoute allowedRoles={["user"]}>
                    <CreateTodo />
                  </PrivateRoute>
              } />
              <Route path="user/todos" element={
                <PrivateRoute allowedRoles={["user"]}>
                    <UsersList />
                  </PrivateRoute>
              } />

              {/* 404 */}
              <Route path="/403" element={<Forbidden />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
