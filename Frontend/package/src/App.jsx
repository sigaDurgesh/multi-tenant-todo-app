// import './App.css';
// import { CssBaseline, ThemeProvider } from '@mui/material';
// import { BrowserRouter, RouterProvider } from 'react-router-dom';
// import { baselightTheme } from './theme/DefaultColors';
// import router from './routes/Router';
// import { AuthProvider } from './context/AuthContext';
// import Sidebar from './layouts/full/sidebar/Sidebar';

// function App() {
//   const theme = baselightTheme;

//   return (
//     <BrowserRouter>
//     {/* <ThemeProvider> */}
//       <Sidebar>
//       <CssBaseline />
//       <AuthProvider>
//         <RouterProvider router={router} />
//       </AuthProvider>
//       </Sidebar>
//     {/* </ThemeProvider> */}
//     </BrowserRouter>
    
//   );
// }

// export default App;

import './App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { baselightTheme } from './theme/DefaultColors';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Layout
import Layout from './layouts/full/Layout';
// import { Dashboard } from './pages/superAdmin/Dashboard';
import TenantList from './pages/superAdmin/TenantList';
import TodosList from './pages/user/TodosList';
import CommonDashboard from './pages/Dashboard';
import { useContext } from 'react';
import UsersList from './pages/tenant-admin/UsersList';
import CreateTodo from './pages/user/CreateTodo';
import Profile from './pages/Profile';
// import TenantDashboard from './pages/tenant-admin/TenantDashboard';

// Pages



// import NotFound from './pages/NotFound';

function App() {
  const theme = baselightTheme;

  const takerole = useContext(AuthContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Layout wraps all routes */}
            <Route path="/" element={<Layout />}>
              <Route path="commondashboard" element={<CommonDashboard role={takerole} />} />
              <Route path="profile" element={<Profile />} />

              {/* Super Admin */}
              <Route path="superAdmin/tenants" element={<TenantList />} />

              {/* Tenant Admin */}
              <Route path="tenant-admin/users" element={<UsersList />} />

              {/* User */}
              <Route path="user/addtodos" element={<CreateTodo />} />
              <Route path="user/todos" element={<TodosList />} />

              {/* 404 */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
