import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import SuperAdminDashboard from "./DashComp/SuperAdmin";
import UserDashboard from "./DashComp/UserDash";
import TenantAdminDashboard from "./DashComp/TenantAdmin";

const CommonDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <Typography variant="h6" color="textSecondary">Please login to view the dashboard.</Typography>;
  }
  if (!user.token) {
    return <Typography variant="h6" color="textSecondary">Please login.</Typography>;
  }

  switch (user.role) {
    case "superAdmin":
      return <SuperAdminDashboard navigate={navigate} />;
    case "tenantAdmin":
      return <TenantAdminDashboard />;
    case "user":
      return <UserDashboard />;
    default:
      return <Typography variant="h6" color="textSecondary">No dashboard available for this role.</Typography>;
  }
};

export default CommonDashboard;
