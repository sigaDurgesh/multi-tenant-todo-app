const API_BASE_URL = "http://localhost:5000";

async function apiRequest(endpoint, method = "GET", body = null, headers = {}) {
  const token = localStorage.getItem("token");
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

export const tenantApi = {
  list: () => apiRequest("/tenant-requests", "GET"),
  getById: (id) => apiRequest(`/tenant-requests/${id}`, "GET"),
  getUsers: (id) => apiRequest(`/tenant-requests/users/${id}`, "GET"), // 👈 new
  updateStatus: (requestId, action, reviewerId) =>
    apiRequest(`/tenant-requests/review-request`, "PUT", {
      requestId,
      action,
      reviewerId,
    }),
  softDelete: (id) => apiRequest(`/tenant-requests/${id}`, "DELETE"),
  restore: (id) => apiRequest(`/tenant-requests/${id}/restore`, "PATCH"),
};
