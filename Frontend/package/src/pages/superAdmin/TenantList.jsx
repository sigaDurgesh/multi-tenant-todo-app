import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { superAdmin } from "../../services/superAdminAPI";

// Import icons from react-icons
import {
  MdVisibility,
  MdBlock,
  MdRestore,
  MdDelete,
  MdSearch,
  MdClose,
  MdFilterList,
  MdMoreVert,
  MdCheckCircle,
  MdCancel,
  MdPending,
} from "react-icons/md";
import PaginationComponent from "../../components/PaginationComponent";
import { MdAdd } from "react-icons/md";
import TenantRequestContext from "../../context/TenantRequestContext";
// Helper for safe date formatting
const safeFormatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

// Custom Modal Component
const CustomModal = ({
  open,
  title,
  children,
  actions,
  onClose,
  size = "md",
}) => {
  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} mx-auto relative transform transition-all`}
      >
        <div className="p-6">
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <MdClose size={20} />
          </button>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 pr-8">
            {title}
          </h3>
          {children}
        </div>
        {actions && (
          <div className="flex justify-end p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// Dropdown Filter Component
const FilterDropdown = ({ filter, setFilter, counts }) => {
  const [isOpen, setIsOpen] = useState(false);
const{pendingRequests} = useContext(TenantRequestContext);
console.log(pendingRequests)
  const filterOptions = [
    {
      value: "all",
      label: "All Tenants",
      icon: MdFilterList,
      count: counts.all,
    },
    {
      value: "active",
      label: "Active",
      icon: MdCheckCircle,
      count: counts.active,
      color: "text-green-600",
    },
    {
      value: "inactive",
      label: "Inactive",
      icon: MdCancel,
      count: counts.inactive,
      color: "text-gray-600",
    },
    
    {
      value: "pending",
      label: "Pending",
      icon: MdPending,
      count: pendingRequests.length,
      color: "text-yellow-600",
    },
    {
      value: "deleted",
      label: "Deleted",
      icon: MdDelete,
      count: counts.deleted,
      color: "text-red-600",
    },
  ];

  const selectedOption = filterOptions.find(
    (option) => option.value === filter
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
      >
        <selectedOption.icon
          size={18}
          className={selectedOption.color || "text-gray-600"}
        />
        <span className="font-medium text-gray-700">
          {selectedOption.label}
        </span>
        <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">
          {selectedOption.count}
        </span>
      </button>

      {isOpen && (
        <div className=" cursor-pointer absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setFilter(option.value);
                setIsOpen(false);
              }}
              className={`cursor-pointer w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                filter === option.value
                  ? "bg-blue-50 border-r-2 border-blue-500"
                  : ""
              }`}
            >
              <option.icon
                size={18}
                className={option.color || "text-gray-600"}
              />
              <span className="font-medium text-gray-700 flex-1 text-left">
                {option.label}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  filter === option.value
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ tenant }) => {
  if (tenant.is_deleted) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
        <MdDelete size={14} className="mr-1" />
        Deleted
      </span>
    );
  }

  if (tenant.is_pending) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
        <MdPending size={14} className="mr-1" />
        Pending
      </span>
    );
  }

  if (tenant.is_active) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        <MdCheckCircle size={14} className="mr-1" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
      <MdCancel size={14} className="mr-1" />
      Inactive
    </span>
  );
};

const ActionDropdown = ({ tenant, onView, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropRef = useRef(null);

  const getAvailableActions = () => {
    const actions = [
      {
        key: "view",
        label: "View Details",
        icon: MdVisibility,
        color: "text-blue-600",
      },
    ];

    if (tenant.is_deleted) {
      actions.push({
        key: "restore",
        label: "Restore Tenant",
        icon: MdRestore,
        color: "text-green-600",
      });
    } else if (tenant.is_pending) {
      actions.push(
        {
          key: "approve",
          label: "Approve",
          icon: MdCheckCircle,
          color: "text-green-600",
        },
        {
          key: "reject",
          label: "Reject",
          icon: MdCancel,
          color: "text-red-600",
        }
      );
    } else if (tenant.is_active) {
      actions.push(
        {
          key: "deactivate",
          label: "Deactivate",
          icon: MdBlock,
          color: "text-yellow-600",
        },
        {
          key: "delete",
          label: "Delete",
          icon: MdDelete,
          color: "text-red-600",
        }
      );
    } else {
      actions.push(
        {
          key: "activate",
          label: "Activate",
          icon: MdRestore,
          color: "text-green-600",
        },
        {
          key: "delete",
          label: "Delete",
          icon: MdDelete,
          color: "text-red-600",
        }
      );
    }

    return actions;
  };

  const actions = getAvailableActions();

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current && dropRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const dropHeight = dropRef.current.offsetHeight;
      const dropWidth = dropRef.current.offsetWidth;

      let top = btnRect.bottom;
      let left = btnRect.right - dropWidth;

      const spaceBelow = window.innerHeight - btnRect.bottom;
      const spaceAbove = btnRect.top;
      const spaceRight = window.innerWidth - btnRect.right;

      // Show above if not enough space below
      if (spaceBelow < dropHeight && spaceAbove > dropHeight) {
        top = btnRect.top - dropHeight;
      }

      // Show to the left if not enough space on right
      if (spaceRight < dropWidth) {
        left = btnRect.left - dropWidth + btnRect.width; // align to left of button
      }

      setDropdownPos({ top, left });
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      {/* Trigger button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className=" cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <MdMoreVert size={20} className="text-gray-600" />
      </button>

      {isOpen && (
        <>
          {/* Dropdown */}
          <div
            ref={dropRef}
            className="fixed z-[9999] w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
              minWidth: "12rem",
            }}
          >
            {actions.map((action) => (
              <button
                key={action.key}
                onClick={() => {
                  if (action.key === "view") onView(tenant);
                  else onAction({ tenant, type: action.key });
                  setIsOpen(false);
                }}
                className={`cursor-pointer w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                  action.key === "delete" || action.key === "reject"
                    ? "hover:bg-red-50"
                    : ""
                }`}
              >
                <action.icon size={16} className={action.color} />
                <span className="text-sm font-medium text-gray-700">
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          {/* Overlay */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-2 transform transition-all animate-slide-in-right max-w-sm`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="cursor-pointer text-white hover:text-gray-200">
        <MdClose size={18} />
      </button>
    </div>
  );
};

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmAction, setConfirmAction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmLoading, setConfirmLoading] = useState(false);


  const navigate = useNavigate();

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Fetch tenants from API
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await superAdmin.totalTenantCount();

      const tenantsWithDefaults = (data.tenants || []).map((t) => ({
        ...t,
        is_deleted: t.is_deleted || false,
        is_active: t.is_active !== undefined ? t.is_active : true,
        is_pending: t.is_pending || false,
        createdAt: t.createdAt || null,
        updatedAt: t.updatedAt || null,
        deletedAt: t.deletedAt || null,
        userCount: t.userCount || 0,
      }));

      setTenants(tenantsWithDefaults);
    } catch (err) {
      console.error("Failed to fetch tenants:", err);
      showToast("Failed to fetch tenants.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Filter tenants based on state and search query
  // const filteredTenants = tenants.filter((t) => {
  //   const matchesFilter =
  //     filter === "all" ||
  //     (filter === "active" && t.is_active && !t.is_deleted && !t.is_pending) ||
  //     (filter === "inactive" &&
  //       !t.is_active &&
  //       !t.is_deleted &&
  //       !t.is_pending) ||
  //     (filter === "pending" && t.is_pending && !t.is_deleted) ||
  //     (filter === "deleted" && t.is_deleted);

  //   const matchesSearch =
  //     searchQuery === "" ||
  //     t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     t.email?.toLowerCase().includes(searchQuery.toLowerCase());

  //   return matchesFilter && matchesSearch;
  // });


  const { pendingRequests,superAdminId } = useContext(TenantRequestContext);
console.log(pendingRequests)

const filteredTenants =
  filter === "pending"
    ? pendingRequests.map((req) => ({
        id: req.id,
        name: req.tenant_name,
        email: req.requester.email || "N/A",
        is_pending: true,
        is_deleted: false,
        is_active: false,
        userCount: req.userCount || 0,
        requested_at: req.requested_at,
      }))
    : tenants.filter((t) => {
        const matchesFilter =
          filter === "all" ||
          (filter === "active" && t.is_active && !t.is_deleted && !t.is_pending) ||
          (filter === "inactive" && !t.is_active && !t.is_deleted && !t.is_pending) ||
          (filter === "deleted" && t.is_deleted);

        const matchesSearch =
          searchQuery === "" ||
          t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.email?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
      });

  // Calculate counts for each filter
  const getCounts = () => {
    return {
      all: tenants.length,
      active: tenants.filter(
        (t) => t.is_active && !t.is_deleted && !t.is_pending
      ).length,
      inactive: tenants.filter(
        (t) => !t.is_active && !t.is_deleted && !t.is_pending
      ).length,
      pending: tenants.filter((t) => t.is_pending && !t.is_deleted).length,
      deleted: tenants.filter((t) => t.is_deleted).length,
    };
  };

  // Action handler with confirmation
  const confirmAndExecute = async () => {
    if (!confirmAction) return;

        setConfirmLoading(true); // Start loading

    const { tenant, type } = confirmAction;
    try {
      let apiCall;
      switch (type) {
        case "deactivate":
          apiCall = superAdmin.deactive(tenant.id);
          break;
        case "activate":
        case "restore":
          apiCall = superAdmin.activate(tenant.id);
          break;
        case "delete":
          apiCall = superAdmin.softDelete(tenant.id);
          break;
        // case "approve":
        //   apiCall = superAdmin.approve(tenant.id);
        //   break;
        // case "reject":
        //   apiCall = superAdmin.reject(tenant.id);
        //   break;
        // New unified API for approve/reject
      case "approve":
      case "reject": {
        const action = type === "approve" ? "approved" : "rejected";
        const reviewerId = superAdminId; // replace with actual logged-in super admin ID
        apiCall = superAdmin.updateStatus(tenant.id, action, reviewerId);
        break;
      }
        default:
          return;
      }

      await apiCall;
      showToast("Action completed successfully!");
      fetchTenants(); // Re-fetch all tenants to ensure data consistency
      
         // Full page reload
         setTimeout(() => {
  window.location.reload();
}, 2000);
    } catch (err) {
      console.error(err);
      showToast("Action failed. Please try again.", "error");
    } finally {
          setConfirmLoading(false); // Stop loading

      setConfirmAction(null);
    }
  };

  const handleView = (tenant) => setSelectedTenant(tenant);
  const handleCloseView = () => setSelectedTenant(null);

  // Get action confirmation text
  const getActionConfirmText = () => {
    if (!confirmAction) return "";

    const { type, tenant } = confirmAction;
    const actionTexts = {
      deactivate: "deactivate",
      activate: "activate",
      delete: "delete",
      restore: "restore",
      approve: "approve",
      reject: "reject",
    };

    return `Are you sure you want to ${actionTexts[type]} tenant "${tenant.name}"?`;
  };

  // Pagination logic on filtered data
  const totalPages = Math.ceil(filteredTenants.length / rowsPerPage);
  const indexOfLastTenant = currentPage * rowsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - rowsPerPage;
  const tenantsToDisplay = filteredTenants.slice(
    indexOfFirstTenant,
    indexOfLastTenant
  );

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading tenants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tenant Management
            </h1>
            <p className="text-gray-600">
              Manage and monitor all tenant accounts
            </p>
          </div>
          <button
            onClick={() => navigate("/superAdmin/create")}
            className="cursor-pointer mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm font-medium"
          >
            <MdAdd size={20} className="mr-2" />
            Create New Tenant
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <FilterDropdown
              filter={filter}
              setFilter={setFilter}
              counts={getCounts()}
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">{tenantsToDisplay.length}</span> of{" "}
            <span className="font-semibold">{filteredTenants.length}</span>{" "}
            filtered tenants
          </p>
        </div>

        {/* Tenant Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tenant Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {tenantsToDisplay.length > 0 ? (
                  tenantsToDisplay.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* Tenant details */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {tenant.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tenant.email}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge tenant={tenant} />
                      </td>

                      {/* Users */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tenant.userCount}
                        </div>
                        <div className="text-sm text-gray-500">Total users</div>
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {safeFormatDate(tenant.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right relative">
                        <ActionDropdown
                          tenant={tenant}
                          onView={handleView}
                          onAction={setConfirmAction}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  // Empty state
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <MdSearch size={48} className="text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No tenants found
                        </h3>
                        <p className="text-gray-500">
                          {searchQuery
                            ? "Try adjusting your search terms"
                            : "No tenants match the current filter"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination + Summary */}
          {filteredTenants.length > 0 && (
            <div>
              <div className="cursor-pointer px-6 py-3 text-sm text-gray-600 border-t border-gray-200 bg-gray-50">
                Showing {indexOfFirstTenant + 1} –{" "}
                {Math.min(indexOfLastTenant, filteredTenants.length)} of{" "}
                {filteredTenants.length} tenants
              </div>

              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              />
            </div>
          )}
        </div>

        {/* View Tenant Modal */}
        <CustomModal
          open={!!selectedTenant}
          title="Tenant Details"
          onClose={handleCloseView}
          size="lg"
          actions={
            <button
              onClick={handleCloseView}
              className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          }
        >
          {selectedTenant && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Tenant Name
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedTenant.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Admin Email
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedTenant.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Total Users
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedTenant.userCount}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Status
                  </label>
                  <div className="mt-1">
                    <StatusBadge tenant={selectedTenant} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Created Date
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {safeFormatDate(selectedTenant.createdAt)}
                  </p>
                </div>
                {selectedTenant.updatedAt && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Last Updated
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {safeFormatDate(selectedTenant.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
              {selectedTenant.is_deleted && selectedTenant.deletedAt && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <label className="text-sm font-semibold text-red-800">
                    Deleted Date
                  </label>
                  <p className="text-sm text-red-700 mt-1">
                    {safeFormatDate(selectedTenant.deletedAt)}
                  </p>
                </div>
              )}
            </div>
          )}
        </CustomModal>

        {/* Confirmation Modal */}
        <CustomModal
          open={!!confirmAction}
          title="Confirm Action"
          onClose={() => setConfirmAction(null)}
          actions={
            <>
              <button
                onClick={() => setConfirmAction(null)}
                className=" cursor-pointer px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
  onClick={confirmAndExecute}
  disabled={confirmLoading} // prevent double click
  className={`cursor-pointer px-4 py-2 rounded-lg transition-colors font-medium ${
    confirmAction?.type === "delete" || confirmAction?.type === "reject"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-blue-600 text-white hover:bg-blue-700"
  } flex items-center justify-center`}
>
  {confirmLoading ? (
    <svg
      className="animate-spin h-5 w-5 text-white"
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  ) : (
    "Confirm"
  )}
</button>

            </>
          }
        >
          <div className="flex items-start space-x-3">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                confirmAction?.type === "delete" ||
                confirmAction?.type === "reject"
                  ? "bg-red-100"
                  : "bg-blue-100"
              }`}
            >
              {confirmAction?.type === "delete" ||
              confirmAction?.type === "reject" ? (
                <MdDelete className="w-5 h-5 text-red-600" />
              ) : (
                <MdCheckCircle className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium mb-1">
                {getActionConfirmText()}
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </CustomModal>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default TenantList;
