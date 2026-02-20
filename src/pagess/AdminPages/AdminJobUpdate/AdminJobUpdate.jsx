"use client";
import React, { useState, useEffect } from "react";
import { useAdminJobUpdate } from "./UseAdminJobUpdate";
import AdminLayout from "@/components/AdminComponents/AdminLayout";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Link as LinkIcon,
  FileText,
  Edit,
  Building,
  Clock,
  Code,
  Calendar,
  Image as ImageIcon,
  HelpCircle,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Skeleton from "@/components/FormComponents/Skeleton";
import withAuth from "@/middleware/withAuth";

function AdminJobUpdate() {
  const { formik, isLoading, loadingData } = useAdminJobUpdate();

  const inputStyle =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out";

  const labelStyle = "block mb-2 text-sm font-medium text-gray-700";
  const errorStyle = "text-red-600 text-sm mt-1 flex items-center gap-1";

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200 max-w-4xl mx-auto mt-6">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 flex items-center justify-center gap-3">
            <Edit size={32} className="text-purple-600" />
            {loadingData ? <Skeleton width="w-48" height="h-8" /> : "Update Job"}
          </h2>

          {loadingData ? (
             <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                 <Skeleton width="w-40" height="h-5" />
                 <Skeleton height="h-10" />
                 <Skeleton width="w-40" height="h-5" />
                 <Skeleton height="h-10" />
               </div>
               <Skeleton width="w-40" height="h-5" />
               <Skeleton height="h-24" />
             </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7 border-b border-gray-200 pb-8">
                <h3 className="md:col-span-2 text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Briefcase size={22} className="text-purple-500" /> Basic Information
                </h3>

                <div>
                  <label htmlFor="title" className={labelStyle}>
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    className={inputStyle}
                    placeholder="e.g., Software Engineer"
                    {...formik.getFieldProps("title")}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className={errorStyle}>{formik.errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className={labelStyle}>
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      id="company"
                      type="text"
                      name="company"
                      className={`${inputStyle} pl-10`}
                      placeholder="e.g., Tech Corp"
                      {...formik.getFieldProps("company")}
                    />
                  </div>
                  {formik.touched.company && formik.errors.company && (
                    <p className={errorStyle}>{formik.errors.company}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location" className={labelStyle}>
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      id="location"
                      type="text"
                      name="location"
                      className={`${inputStyle} pl-10`}
                      placeholder="e.g., Remote / New York"
                      {...formik.getFieldProps("location")}
                    />
                  </div>
                  {formik.touched.location && formik.errors.location && (
                    <p className={errorStyle}>{formik.errors.location}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="type" className={labelStyle}>
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    className={inputStyle}
                    {...formik.getFieldProps("type")}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                  {formik.touched.type && formik.errors.type && (
                    <p className={errorStyle}>{formik.errors.type}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="salary" className={labelStyle}>
                    Salary Range
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      id="salary"
                      type="text"
                      name="salary"
                      className={`${inputStyle} pl-10`}
                      placeholder="e.g., $100k - $120k"
                      {...formik.getFieldProps("salary")}
                    />
                  </div>
                  {formik.touched.salary && formik.errors.salary && (
                    <p className={errorStyle}>{formik.errors.salary}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="applicationLink" className={labelStyle}>
                    Application Link
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      id="applicationLink"
                      type="text"
                      name="applicationLink"
                      className={`${inputStyle} pl-10`}
                      placeholder="https://..."
                      {...formik.getFieldProps("applicationLink")}
                    />
                  </div>
                  {formik.touched.applicationLink && formik.errors.applicationLink && (
                    <p className={errorStyle}>{formik.errors.applicationLink}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="experience" className={labelStyle}>
                    Experience
                  </label>
                  <div className="relative">
                     <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        id="experience"
                        type="text"
                        name="experience"
                        className={`${inputStyle} pl-10`}
                        placeholder="e.g., 2-4 years"
                        {...formik.getFieldProps("experience")}
                    />
                  </div>
                  {formik.touched.experience && formik.errors.experience && (
                    <p className={errorStyle}>{formik.errors.experience}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="noticePeriod" className={labelStyle}>
                    Notice Period
                  </label>
                  <div className="relative">
                     <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        id="noticePeriod"
                        type="text"
                        name="noticePeriod"
                        className={`${inputStyle} pl-10`}
                        placeholder="e.g., Immediate / 30 days"
                        {...formik.getFieldProps("noticePeriod")}
                    />
                  </div>
                  {formik.touched.noticePeriod && formik.errors.noticePeriod && (
                    <p className={errorStyle}>{formik.errors.noticePeriod}</p>
                  )}
                </div>

                 <div>
                   <label htmlFor="companyIcon" className={labelStyle}>
                     Company Icon
                   </label>
                   <div className="flex flex-col gap-4">
                     <div className="relative">
                         <ImageIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                         <input
                           id="companyIcon"
                           type="file"
                           accept="image/*"
                           name="companyIcon"
                           className={`${inputStyle} pl-10`}
                           onChange={(event) => {
                             formik.setFieldValue("companyIcon", event.currentTarget.files[0]);
                           }}
                         />
                     </div>
                     {formik.values.companyIcon && (
                         <div className="mt-2">
                             <p className="text-sm text-gray-500 mb-1">Preview:</p>
                             <img 
                                 src={
                                     typeof formik.values.companyIcon === 'string' 
                                         ? formik.values.companyIcon 
                                         : URL.createObjectURL(formik.values.companyIcon)
                                 } 
                                 alt="Preview" 
                                 className="h-20 w-20 object-contain rounded-lg border border-gray-200"
                             />
                         </div>
                     )}
                   </div>
                   {formik.touched.companyIcon && formik.errors.companyIcon && (
                     <p className={errorStyle}>{formik.errors.companyIcon}</p>
                   )}
                 </div>

                 <div>
                  <label htmlFor="expireIn" className={labelStyle}>
                    Expire In
                  </label>
                  <div className="relative">
                     <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        id="expireIn"
                        type="date"
                        name="expireIn"
                        className={`${inputStyle} pl-10`}
                        {...formik.getFieldProps("expireIn")}
                    />
                  </div>
                  {formik.touched.expireIn && formik.errors.expireIn && (
                    <p className={errorStyle}>{formik.errors.expireIn}</p>
                  )}
                </div>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText size={22} className="text-purple-500" /> Job Details
                </h3>

                <div className="mb-6">
                  <label htmlFor="description" className={labelStyle}>
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    className={inputStyle}
                    placeholder="Enter job description..."
                    {...formik.getFieldProps("description")}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className={errorStyle}>{formik.errors.description}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="requirements" className={labelStyle}>
                    Requirements
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows="5"
                    className={inputStyle}
                    placeholder="Enter job requirements..."
                    {...formik.getFieldProps("requirements")}
                  />
                  {formik.touched.requirements && formik.errors.requirements && (
                    <p className={errorStyle}>{formik.errors.requirements}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="hiringProcess" className={labelStyle}>
                    Hiring Process
                  </label>
                  <textarea
                    id="hiringProcess"
                    name="hiringProcess"
                    rows="4"
                    className={inputStyle}
                    placeholder={"Exploratory Call\nOnline Coding Test\nTechnical Round 1\nTechnical Round 2\nBehavioral Round"}
                    {...formik.getFieldProps("hiringProcess")}
                  />
                  {formik.touched.hiringProcess && formik.errors.hiringProcess && (
                    <p className={errorStyle}>{formik.errors.hiringProcess}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="skills" className={labelStyle}>
                    Skills
                  </label>
                  <div className="relative">
                    <Code className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                        id="skills"
                        name="skills"
                        rows="3"
                        className={`${inputStyle} pl-10`}
                        placeholder="e.g., React, Node.js, SQL (comma separated)"
                        {...formik.getFieldProps("skills")}
                    />
                  </div>
                  {formik.touched.skills && formik.errors.skills && (
                    <p className={errorStyle}>{formik.errors.skills}</p>
                  )}
                </div>
              </div>

              <div className="border-b border-gray-200 pb-8 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <HelpCircle size={22} className="text-purple-500" /> Custom Questions
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const currentQuestions = formik.values.customQuestions || [];
                      formik.setFieldValue("customQuestions", [
                        ...currentQuestions,
                        { question: "", mandatory: false },
                      ]);
                    }}
                    className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <PlusCircle size={16} /> Add Question
                  </button>
                </div>

                {formik.values.customQuestions?.length > 0 ? (
                  <div className="space-y-4">
                    {formik.values.customQuestions.map((q, index) => (
                      <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question {index + 1}
                          </label>
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) =>
                              formik.setFieldValue(
                                `customQuestions.${index}.question`,
                                e.target.value
                              )
                            }
                            className={inputStyle}
                            placeholder="Enter your question here..."
                          />
                          {formik.errors.customQuestions?.[index]?.question && (
                            <p className={errorStyle}>
                              {formik.errors.customQuestions[index].question}
                            </p>
                          )}
                        </div>
                        <div className="pt-8">
                           <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={q.mandatory}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `customQuestions.${index}.mandatory`,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                            />
                            <span className="text-sm text-gray-700">Mandatory</span>
                          </label>
                        </div>
                        <div className="pt-7">
                          <button
                            type="button"
                            onClick={() => {
                              const newQuestions = [...formik.values.customQuestions];
                              newQuestions.splice(index, 1);
                              formik.setFieldValue("customQuestions", newQuestions);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove question"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                    <p>No custom questions added yet.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const currentQuestions = formik.values.customQuestions || [];
                        formik.setFieldValue("customQuestions", [
                          ...currentQuestions,
                          { question: "", mandatory: false },
                        ]);
                      }}
                      className="mt-2 text-purple-600 font-medium hover:underline"
                    >
                      Add your first question
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Updating..." : "Update Job"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(AdminJobUpdate, ["admin"]);
