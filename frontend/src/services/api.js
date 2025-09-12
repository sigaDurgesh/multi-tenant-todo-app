const API_BASE_URL = "http://localhost:5000";

async function apiRequest(endpoint, method = "GET", body = null, headers = {}) {
  const token = sessionStorage.getItem("token");
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

export const authApi = {
  login: (credentials) => apiRequest("/api/auth/login", "POST", credentials),
  forgotPassword: (email) =>
    apiRequest("/api/auth/change-password", "POST", { email }),
  resetPassword: (token, newPassword) =>
    apiRequest(`/api/auth/reset-password/${token}`, "POST", { newPassword }),
  // CHANGE PASSWORD (requires Authorization: Bearer <token>)
  changePassword: (newPassword) =>
    apiRequest("/api/auth/change-password", "PATCH", { newPassword }),
};

