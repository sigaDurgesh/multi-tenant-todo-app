import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { superAdmin } from "../../services/superAdminAPI";

const CreateTenant = () => {
  const [tenantName, setTenantName] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "" };

    if (!tenantName.trim()) {
      newErrors.name = "Tenant name is required";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!tenantEmail.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(tenantEmail)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await superAdmin.createTenant({
        tenantName,
        email: tenantEmail,
      });

      const data = res?.data ?? res;
      const success =
        typeof data.message === "string" &&
        !/fail|error/i.test(data.message);

      const message =
        typeof data.message === "string"
          ? data.message
          : success
          ? "Tenant admin created successfully!"
          : "Failed to create tenant admin";

      if (success) {
        toast.success(message, {
          duration: 4000,
          className: "text-base font-semibold",
        });
        setTenantName("");
        setTenantEmail("");
      } else {
        throw new Error(message);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to create tenant admin",
        {
          duration: 4000,
          className: "text-sm font-semibold text-red-600",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTenantName("");
    setTenantEmail("");
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-10 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-6 rounded-t-xl">
          <h2 className="text-2xl font-bold">Create a New Tenant</h2>
          <p className="text-sm opacity-90">Set up a new organization in a few clicks</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Tenant Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tenant Name
            </label>
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Tenant Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tenant Admin Email
            </label>
            <input
              type="email"
              value={tenantEmail}
              onChange={(e) => setTenantEmail(e.target.value)}
              placeholder="e.g. admin@acme.com"
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="border-t pt-4 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="cursor-pointer px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="cursor-pointer px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 transition"
            >
              {loading ? (
                <div className="flex items-center gap-2">
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Creating...
                </div>
              ) : (
                "Create Tenant"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTenant;
