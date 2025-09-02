// src/context/TenantRequestContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { tenantApi } from "../services/tenantAdminAPI";
import { AuthContext } from "./AuthContext";

// ✅ Create TenantRequest Context
export const TenantRequestContext = createContext();

// ✅ Provider component
export const TenantRequestProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // Logged-in user

  // ----------------------------
  // Persisted State (localStorage)
  // ----------------------------
  const [tenantRequestId, setTenantRequestId] = useState(
    () => localStorage.getItem("tenantRequestId") || null
  );
  const [tenantId, setTenantId] = useState(
    () => localStorage.getItem("tenantId") || null
  );

  // ----------------------------
  // Tenant Info & Users
  // ----------------------------
  const [tenantDetails, setTenantDetails] = useState(null);
  const [tenantUsers, setTenantUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  // ----------------------------
  // Tenant Requests
  // ----------------------------
  const [requestCounts, setRequestCounts] = useState({
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalActive: 0,
    totalCount: 0,
  });
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [errorRequests, setErrorRequests] = useState(null);

  // ----------------------------
  // Tenant Users Stats
  // ----------------------------
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    byRole: {},
    byStatus: {},
  });

  // ----------------------------
  // Sync state with localStorage
  // ----------------------------
  useEffect(() => {
    tenantRequestId
      ? localStorage.setItem("tenantRequestId", tenantRequestId)
      : localStorage.removeItem("tenantRequestId");
  }, [tenantRequestId]);

  useEffect(() => {
    tenantId
      ? localStorage.setItem("tenantId", tenantId)
      : localStorage.removeItem("tenantId");
  }, [tenantId]);

  // ----------------------------
  // Listen to storage changes from other tabs
  // ----------------------------
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "tenantId") setTenantId(event.newValue);
      if (event.key === "tenantRequestId") setTenantRequestId(event.newValue);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ----------------------------
  // Fetch Tenant Requests Count
  // ----------------------------
  const fetchTenantRequestsCount = async () => {
    setLoadingRequests(true);
    setErrorRequests(null);
    try {
      const response = await tenantApi.list();
      const requests = response?.data || [];

      setRequestCounts({
        totalPending: requests.filter((r) => r.status === "pending").length,
        totalApproved: requests.filter((r) => r.status === "approved").length,
        totalRejected: requests.filter((r) => r.status === "rejected").length,
        totalActive: requests.filter((r) => r.status === "active").length,
        totalCount: requests.length,
      });
    } catch (err) {
      console.error("Failed to fetch tenant requests count:", err);
      setRequestCounts({
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        totalActive: 0,
        totalCount: 0,
      });
      setErrorRequests(err.message || "Failed to load requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  // ----------------------------
  // Fetch Tenant Details
  // ----------------------------
  const fetchTenantDetails = async (id) => {
    if (!id) return;
    try {
      const data = await tenantApi.getUsers(id);
      setTenantDetails(data?.tenant || null);
      setTenantId(data?.tenant?.id || id);
    } catch (err) {
      console.error("Failed to fetch tenant details:", err);
      setTenantDetails(null);
      setTenantId(null);
    }
  };

  // ----------------------------
  // Fetch Tenant Users
  // ----------------------------
  const fetchTenantUsers = async (id) => {
    if (!id) return;
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const data = await tenantApi.getUsers(id);
      const users = data?.users || [];
      setTenantUsers(users);

      // Compute stats
      const totalUsers = users.length;
      const byRole = users.reduce((acc, u) => {
        const role = u.Roles?.[0]?.name || "Unknown";
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});
      const byStatus = users.reduce((acc, u) => {
        const status = u.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      setUserStats({ totalUsers, byRole, byStatus });
    } catch (err) {
      console.error("Failed to fetch tenant users:", err);
      setTenantUsers([]);
      setUserStats({ totalUsers: 0, byRole: {}, byStatus: {} });
      setErrorUsers(err.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  // ----------------------------
  // Auto-fetch when tenantId changes
  // ----------------------------
  useEffect(() => {
    if (tenantId) {
      fetchTenantUsers(tenantId);
      fetchTenantDetails(tenantId);
    }
  }, [tenantId]);

  // ----------------------------
  // Auto-refresh tenant requests for superAdmin
  // ----------------------------
  useEffect(() => {
    if (!user || user.role !== "superAdmin") return;
    fetchTenantRequestsCount();
    const interval = setInterval(fetchTenantRequestsCount, 50000);
    return () => clearInterval(interval);
  }, [user]);

  // ----------------------------
  // Context Value
  // ----------------------------
  return (
    <TenantRequestContext.Provider
      value={{
        tenantRequestId,
        setTenantRequestId,
        tenantId,
        setTenantId,
        tenantDetails,
        fetchTenantDetails,
        tenantUsers,
        fetchTenantUsers,
        loadingUsers,
        errorUsers,
        requestCounts,
        loadingRequests,
        errorRequests,
        userStats,
      }}
    >
      {children}
    </TenantRequestContext.Provider>
  );
};

export default TenantRequestContext;
