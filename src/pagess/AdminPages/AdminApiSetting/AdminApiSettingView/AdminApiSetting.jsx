"use client";

import React from "react";
import AdminLayout from "@/components/AdminComponents/AdminLayout";
import useAdminApiSettingViewModel from "./UseAdminApiSetting";

export default function AdminApiSetting() {
  const {
    apiKeyInput,
    encodedKey,
    loading,
    error,
    handleChange,
    handleSave,
    handleNavigateToCreate,
  } = useAdminApiSettingViewModel();

  return (
    <AdminLayout>
      <div className="min-h-screen px-2 py-10 bg-gray-50 text-gray-800">
        <div className="max-w-8xl mx-auto bg-white shadow-md rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              API Key Settings
            </h1>
            <button
              onClick={handleNavigateToCreate}
              className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md shadow hover:bg-purple-700 transition"
            >
              + Create New
            </button>
          </div>

          {error && (
            <p className="text-center text-red-500 font-medium">{error}</p>
          )}

          {loading ? (
            <p className="text-center text-purple-600 font-medium">
              Loading...
            </p>
          ) : (
            <div className="space-y-6">
              {/* API Key Input */}
              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  API Key
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKeyInput}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Base64 Encoded Output */}
              <div>
                <label
                  htmlFor="encodedKey"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Base64 Encoded Key
                </label>
                <input
                  type="text"
                  id="encodedKey"
                  value={encodedKey}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
