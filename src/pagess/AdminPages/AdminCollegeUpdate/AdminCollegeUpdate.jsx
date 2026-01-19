"use client";
import React, { useEffect, useState } from "react";
import { UseAdminCollegeUpdate } from "./UseAdminCollegeUpdate"; // Adjust path
import AdminLayout from "@/components/AdminComponents/AdminLayout";
import {
  Building2,
  Mail,
  Phone,
  User,
  Lock,
  MapPin,
  UploadCloud,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Skeleton from "@/components/FormComponents/Skeleton";

function AdminCollegeUpdate() {
  const [isFetching, setIsFetching] = useState(true); // simulate fetching existing data

  const {
    formik,
    isLoading,
    error,
    successMessage,
    logoPreview,
    handleFileChange,
    setLogoPreview, // <- ensure this is exposed from UseAdminCollegeUpdate
  } = UseAdminCollegeUpdate();

  useEffect(() => {
    const timer = setTimeout(() => setIsFetching(false), 1500); // Simulate API loading
    return () => clearTimeout(timer);
  }, []);

  const inputStyle =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out";

  const labelStyle = "block mb-2 text-sm font-medium text-gray-700";
  const messageStyle = "text-sm mt-1 flex items-center gap-1 font-medium";

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 flex items-center justify-center gap-3">
            <Building2 size={32} className="text-purple-600" />
            {isFetching ? (
              <Skeleton width="w-52" height="h-8" />
            ) : (
              "Update College Details"
            )}
          </h1>

          {error && !isFetching && (
            <p className={`text-red-600 ${messageStyle} justify-center mb-6`}>
              <AlertCircle size={20} /> {error}
            </p>
          )}
          {successMessage && !isFetching && (
            <p className={`text-green-600 ${messageStyle} justify-center mb-6`}>
              <CheckCircle size={20} /> {successMessage}
            </p>
          )}

          {isFetching ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx}>
                    <Skeleton width="w-40" height="h-5" />
                    <Skeleton height="h-10" />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Skeleton width="w-40" height="h-5" />
                <Skeleton height="h-24" />
              </div>

              <div className="space-y-4">
                <Skeleton width="w-40" height="h-5" />
                <Skeleton height="h-32" rounded="rounded-xl" />
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <Skeleton width="w-40" height="h-12" />
              </div>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7 border-b border-gray-200 pb-8">
                <h3 className="md:col-span-2 text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Mail size={22} className="text-purple-500" /> Contact & Credentials
                </h3>

                {[
                  { id: "name", label: "College Name", type: "text", placeholder: "e.g., Alversity College" },
                  { id: "email", label: "Email", type: "email", placeholder: "e.g., info@college.edu" },
                  { id: "mobNo", label: "Mobile No", type: "tel", placeholder: "e.g., +91 9876543210" },
                  { id: "userName", label: "Username", type: "text", placeholder: "e.g., alversityadmin" },
                  { id: "password", label: "New Password (optional)", type: "password", placeholder: "Enter new password" },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className={labelStyle}>
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      name={field.id}
                      placeholder={field.placeholder}
                      className={inputStyle}
                      {...formik.getFieldProps(field.id)}
                    />
                    {formik.touched[field.id] && formik.errors[field.id] && (
                      <p className={`text-red-600 ${messageStyle}`}>{formik.errors[field.id]}</p>
                    )}
                  </div>
                ))}

                <div>
                  <label htmlFor="status" className={labelStyle}>Status</label>
                  <select
                    id="status"
                    name="status"
                    className={inputStyle}
                    {...formik.getFieldProps("status")}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <p className={`text-red-600 ${messageStyle}`}>{formik.errors.status}</p>
                  )}
                </div>
              </div>

              {/* Address & Logo Section */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-7">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={22} className="text-purple-500" /> Location & Branding
                </h3>

                <div>
                  <label htmlFor="address" className={labelStyle}>Address</label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    className={`${inputStyle} resize-y`}
                    placeholder="Full address with pin code"
                    {...formik.getFieldProps("address")}
                  ></textarea>
                  {formik.touched.address && formik.errors.address && (
                    <p className={`text-red-600 ${messageStyle}`}>{formik.errors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="file" className={labelStyle}>Update College Logo</label>
                  <div
                    className={`flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-gray-50 transition duration-200 ease-in-out
                    ${
                      formik.errors.file && formik.touched.file
                        ? "border-2 border-red-500 ring-2 ring-red-200"
                        : "border-2 border-dashed border-gray-300 hover:border-purple-400"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="file"
                      name="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {logoPreview ? (
                      <div className="flex items-center gap-4">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-20 h-20 object-cover rounded-full border-4 border-purple-200 shadow-md"
                        />
                        <div className="flex flex-col">
                          <span className="text-gray-700 text-sm font-medium">Logo Selected!</span>
                          <button
                            type="button"
                            onClick={() => {
                              formik.setFieldValue("file", null);
                              setLogoPreview(null); 
                            }}
                            className="mt-1 text-sm text-red-500 hover:text-red-700"
                          >
                            Remove Logo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="file"
                        className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md"
                      >
                        <UploadCloud size={20} /> Choose New Logo
                      </label>
                    )}
                  </div>
                  {formik.touched.file && formik.errors.file && (
                    <p className={`text-red-600 ${messageStyle}`}>{formik.errors.file}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full sm:w-auto py-3 px-8 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ease-in-out
                  ${isLoading
                    ? "bg-purple-300 text-purple-700 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700 transform hover:-translate-y-0.5 hover:shadow-xl"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save size={20} /> Update College
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCollegeUpdate;
