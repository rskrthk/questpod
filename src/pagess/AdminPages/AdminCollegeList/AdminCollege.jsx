// app/(admin)/admin-college/page.jsx
"use client";

import React from "react";
import AdminLayout from "@/components/AdminComponents/AdminLayout";
import { Plus } from "lucide-react";
import { UseAdminCollege } from "./UseAdminCollege";
import LightTable from "@/components/FormComponents/TableField";
import withAuth from "@/middleware/withAuth";
import Skeleton from "@/components/FormComponents/Skeleton";

function AdminCollege() {
  const {
    colleges,
    handleCreateCollege,
    columns,
    showModal,
    selectedCollege,
    handleCloseModal,
    loading,
  } = UseAdminCollege();

  return (
    <AdminLayout>
      <div className="w-full max-w-8xl mx-auto min-h-screen bg-gray-100 text-gray-800">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">College Management</h2>
          <button
            onClick={handleCreateCollege}
            className="group flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            Add College
          </button>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-4">
            <Skeleton width="w-48" height="h-5" />
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="grid grid-cols-5 gap-4">
                <Skeleton height="h-4" />
                <Skeleton height="h-4" />
                <Skeleton height="h-4" />
                <Skeleton height="h-4" />
                <Skeleton height="h-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <LightTable columns={columns} data={colleges} title="" />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAuth(AdminCollege, ["admin"]);
