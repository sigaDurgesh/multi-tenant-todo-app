import React, { useCallback, useContext, useEffect, useState } from "react";
import { TenantRequestContext } from "../../context/TenantRequestContext";
import { format } from "date-fns";

// We'll use simple SVG icons for a pure Tailwind/React setup
const PendingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-yellow-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-green-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const CancelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-red-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

const TenantAdminDashboard = () => {
  const { tenantUsers, userStats, fetchTenantUsers, tenantId, loadingUsers, errorUsers } =
    useContext(TenantRequestContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const safeFormatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d) ? "-" : format(d, "MMM dd, yyyy HH:mm");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
      case "active":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <PendingIcon />;
      case "approved":
      case "active":
        return <CheckCircleIcon />;
      case "rejected":
        return <CancelIcon />;
      default:
        return null;
    }
  };

 
  // Wrap fetch in useCallback
  const fetchUsersCallback = useCallback(async () => {
    if (!tenantId) return;

    try {
      setLoading(true);
      const users = await fetchTenantUsers(tenantId); // assume it returns users array
      setTenantUsers(users || []);
    } catch (err) {
      console.error("Error fetching tenant users:", err);
      setSnackbar({
        open: true,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [tenantId, fetchTenantUsers]);

  // Fetch immediately and on interval
  useEffect(() => {
    fetchUsersCallback(); // immediate fetch
    const interval = setInterval(fetchUsersCallback, 30000); // every 30s
    return () => clearInterval(interval);
  }, [fetchUsersCallback]);

  // Filtering Logic
  const filteredUsers = tenantUsers.filter(
    (user) =>
      (statusFilter === "all" ||
        user.status?.toLowerCase() === statusFilter.toLowerCase() ||
        (statusFilter === "active" && user.is_active && !user.is_deleted) ||
        (statusFilter === "inactive" && !user.is_active && !user.is_deleted)) &&
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className=" mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tenant Admin Dashboard
        </h1>
        <p className="text-gray-500 text-lg">
          Welcome back! Here’s a complete overview of your tenant.
        </p>

        {/* Loading/Error State */}
        {loadingUsers && (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center text-gray-500">
              <svg
                className="animate-spin h-8 w-8 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="mt-3 text-lg">Loading users...</span>
            </div>
          </div>
        )}

        {errorUsers && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{errorUsers}</span>
          </div>
        )}

        {/* Summary Cards */}
        {!loadingUsers && !errorUsers && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Users",
                value: userStats.totalUsers || 0,
                color: "text-indigo-600",
              },
              {
                title: "Active Users",
                value: userStats.byStatus?.Active || 0,
                color: "text-green-600",
              },
              {
                title: "Pending Users",
                value: userStats.byStatus?.Pending || 0,
                color: "text-yellow-600",
              },
              {
                title: "Inactive Users",
                value: userStats.byStatus?.Inactive || 0,
                color: "text-gray-500",
              },
            ].map((stat) => (
              <div
                key={stat.title}
                className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300"
              >
                <p className="text-gray-500 text-sm font-medium">
                  {stat.title}
                </p>
                <p className={`text-4xl font-extrabold mt-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* User Management Section */}
        {!loadingUsers && !errorUsers && (
          <div className="bg-white rounded-xl shadow-lg mt-8 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              User Management
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="w-full md:w-1/2">
                <label htmlFor="search" className="sr-only">
                  Search Users
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="w-full md:w-1/3">
                <label htmlFor="status-filter" className="sr-only">
                  Status Filter
                </label>
                <div className="relative">
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                    className=" cursor-pointer w-full p-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l4 4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user, index) => (
                      <tr key={user.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                                {user.name?.charAt(0).toUpperCase() ||
                                  user.email.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || user.email.split("@")[0]}
                              </div>
                              <div className="text-sm text-gray-500 md:hidden">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              user.status ||
                                (user.is_deleted
                                  ? "deleted"
                                  : user.is_active
                                  ? "active"
                                  : "inactive")
                            )}`}
                          >
                            {getStatusIcon(
                              user.status ||
                                (user.is_deleted
                                  ? "deleted"
                                  : user.is_active
                                  ? "active"
                                  : "inactive")
                            )}
                            <span className="ml-1">
                              {(user.status ||
                                (user.is_deleted
                                  ? "Deleted"
                                  : user.is_active
                                  ? "Active"
                                  : "Inactive")
                              ).toUpperCase()}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {safeFormatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {safeFormatDate(user.updatedAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        currentPage === index + 1
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Snackbar */}
        {/* {snackbar.open && (
          <div
            className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl text-white ${
              snackbar.severity === "success"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
            role="alert"
          >
            {snackbar.message}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default TenantAdminDashboard;