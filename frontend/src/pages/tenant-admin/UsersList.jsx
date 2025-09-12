import React, { useContext, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  EyeIcon,
  TrashIcon,
  UserMinusIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowDownIcon as ArrowDownIconSolid,
  ArrowUpIcon as ArrowUpIconSolid,
} from "@heroicons/react/20/solid";
import { TenantRequestContext } from "../../context/TenantRequestContext";
import { AuthContext } from "../../context/AuthContext";
import { tenantApi } from "../../services/tenantAdminAPI";
import { useNavigate } from "react-router-dom";

// 🔹 Utility for date formatting
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// 🔹 Custom hook for users list logic
const useUsersList = () => {
  const { tenantUsers, tenantId, fetchTenantUsers, loadingUsers, errorUsers } =
    useContext(TenantRequestContext);
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, type: "", msg: "" });

  const showSnack = (type, msg) => {
    setSnack({ open: true, type, msg });
    setTimeout(() => setSnack({ open: false, type: "", msg: "" }), 4000);
  };

  const handleAction = async () => {
    if (!user?.token || !selectedUser || actionLoading) return;
    setActionLoading(true);
    try {
      const { id } = selectedUser;
      let successMsg = "";
      switch (confirmAction) {
        case "deactivate":
          await tenantApi.deactivateUser(id, user.token);
          successMsg = "User deactivated successfully!";
          break;
        case "restore":
          await tenantApi.activateUser(id, user.token);
          successMsg = "User restored successfully!";
          break;
        case "soft-delete":
          await tenantApi.softDeleteUser(id, user.token);
          successMsg = "User deleted successfully!";
          break;
        default:
          return;
      }
      showSnack("success", successMsg);
      fetchTenantUsers(tenantId);
    } catch (err) {
      showSnack("error", err.message || "Action failed");
    } finally {
      setActionLoading(false);
      setConfirmOpen(false);
      setSelectedUser(null);
      setConfirmAction(null);
    }
  };

  // 🔹 Filtering logic
  const filteredUsers = tenantUsers.filter((u) => {
    const matchesStatus =
      filterValue === "all" ||
      (filterValue === "active" && u.is_active && !u.is_deleted) ||
      (filterValue === "inactive" && !u.is_active && !u.is_deleted) ||
      (filterValue === "deleted" && u.is_deleted);

    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // 🔹 Sorting logic
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "name" || sortField === "email") {
      aVal = aVal?.toLowerCase();
      bVal = bVal?.toLowerCase();
    } else {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterValue("all");
    setSortField("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  return {
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    sortField,
    sortOrder,
    toggleSort,
    clearFilters,
    actionLoading,
    currentPage,
    setCurrentPage,
    confirmOpen,
    setConfirmOpen,
    confirmAction,
    setConfirmAction,
    selectedUser,
    setSelectedUser,
    viewOpen,
    setViewOpen,
    snack,
    loadingUsers,
    errorUsers,
    handleAction,
    paginatedUsers,
    totalPages,
  };
};

// 🔹 View User Dialog
const ViewUserDialog = ({ open, setOpen, user }) => {
  if (!user) return null;
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enterTo="opacity-100 translate-y-0 sm:scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
      <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md bg-white p-1 text-gray-400 hover:text-gray-600 transition"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center px-6 pt-6">
          <EyeIcon className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <Dialog.Title
            as="h3"
            className="text-xl font-bold leading-6 text-gray-900 mb-1"
          >
            User Details
          </Dialog.Title>
          <p className="text-gray-500 text-sm">
            View detailed information about the selected user.
          </p>
        </div>

        {/* Content */}
        <div className="px-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            
            {/* Name */}
            <div>
              <p className="font-semibold">Name</p>
              <p className="text-gray-900">{user.email.split("@")[0]}</p>
            </div>

            {/* Email */}
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-900">{user.email || "N/A"}</p>
            </div>

            {/* Role */}
            <div>
              <p className="font-semibold">Role</p>
              <p className="text-gray-900 capitalize">{user.role || "N/A"}</p>
            </div>

            {/* Status */}
            <div>
              <p className="font-semibold">Status</p>
              {user.is_deleted ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  Deleted
                </span>
              ) : user.is_active ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                  Inactive
                </span>
              )}
            </div>

            
          </div>

          {/* Optional Notes */}
          {user.notes && (
            <div className="mt-6">
              <p className="font-semibold text-gray-700 mb-1">Notes</p>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-800 text-sm">
                {user.notes}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 mt-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Close
          </button>
        </div>

      </Dialog.Panel>
    </Transition.Child>
  </div>
</div>

      </Dialog>
    </Transition.Root>
  );
};

