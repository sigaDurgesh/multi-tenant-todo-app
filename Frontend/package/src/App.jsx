// import './App.css';
// import { CssBaseline, ThemeProvider } from '@mui/material';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { baselightTheme } from './theme/DefaultColors';
// import { AuthContext, AuthProvider } from './context/AuthContext';

// // Layout
// import Layout from './layouts/full/Layout';
// import TenantList from './pages/superAdmin/TenantList';
// import TodosList from './pages/user/TodosList';
// import CommonDashboard from './pages/Dashboard';
// import { useContext } from 'react';
// import UsersList from './pages/tenant-admin/UsersList';
// import CreateTodo from './pages/user/CreateTodo';
// import Profile from './pages/Profile';
// import Login2 from './views/authentication/Login';
// import Register2 from './views/authentication/Register';

// function App() {
//   const theme = baselightTheme;

//   const takerole = useContext(AuthContext);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AuthProvider>
//         <BrowserRouter>
//           <Routes>
//             {/* Layout wraps all routes */}
//             <Route path="/" element={<Layout />}>
//               <Route path="commondashboard" element={<CommonDashboard role={takerole} />} />

//               <Route path="/login" element={<Login2 />} />
//               <Route path="/register" element={<Register2 />} />
//               <Route path="profile" element={<Profile />} />

//               {/* Super Admin */}
//               <Route path="superAdmin/tenants" element={<TenantList />} />

//               {/* Tenant Admin */}
//               <Route path="tenant-admin/users" element={<UsersList />} />

//               {/* User */}
//               <Route path="user/addtodos" element={<CreateTodo />} />
//               <Route path="user/todos" element={<TodosList />} />

//               {/* 404 */}
//               {/* <Route path="*" element={<NotFound />} /> */}
//             </Route>
//           </Routes>
//         </BrowserRouter>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

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
import PrivateRoute from "./routes/ProvateRoute";

function App() {
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login2 />} />
            <Route path="/register" element={<Register2 />} />

            {/* Protected Layout */}
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
                path="commondashboard"
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

              {/* Super Admin */}
              <Route
                path="superAdmin/tenants"
                element={
                  <PrivateRoute allowedRoles={["superAdmin"]}>
                    <TenantList />
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
                  <PrivateRoute allowedRoles={["user"]}>
                    <CreateTodo />
                  </PrivateRoute>
                }
              />
              <Route
                path="user/todos"
                element={
                  <PrivateRoute allowedRoles={["user"]}>
                    <TodosList />
                  </PrivateRoute>
                }
              />

              <Route path="unauthorized" element={<h2>Access Denied 🚫</h2>} />
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
