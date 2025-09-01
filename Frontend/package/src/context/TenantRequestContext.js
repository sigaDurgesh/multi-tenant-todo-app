import React, { createContext, useState, useEffect, useContext } from "react";
import { tenantApi } from "../services/tenantAdminAPI";
import { AuthContext } from "./AuthContext";

export const TenantRequestContext = createContext();

export const TenantRequestProvider = ({ children }) => {

    const { user } = useContext(AuthContext);  // ✅ get logged-in user

  // ----------------------------
  // Persisted State
  // ----------------------------
  const [tenantRequestId, setTenantRequestId] = useState(
    () => localStorage.getItem("tenantRequestId") || null
  );
  const [tenantId, setTenantId] = useState(
    () => localStorage.getItem("tenantId") || null
  );

  // ----------------------------
  // Tenant Info
  // ----------------------------
  const [tenantDetails, setTenantDetails] = useState(null);

  // ----------------------------
  // Tenant Users
  // ----------------------------
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
  // Tenant User Stats
  // ----------------------------
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    byRole: {},
    byStatus: {},
  });

  // ----------------------------
  // Sync state to localStorage
  // ----------------------------
  useEffect(() => {
    if (tenantRequestId) localStorage.setItem("tenantRequestId", tenantRequestId);
    else localStorage.removeItem("tenantRequestId");
  }, [tenantRequestId]);

  useEffect(() => {
    if (tenantId) localStorage.setItem("tenantId", tenantId);
    else localStorage.removeItem("tenantId");
  }, [tenantId]);

  // ----------------------------
  // Listen to localStorage changes from other tabs or navigation
  // ----------------------------
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "tenantId") {
        setTenantId(event.newValue);
      }
      if (event.key === "tenantRequestId") {
        setTenantRequestId(event.newValue);
      }
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
        totalPending: requests.filter(r => r.status === "pending").length,
        totalApproved: requests.filter(r => r.status === "approved").length,
        totalRejected: requests.filter(r => r.status === "rejected").length,
        totalActive: requests.filter(r => r.status === "active").length,
        totalCount: requests.length,
      });
    } catch (err) {
      console.error("Failed to fetch tenant requests count:", err);
      setRequestCounts({ totalPending: 0, totalApproved: 0, totalRejected: 0, totalActive: 0, totalCount: 0 });
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
      setTenantId(data?.tenant?.id || id); // keep state in sync
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

  // ----------------------------
  // Auto-fetch tenant users & details whenever tenantId changes
  // ----------------------------
  useEffect(() => {
    if (tenantId) {
      fetchTenantUsers(tenantId);
      fetchTenantDetails(tenantId);
    }
  }, [tenantId]);

  // ----------------------------
  // Auto-refresh tenant requests every 40s
  // ----------------------------
 useEffect(() => {
    if (!user || user.role !== "superAdmin") return; // ✅ block non-superAdmins

    fetchTenantRequestsCount(); // initial call
    const interval = setInterval(fetchTenantRequestsCount, 50000);

    return () => clearInterval(interval);
  }, [user]); // rerun if user changes

  // ----------------------------
  // Context value
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
