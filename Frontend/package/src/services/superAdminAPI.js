const API_BASE_URL = "http://localhost:5000";

async function apiRequest(endpoint, method = "GET", body = null, headers = {}) {
  const token = localStorage.getItem("token"); // SuperAdmin token
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "API request failed");
  }
  return data;
}

// SUPER ADMIN TENANT API
export const superAdmin = {
  // List all tenant requests
  list: () => apiRequest("/tenant-requests", "GET"),
  // Get details of a single tenant request by ID
  getById: (id) => apiRequest(`/tenant-requests/${id}`, "GET"),
  // Approve or reject a tenant request
  updateStatus: (requestId, action, reviewerId) =>
    apiRequest(`/tenant-requests/review-request`, "PUT", {
      requestId,
      action, // "approved" or "rejected"
      reviewerId, // super admin user ID
    }),
  // Soft delete a tenant request
  softDelete: (id) => apiRequest(`/tenant-requests/${id}`, "DELETE"),
  // Restore a soft-deleted tenant request
  restore: (id) => apiRequest(`/tenant-requests/${id}/restore`, "PATCH"),
};
