"use client";

import React from "react";
import AdminLayout from "@/components/AdminComponents/AdminLayout";
import useAdminApiSettingCreate from "./UseAdminApiSettingCreate";

export default function AdminApiSettingCreate() {
  const { decodedApiKey, encodedApiKey, loading, error, handleChange, handleSave } = useAdminApiSettingCreate();

  return (
    <AdminLayout>
      <div className="min-h-screen px-2 py-10 bg-gray-50 text-gray-800">
        <div className="max-w-8xl mx-auto bg-white shadow-md rounded-xl p-8">
          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            API Key Management
          </h1>

          {error && <p className="text-center text-red-500 font-medium">{error}</p>}
          {loading && <p className="text-center text-purple-600 font-medium">Loading...</p>}

          <div className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="text"
                id="apiKey"
                value={decodedApiKey}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="encoded" className="block text-sm font-medium text-gray-700 mb-1">
                Encoded Key (Base64)
              </label>
              <input
                type="text"
                id="encoded"
                value={encodedApiKey}
                readOnly
                className="w-full px-4 py-2 border bg-gray-50 text-gray-600 rounded-md shadow-sm cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
              >
                Save API Key
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
