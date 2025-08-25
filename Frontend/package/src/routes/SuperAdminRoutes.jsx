// src/routes/SuperAdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { TenantDetais } from "../pages/superAdmin/TenantDetails";
import { CreateTenant } from "../pages/superAdmin/CreateTenant";
import TenantList from "../pages/superAdmin/TenantList";
import CommonDashboard from "../pages/Dashboard";
import TenantRequest from "../pages/superAdmin/TenantRequest";
// import SuperAdminLayout from "../layouts/SuperAdminLayout";




export default function SuperAdminRoutes() {
  return (
    <>
      <Routes>
        <Route path="dashboard" element={<CommonDashboard />} />
        <Route path="tenants" element={<TenantDetais />} />
        <Route path="tenants/create" element={<CreateTenant />} />
        <Route path="tenants/:id" element={<TenantList />} />
        <Route path="tenants/requests" element={<TenantRequest />} />
      </Routes>
    </>
  );
}
