"use client";

import React from "react";
import Image from "next/image";
import AdminLayout from "@/components/AdminComponents/AdminLayout";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  UploadCloud,
  Loader2,
  Info,
  Settings,
  XCircle,
  Save,
} from "lucide-react";
import Skeleton from "@/components/FormComponents/Skeleton";
import useAdminProfileViewModel from "./useAdminProfileViewModel";
import withAuth from "@/middleware/withAuth";

const labelStyle = "block text-sm font-medium text-purple-700 mb-1";
const inputWrapperStyle =
  "w-full border border-purple-200 rounded-lg px-4 py-2 bg-purple-50 text-gray-800 shadow-sm text-base";
const inputFieldStyle = "bg-transparent outline-none w-full";

function AdminProfile() {
  const {
    profile,
    loading,
    error,
    logoSrc,
    uploading,
    handleLogoChange,
    handleProfileSubmit,
    editableData,
    handleChange,
  } = useAdminProfileViewModel();

  const flexCenterStyle = "flex flex-col items-center justify-center py-20";
  const textLoadingErrorStyle = "text-lg font-semibold text-gray-700";

  if (error) {
    return (
      <AdminLayout>
        <div className={`${flexCenterStyle} text-red-600`}>
          <XCircle size={48} className="mb-4" />
          <p className={textLoadingErrorStyle}>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 flex items-center justify-center gap-3">
            <Settings size={32} className="text-purple-600" />
            {loading ? (
              <Skeleton width="w-64" height="h-8" />
            ) : (
              "Profile Settings"
            )}
          </h2>

          <div className="space-y-8">
            {/* Profile Image Section */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={22} className="text-purple-500" /> Account
              </h3>

              <div className="flex items-center gap-6 flex-wrap">
                {/* Avatar */}
                {loading ? (
                  <Skeleton width="w-24" height="h-24" rounded="rounded-full" />
                ) : (
                  <div className="w-24 h-24 relative rounded-full overflow-hidden border-4 border-purple-200 shadow-md flex-shrink-0">
                    <Image
                      src={logoSrc}
                      alt="Profile Picture"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {loading ? (
                    <>
                      <Skeleton width="w-40" height="h-10" />
                      <Skeleton width="w-64" height="h-4" />
                    </>
                  ) : (
                    <>
                      <label className="inline-flex items-center gap-2 px-5 py-2.5 text-sm bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md">
                        <UploadCloud size={18} />
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>

                      {uploading && (
                        <div className="flex items-center gap-2 text-sm text-purple-500 font-medium">
                          <Loader2 size={16} className="animate-spin" />
                          Uploading...
                        </div>
                      )}

                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Info size={14} className="flex-shrink-0" />
                        Recommended: JPEG, PNG, or GIF. Ideal size: 200x200
                        pixels. Max 5MB.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Editable Info Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Info size={22} className="text-purple-500" /> Personal
                Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx}>
                      <Skeleton width="w-24" height="h-4" />
                      <Skeleton height="h-10" />
                    </div>
                  ))
                ) : (
                  <>
                    {[
                      {
                        label: "Name",
                        name: "name",
                        icon: <User size={20} className="text-purple-400" />,
                        type: "text",
                      },
                      {
                        label: "Email",
                        name: "email",
                        icon: <Mail size={20} className="text-purple-400" />,
                        type: "email",
                      },
                      {
                        label: "Phone No",
                        name: "mobNo",
                        icon: <Phone size={20} className="text-purple-400" />,
                        type: "tel",
                      },
                      // {
                      //   label: "Role",
                      //   name: "role",
                      //   icon: <Briefcase size={20} className="text-purple-400" />,
                      //   disabled: true,
                      // },
                    ].map(({ label, name, icon, type = "text", disabled }) => (
                      <div key={name}>
                        <label className={labelStyle}>{label}</label>
                        <div
                          className={`${inputWrapperStyle} flex items-center gap-3`}
                        >
                          {icon}
                          <input
                            type={type}
                            name={name}
                            disabled={disabled}
                            value={editableData[name] || ""}
                            onChange={handleChange}
                            className={inputFieldStyle}
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Save Button */}
              {!loading && (
                <div className="pt-6 flex justify-end">
                  <button
                    onClick={handleProfileSubmit}
                    disabled={uploading}
                    className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                      uploading
                        ? "bg-purple-300 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save size={18} />
                        Save Changes
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(AdminProfile, ["admin"]);