// 🔹 Main Component
const UsersList = () => {
  const navigate = useNavigate();
  const { tenantDetails } = useContext(TenantRequestContext);
  const {
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    sortField,
    sortOrder,
    toggleSort,
    clearFilters,
    actionLoading,
    currentPage,
    setCurrentPage,
    confirmOpen,
    setConfirmOpen,
    confirmAction,
    setConfirmAction,
    selectedUser,
    setSelectedUser,
    viewOpen,
    setViewOpen,
    snack,
    loadingUsers,
    errorUsers,
    handleAction,
    paginatedUsers,
    totalPages,
  } = useUsersList();

  const handleOpenConfirm = (user, action) => {
    setSelectedUser(user);
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  const statusOptions = [
    { value: "all", label: "All Users" },
    { value: "active", label: "Active Users" },
    { value: "inactive", label: "Inactive Users" },
    { value: "deleted", label: "Deleted Users" },
  ];

  const sortableColumns = [
    { field: "name", label: "Name" },
    { field: "email", label: "Email" },
    { field: "createdAt", label: "Created Date" },
    { field: "updatedAt", label: "Updated Date" },
  ];

  const actionName = {
    deactivate: "Deactivate",
    restore: "Restore",
    "soft-delete": "Delete",
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowsUpDownIcon className="h-4 w-4 text-gray-400" />;
    }
    if (sortOrder === "asc") {
      return <ArrowUpIconSolid className="h-4 w-4 text-gray-900" />;
    }
    return <ArrowDownIconSolid className="h-4 w-4 text-gray-900" />;
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            User Management
          </h1>
          <p className="text-md text-gray-500 mt-1">
            {tenantDetails
              ? `Tenant: ${tenantDetails.name}`
              : "Manage all users"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <button
            onClick={clearFilters}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Clear Filters
          </button>
          <button
            onClick={() => navigate("/tenant-admin/createuser")}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <div className="flex items-center gap-2">
              <UserPlusIcon className="w-5 h-5" />
              <span>Add New User</span>
            </div>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-1 md:col-span-2 lg:col-span-2 flex-1 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {/* Status filter */}
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loadingUsers ? (
          <div className="flex flex-col items-center justify-center py-12 text-blue-600">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading users...</p>
          </div>
        ) : errorUsers ? (
          <div className="text-center py-12 text-red-600 flex flex-col items-center">
            <ExclamationTriangleIcon className="w-10 h-10 mb-2" />
            <p className="font-semibold">Error fetching data</p>
            <p className="text-sm text-gray-500">{errorUsers}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {sortableColumns.map((col) => (
                    <th
                      key={col.field}
                      onClick={() => toggleSort(col.field)}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {getSortIcon(col.field)}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {u.name ||  u.email.split("@")[0]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(u.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleOpenView(u)}
                            className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="View Details"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          {u.is_active && !u.is_deleted && (
                            <button
                              onClick={() => handleOpenConfirm(u, "deactivate")}
                              className="cursor-pointer p-2 text-yellow-600 hover:bg-yellow-50 rounded-full"
                              title="Deactivate"
                            >
                              <UserMinusIcon className="w-5 h-5" />
                            </button>
                          )}
                          {!u.is_active && !u.is_deleted && (
                            <button
                              onClick={() => handleOpenConfirm(u, "restore")}
                              className="cursor-pointer p-2 text-green-600 hover:bg-green-50 rounded-full"
                              title="Restore"
                            >
                              <UserPlusIcon className="w-5 h-5" />
                            </button>
                          )}
                          {!u.is_deleted && (
                            <button
                              onClick={() =>
                                handleOpenConfirm(u, "soft-delete")
                              }
                              className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-full"
                              title="Delete"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="cursor-pointer px-6 py-12 text-center text-gray-500 text-lg"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {paginatedUsers.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav
            className="inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="cursor-pointer px-3 py-2 border rounded-l-md text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="cursor-pointer px-3 py-2 border rounded-r-md text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Snackbar */}
      <Transition
        show={snack.open}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 ${
            snack.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {snack.type === "success" ? (
            <CheckCircleIcon className="h-6 w-6" />
          ) : (
            <ExclamationTriangleIcon className="h-6 w-6" />
          )}
          <span>{snack.msg}</span>
        </div>
      </Transition>

      {/* Confirm Dialog */}
      <Transition.Root show={confirmOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setConfirmOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold leading-6 text-gray-900"
                    >
                      Confirm {actionName[confirmAction] || "Action"}
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={() => setConfirmOpen(false)}
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="text-center sm:mt-0">
                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
                    <div className="mt-3 text-center sm:mt-5">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to{" "}
                        <span className="font-semibold text-red-600">
                          {actionName[confirmAction]}
                        </span>{" "}
                        the user:{" "}
                        <span className="font-semibold text-gray-900">
                          {selectedUser?.name || selectedUser?.email}
                        </span>
                        ?
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleAction}
                      className="cursor-pointer inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 sm:ml-3 sm:w-auto"
                    >
                      {actionLoading ? "Processing..." : "Confirm"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmOpen(false)}
                      className="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* View User Dialog */}
      <ViewUserDialog open={viewOpen} setOpen={setViewOpen} user={selectedUser} />
    </div>
  );
};

export default UsersList;