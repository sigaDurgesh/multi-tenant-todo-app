import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    phone: user?.phone || "+1 987 654 3210",
    role: user?.role || "user",
    tenant: user?.tenant || "N/A",
    joined: "Sep 2, 2025",
    status: "Active",
  });

  const handleSaveProfile = () => {
    setSuccessMsg("Profile updated successfully!");
    setEditMode(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">
          Manage your account details, security, and preferences.
        </p>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4 flex justify-between items-center">
          <span className="text-green-700 text-sm">{successMsg}</span>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-sm text-green-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Avatar + Info */}
          <div className="flex flex-col items-center md:border-r md:pr-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
              {profileData.name.charAt(0)}
            </div>
            <h2 className="mt-3 text-xl font-semibold text-gray-900">
              {profileData.name}
            </h2>
            <p className="text-gray-500">{profileData.email}</p>

            <span
              className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                profileData.role === "superAdmin"
                  ? "bg-red-100 text-red-700"
                  : profileData.role === "tenantAdmin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {profileData.role.toUpperCase()}
            </span>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            {editMode ? (
              <div className="space-y-5">
                {/* Editable fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <dt className="text-sm text-gray-500">Phone</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {profileData.phone}
                    </dd>
                  </div>

                  {user.role !== "superAdmin" && (
                    <div>
                      <dt className="text-sm text-gray-500">Tenant</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {profileData.tenant}
                      </dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm text-gray-500">Joined</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {profileData.joined}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          profileData.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {profileData.status}
                      </span>
                    </dd>
                  </div>
                </dl>

                {/* Action buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate("/change-pass")}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role-specific Info Cards */}
      <div className="mt-6 grid gap-4">
        {user.role === "superAdmin" && (
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold text-gray-900">
              Super Admin Privileges
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Full control over all tenants, users, and system-wide settings.
            </p>
          </div>
        )}

        {user.role === "tenantAdmin" && (
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold text-gray-900">
              Tenant Admin Information
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Manage users, assign roles, and configure tenant-level settings.
            </p>
          </div>
        )}

        {user.role === "user" && (
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold text-gray-900">
              User Information
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              View your tasks, update your profile, and request tenant access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
