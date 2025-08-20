// src/routes/TenantAdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
// import TenantAdminLayout from "../layouts/TenantAdminLayout";
import CreateUser from "../pages/tenant-admin/CreateUser";
import Dashboard from "../pages/tenant-admin/Dashboard";
import UserDetails from "../pages/tenant-admin/UserDetails";
import UsersList from "../pages/tenant-admin/UsersList";


export default function TenantAdminRoutes() {
  return (
    <>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserDetails />} />
        <Route path="users/create" element={<CreateUser />} />
        <Route path="users/:id" element={<UsersList />} />
      </Routes>
    </>
  );
}
