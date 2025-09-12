import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { tenantApi } from "../../services/tenantAdminAPI";
import {
  MdDashboard,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdVisibility,
  MdRefresh,
  MdBusiness,
  MdSearch,
  MdClose,
  MdTrendingUp,
  MdGroup,
  MdNotifications,
  MdSettings,
  MdMoreVert,
  MdFilterList,
  MdDownload,
  MdInfo,
  MdWarning,
  MdError,
} from 'react-icons/md';
import PaginationComponent from "../../components/PaginationComponent";

// Custom Modal Component
const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto relative transform transition-all">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MdClose size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          {children}
        </div>
        {actions && (
          <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getToastIcon = () => {
    switch (type) {
      case 'success':
        return <MdCheckCircle size={20} />;
      case 'error':
        return <MdError size={20} />;
      case 'warning':
        return <MdWarning size={20} />;
      default:
        return <MdInfo size={20} />;
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 ${getToastStyles()} px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3 transform transition-all animate-slide-in-right max-w-sm`}>
      {getToastIcon()}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <MdClose size={16} />
      </button>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, gradient, change, changeType }) => (
  <div className={`${gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 text-sm ${changeType === 'increase' ? 'text-green-200' : 'text-red-200'}`}>
            <MdTrendingUp size={16} className="mr-1" />
            <span>{change}% from last month</span>
          </div>
        )}
      </div>
      <div className="bg-white/20 rounded-2xl p-4">
        <Icon size={32} />
      </div>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <MdCheckCircle size={14} />;
      case 'pending':
        return <MdPending size={14} />;
      case 'rejected':
        return <MdCancel size={14} />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles()}`}>
      {getStatusIcon()}
      <span className="ml-1 capitalize">{status}</span>
    </span>
  );
};


const SuperAdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d) ? "N/A" : d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchTenants = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await tenantApi.list();
      setTenants(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch tenants", 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
    const interval = setInterval(fetchTenants, 100000);
    return () => clearInterval(interval);
  }, [fetchTenants]);

  const filteredTenants = tenants.filter(
    (t) =>
      (statusFilter === "all" || t.status === statusFilter) &&
      (t.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.requester?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStatusUpdate = async (tenantId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this tenant?`))
      return;
    try {
      await tenantApi.updateStatus(tenantId, newStatus);
      showToast(`Tenant ${newStatus} successfully`);
      fetchTenants();
    } catch (err) {
      showToast("Update failed", 'error');
    }
  };

  const totalApproved = tenants.filter((t) => t.status === "approved").length;
  const totalPending = tenants.filter((t) => t.status === "pending").length;
  const totalRejected = tenants.filter((t) => t.status === "rejected").length;

  const getTabContent = () => {
    switch (currentTab) {
      case 0: // All Tenants
        return filteredTenants;
      case 1: // Pending Requests
        return tenants.filter((t) => t.status === "pending");
      case 2: // Recent Activity
        return tenants
          .slice()
          .sort((a, b) => new Date(b.reviewed_at || b.requested_at) - new Date(a.reviewed_at || a.requested_at))
          .slice(0, 10);
      default:
        return filteredTenants;
    }
  };

  const handleViewDetails = (tenant) => {
    setSelectedTenant(tenant);
    setDialogOpen(true);
  };


  const [currentPage, setCurrentPage] = useState(1);
  const tenantsPerPage = 5; // you can change this

  // ✅ Paginate data
  const tenantsToDisplay = getTabContent().slice(
    (currentPage - 1) * tenantsPerPage,
    currentPage * tenantsPerPage
  );

  const totalPages = Math.ceil(getTabContent().length / tenantsPerPage);

  // Reset to page 1 when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, currentTab]);



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 rounded-2xl p-3">
                <MdDashboard size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name || "Admin"}! Monitor tenant requests in real-time.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <MdNotifications size={20} className="text-gray-600" />
              </button>
              <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <MdSettings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        {refreshing && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tenants"
            value={tenants.length}
            icon={MdBusiness}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            change="12"
            changeType="increase"
          />
          <StatsCard
            title="Approved"
            value={totalApproved}
            icon={MdCheckCircle}
            gradient="bg-gradient-to-br from-green-500 to-green-600"
            change="8"
            changeType="increase"
          />
          <StatsCard
            title="Pending"
            value={totalPending}
            icon={MdPending}
            gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
            change="5"
            changeType="decrease"
          />
          <StatsCard
            title="Rejected"
            value={totalRejected}
            icon={MdCancel}
            gradient="bg-gradient-to-br from-red-500 to-red-600"
            change="3"
            changeType="decrease"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tenants..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="cursor-pointer appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <MdFilterList className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={fetchTenants}
                className="cursor-pointer inline-flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <MdRefresh size={18} className="mr-2" />
                Refresh
              </button>
              <button className="cursor-pointer inline-flex items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                <MdDownload size={18} className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        =<div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        {currentTab === 3 ? (
          // 🔹 Analytics Tab
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <MdTrendingUp size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Trends</h3>
              <p className="text-gray-600">Weekly request volume analytics</p>
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-500">Chart visualization will be implemented here</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <MdGroup size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Status Distribution</h3>
              <p className="text-gray-600">Approved / Pending / Rejected breakdown</p>
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-500">Pie chart will be implemented here</p>
              </div>
            </div>
          </div>
        ) : (
          // 🔹 Tenant Table
          <div className="overflow-x-auto">
            {tenantsToDisplay.length === 0 ? (
              <div className="text-center py-16">
                <MdBusiness size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tenants found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No tenant requests available"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
                <table className="min-w-full table-auto">
                  {/* Table Header */}
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tenant</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Requester</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Requested At</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reviewed At</th>
                      {/* <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th> */}
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-100">
                    {tenantsToDisplay.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-gray-50 transition">
                        {/* Tenant Name */}
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {tenant.tenant_name || "Unnamed Tenant"}
                          </div>
                        </td>
                        {/* Requester */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {tenant.requester?.email || "—"}
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusBadge status={tenant.status} />
                        </td>
                        {/* Requested At */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(tenant.requested_at)}
                        </td>
                        {/* Reviewed At */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {tenant.reviewed_at ? formatDate(tenant.reviewed_at) : "—"}
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-4 text-right">{/* ...menu */}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* ✅ Pagination Below Table */}
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
      </div>

      {/* Tenant Details Modal */}
      <Modal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Tenant Details"
        actions={
          <>
            <button
              onClick={() => setDialogOpen(false)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
            {selectedTenant?.status === "pending" && (
              <>
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedTenant.id, "approved");
                    setDialogOpen(false);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedTenant.id, "rejected");
                    setDialogOpen(false);
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Reject
                </button>
              </>
            )}
          </>
        }
      >
        {selectedTenant && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTenant.tenant_name || "Unnamed Tenant"}
              </h2>
              <StatusBadge status={selectedTenant.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Requester Email</label>
                  <p className="text-gray-900 mt-1">{selectedTenant.requester?.email || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Request Date</label>
                  <p className="text-gray-900 mt-1">{formatDate(selectedTenant.requested_at)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {selectedTenant.reviewed_at && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Review Date</label>
                    <p className="text-gray-900 mt-1">{formatDate(selectedTenant.reviewed_at)}</p>
                  </div>
                )}
                {selectedTenant.reviewer?.email && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Reviewed By</label>
                    <p className="text-gray-900 mt-1">{selectedTenant.reviewer.email}</p>
                  </div>
                )}
              </div>
            </div>

            {selectedTenant.description && (
              <div>
                <label className="text-sm font-semibold text-gray-600">Description</label>
                <p className="text-gray-900 mt-1 bg-gray-50 p-4 rounded-lg">
                  {selectedTenant.description}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard;