// src/routes/SuperAdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "../pages/superAdmin/Dashboard";
import { TenantDetais } from "../pages/superAdmin/TenantDetails";
import { CreateTenant } from "../pages/superAdmin/CreateTenant";
import TenantList from "../pages/superAdmin/TenantList";
// import SuperAdminLayout from "../layouts/SuperAdminLayout";




export default function SuperAdminRoutes() {
  return (
    <>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tenants" element={<TenantDetais />} />
        <Route path="tenants/create" element={<CreateTenant />} />
        <Route path="tenants/:id" element={<TenantList />} />
      </Routes>
    </>
  );
}
