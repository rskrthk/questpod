"use client";
import React, { useState, useEffect } from "react";
import { useAdminCollegeCreate } from "./UseAdminCollegeCreate";
import AdminLayout from "@/components/AdminComponents/AdminLayout";
import {
  Building2,
  Mail,
  Phone,
  Lock,
  MapPin,
  UploadCloud,
  PlusCircle,
} from "lucide-react";
import Skeleton from "@/components/FormComponents/Skeleton";
import withAuth from "@/middleware/withAuth";

 function AdminCollegeCreate() {
  const [loading, setLoading] = useState(true);

  const {
    formik,
    logoPreview,
    setLogoPreview,
    isSubmitting,
  } = useAdminCollegeCreate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // simulate loading
    return () => clearTimeout(timer);
  }, []);

  const inputStyle =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out";

  const labelStyle = "block mb-2 text-sm font-medium text-gray-700";
  const errorStyle = "text-red-600 text-sm mt-1 flex items-center gap-1";

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 flex items-center justify-center gap-3">
            <PlusCircle size={32} className="text-purple-600" />
            {loading ? <Skeleton width="w-48" height="h-8" /> : "Create New College"}
          </h2>

          {loading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                <Skeleton width="w-40" height="h-5" />
                <Skeleton height="h-10" />
                <Skeleton width="w-40" height="h-5" />
                <Skeleton height="h-10" />
                <Skeleton width="w-40" height="h-5" />
                <Skeleton height="h-10" />
                <Skeleton width="w-40" height="h-5" />
                <Skeleton height="h-10" />
              </div>

              <Skeleton width="w-40" height="h-5" />
              <Skeleton height="h-24" />

              <Skeleton width="w-40" height="h-5" />
              <Skeleton width="w-full" height="h-28" rounded="rounded-xl" />

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <Skeleton width="w-40" height="h-12" />
              </div>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7 border-b border-gray-200 pb-8">
                <h3 className="md:col-span-2 text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 size={22} className="text-purple-500" /> Basic Information
                </h3>

                <div>
                  <label htmlFor="name" className={labelStyle}>
                    College Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className={inputStyle}
                    placeholder="e.g., Alversity College of Engineering"
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className={errorStyle}>{formik.errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className={labelStyle}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className={inputStyle}
                    placeholder="e.g., info@alversity.edu"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className={errorStyle}>{formik.errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobNo" className={labelStyle}>
                    Mobile No <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="mobNo"
                    type="tel"
                    name="mobNo"
                    className={inputStyle}
                    placeholder="e.g., +91 9876543210"
                    {...formik.getFieldProps("mobNo")}
                  />
                  {formik.touched.mobNo && formik.errors.mobNo && (
                    <p className={errorStyle}>{formik.errors.mobNo}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className={labelStyle}>
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className={inputStyle}
                    placeholder="********"
                    {...formik.getFieldProps("password")}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className={errorStyle}>{formik.errors.password}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-7">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={22} className="text-purple-500" /> Location & Branding
                </h3>

                <div>
                  <label htmlFor="address" className={labelStyle}>
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    className={`${inputStyle} resize-y`}
                    placeholder="Enter full address..."
                    {...formik.getFieldProps("address")}
                  ></textarea>
                  {formik.touched.address && formik.errors.address && (
                    <p className={errorStyle}>{formik.errors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="file" className={labelStyle}>
                    Upload College Logo <span className="text-red-500">*</span>
                  </label>

                  <div
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-gray-50 transition duration-200 ease-in-out
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
                      onChange={(e) => {
                        const selected = e.currentTarget.files[0];
                        if (selected) {
                          formik.setFieldValue("file", selected);
                          setLogoPreview(URL.createObjectURL(selected));
                        } else {
                          formik.setFieldValue("file", null);
                          setLogoPreview(null);
                        }
                      }}
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
                              formik.setFieldTouched("file", true);
                            }}
                            className="mt-1 text-sm text-red-500 hover:text-red-700 transition font-medium"
                          >
                            Remove Logo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="file"
                        className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                      >
                        <UploadCloud size={20} /> Choose Logo File
                      </label>
                    )}
                  </div>

                  {formik.touched.file && formik.errors.file && (
                    <p className={errorStyle}>{formik.errors.file}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto py-3 px-8 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ease-in-out ${
                    isSubmitting
                      ? "bg-purple-300 text-purple-700 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create College"
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

export default withAuth(AdminCollegeCreate, ["admin"]);
