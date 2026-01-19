"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Upload, FileText, File, X } from "lucide-react";
import Image from "next/image";
import useContactForm from "./UseContact";

export default function Contact() {
  const { initialValues, validationSchema, handleSubmit, submitting } =
    useContactForm();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Function to reset local file states
  const resetFileStates = () => {
    setPreviewUrl(null);
    setUploadedFile(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b to-indigo-100 p-4 flex items-center justify-center py-20">
        <div className="bg-white max-w-2xl w-full rounded-2xl shadow-lg p-6 md:p-10">
          <h2 className="text-3xl font-bold text-purple-700 text-center mb-1">
            Contact Form
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Help us improve by reporting bugs, suggesting features, or sharing
            your experience.
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, formikHelpers) => {
              // Pass the local reset function to the handleSubmit from the hook
              handleSubmit(values, { ...formikHelpers, resetFileStates });
            }}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-4 text-sm">
                {/* University */}
                <div>
                  <label className="block font-medium mb-1">
                    University Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="universityName"
                    className="w-full border rounded-md px-3 py-2"
                  />
                  <ErrorMessage
                    name="universityName"
                    component="div"
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                {/* Name + Email */}
                <div className="md:flex md:space-x-4">
                  <div className="md:w-1/2">
                    <label className="block font-medium mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="name"
                      className="w-full border rounded-md px-3 py-2"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>
                  <div className="md:w-1/2 mt-4 md:mt-0">
                    <label className="block font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full border rounded-md px-3 py-2"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>
                </div>

                {/* Issue Type */}
                <div>
                  <label className="block font-medium mb-1">
                    Enquiry <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="issueType"
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">Select enquiry type</option>
                    <option value="bug">Bug</option>
                    <option value="feature Request">Feature Request</option>
                    <option value="feedback">Feedback</option>
                    <option value="Request demo">Request Demo</option>
                  </Field>
                  <ErrorMessage
                    name="issueType"
                    component="div"
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block font-medium mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="subject"
                    className="w-full border rounded-md px-3 py-2"
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block font-medium mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="message"
                    rows="4"
                    className="w-full border rounded-md px-3 py-2"
                  />
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                {/* Attachment with inline preview */}
                <div className="space-y-2">
                  <label className="block font-medium text-sm text-gray-700">
                    Attachment <span className="text-gray-400">(Optional)</span>
                  </label>

                  <div className="relative border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center text-center hover:border-purple-500 transition cursor-pointer">
                    <input
                      type="file"
                      name="attachment"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept=".jpg,.jpeg,.png,.pdf,.txt"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                          setFieldValue("attachment", file);
                          setUploadedFile(file);
                          if (file.type.startsWith("image/")) {
                            setPreviewUrl(URL.createObjectURL(file));
                          } else {
                            setPreviewUrl(null);
                          }
                        }
                      }}
                    />
                    {uploadedFile && previewUrl ? (
                      <div className="flex items-center gap-3">
                        <Image
                          src={previewUrl}
                          alt="Uploaded"
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium truncate max-w-[150px]">
                            {uploadedFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedFile(null);
                              setFieldValue("attachment", null);
                              setPreviewUrl(null);
                            }}
                            className="text-xs text-red-500 flex items-center gap-1 mt-1 hover:underline"
                          >
                            <X className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : uploadedFile ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-white rounded-full border">
                            {uploadedFile.type === "application/pdf" ? (
                              <FileText className="w-5 h-5 text-red-500" />
                            ) : (
                              <File className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <span className="text-sm truncate max-w-[200px]">
                            {uploadedFile.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFile(null);
                            setFieldValue("attachment", null);
                          }}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-purple-500 mb-1" />
                        <p className="text-sm text-gray-600">
                          Click or drag a file
                        </p>
                        <p className="text-xs text-gray-400">
                          Max 10MB • jpg, png, pdf, txt
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold py-2 rounded-lg transition duration-300 hover:from-purple-700 hover:to-indigo-600"
                >
                  {submitting ? "Submitting..." : "Submit Contact"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
}
