import React, { createContext, useState, useEffect } from "react";
import { tenantApi } from "../services/tenantAdminAPI";

// ----------------------------
// Context Definition
// ----------------------------
export const TenantRequestContext = createContext();

// ----------------------------
// Provider Component
// ----------------------------
export const TenantRequestProvider = ({ children }) => {
  // Persisted State (localStorage)
  const [tenantRequestId, setTenantRequestId] = useState(
    () => localStorage.getItem("tenantRequestId") || null
  );
  const [tenantId, setTenantId] = useState(
    () => localStorage.getItem("tenantId") || null
  );

  // Tenant Info
  const [tenantDetails, setTenantDetails] = useState(null);

  // Tenant Users
  const [tenantUsers, setTenantUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  // Tenant Requests
  const [requestCounts, setRequestCounts] = useState({
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalActive: 0,
    totalCount: 0,
  });
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [errorRequests, setErrorRequests] = useState(null);

  // Tenant User Stats
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    byRole: {},
    byStatus: {},
  });

  // Persist tenantRequestId & tenantId to localStorage
  useEffect(() => {
    if (tenantRequestId) localStorage.setItem("tenantRequestId", tenantRequestId);
    
  }, [tenantRequestId]);

  useEffect(() => {
    if (tenantId) localStorage.setItem("tenantId", tenantId);
  }, [tenantId]);

  // Fetch Tenant Requests Count
  const fetchTenantRequestsCount = async () => {
    setLoadingRequests(true);
    setErrorRequests(null);
    try {
      const response = await tenantApi.list();
      const requests = response?.data || [];

      const totalPending = requests.filter(r => r.status === "pending").length;
      const totalApproved = requests.filter(r => r.status === "approved").length;
      const totalRejected = requests.filter(r => r.status === "rejected").length;
      const totalActive = requests.filter(r => r.status === "active").length;
      const totalCount = requests.length;

      setRequestCounts({ totalPending, totalApproved, totalRejected, totalActive, totalCount });
    } catch (err) {
      console.error("Failed to fetch tenant requests count:", err);
      setRequestCounts({ totalPending: 0, totalApproved: 0, totalRejected: 0, totalActive: 0, totalCount: 0 });
      setErrorRequests(err.message || "Failed to load requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch Tenant Details
  const fetchTenantDetails = async (id) => {
    if (!id) return;
    try {
      const data = await tenantApi.getById(id);
      setTenantDetails(data?.tenant || null);
      setTenantId(data?.tenant?.id || null);
    } catch (err) {
      console.error("Failed to fetch tenant details:", err);
      setTenantDetails(null);
      setTenantId(null);
    }
  };

  // Fetch Tenant Users
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
      const byRole = users.reduce((acc, user) => {
        const role = user.Roles?.[0]?.name || "Unknown";
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});
      const byStatus = users.reduce((acc, user) => {
        const status = user.status || "Unknown";
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

  // Auto-fetch users whenever tenantId changes (automatic)
  useEffect(() => {
    if (tenantId) {
      fetchTenantUsers(tenantId);
      fetchTenantDetails(tenantId); // optional: fetch tenant details too
    }
  }, [tenantId]);

  // Auto-refresh request counts every 40 seconds
  useEffect(() => {
    fetchTenantRequestsCount();
    const interval = setInterval(fetchTenantRequestsCount, 40000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  if (tenantId) {
    fetchTenantUsers(tenantId);
    fetchTenantDetails(tenantId);
  }
}, [tenantId]);


  // Context value
  return (
    <TenantRequestContext.Provider
      value={{
        tenantRequestId,
        setTenantRequestId,
        tenantId,
        setTenantId,
        tenantDetails,
        tenantUsers,
        loadingUsers,
        errorUsers,
        fetchTenantUsers,
        fetchTenantDetails,
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
