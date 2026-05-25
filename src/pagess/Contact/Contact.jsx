"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaGlobe, FaBuilding, FaUser, FaGraduationCap } from "react-icons/fa";
import useContactForm from "./UseContact";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Upload, FileText, File, X } from "lucide-react";
import Image from "next/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Contact() {
  const { initialValues, validationSchema, handleSubmit, submitting } = useContactForm();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const resetFileStates = () => {
    setPreviewUrl(null);
    setUploadedFile(null);
  };

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-indigo-950 to-purple-900 text-white py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl sm:text-6xl font-extrabold mb-4"
          >
            Let's talk.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-indigo-100 text-lg max-w-xl leading-relaxed"
          >
            Whether you are an institution looking for a demo, a student with a question, or a company interested in
            partnering with us — we respond within 24 hours.
          </motion.p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 items-start">
          {/* ── CONTACT FORM ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
            <p className="text-sm text-gray-600 mb-8">Fill in the form below and we'll get back to you within 24 hours.</p>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, formikHelpers) => {
                handleSubmit(values, { ...formikHelpers, resetFileStates });
              }}
            >
              {({ setFieldValue, values }) => (
                <Form className="space-y-5 text-sm">
                  {/* Name */}
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="name"
                      placeholder="Your full name"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                    />
                    <ErrorMessage name="name" component="div" className="text-xs text-red-500 mt-1" />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="you@email.com"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                    />
                    <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Phone</label>
                    <Field
                      name="phone"
                      placeholder="+91-XXXXXXXXXX"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                    />
                  </div>

                  {/* I am a */}
                  <div>
                    <label className="block font-medium mb-2 text-gray-700">I am a:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Student", "Teacher", "Institution / Admin", "Other"].map((role) => (
                        <label
                          key={role}
                          className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition text-xs font-medium ${values.issueType === role
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 text-gray-700 hover:border-indigo-300"
                            }`}
                        >
                          <Field type="radio" name="issueType" value={role} className="sr-only" />
                          {role === "Student" && <FaGraduationCap className="w-3.5 h-3.5 text-purple-500" />}
                          {role === "Teacher" && <FaUser className="w-3.5 h-3.5 text-indigo-500" />}
                          {role === "Institution / Admin" && <FaBuilding className="w-3.5 h-3.5 text-indigo-600" />}
                          {role === "Other" && <FaUser className="w-3.5 h-3.5 text-gray-500" />}
                          {role}
                        </label>
                      ))}
                    </div>
                    <ErrorMessage name="issueType" component="div" className="text-xs text-red-500 mt-1" />
                  </div>

                  {/* University Name */}
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Institution name (if applicable)</label>
                    <Field
                      name="universityName"
                      placeholder="Your university or college name"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="textarea"
                      name="message"
                      rows="4"
                      placeholder="Tell us what you're looking for..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none"
                    />
                    <ErrorMessage name="message" component="div" className="text-xs text-red-500 mt-1" />
                  </div>

                  {/* Attachment */}
                  <div className="space-y-2">
                    <label className="block font-medium text-sm text-gray-700">
                      Attachment <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center text-center hover:border-indigo-400 transition cursor-pointer">
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
                          <Image src={previewUrl} alt="Uploaded" width={80} height={80} className="rounded-md object-cover" />
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium truncate max-w-[150px]">{uploadedFile.name}</span>
                            <button
                              type="button"
                              onClick={() => { setUploadedFile(null); setFieldValue("attachment", null); setPreviewUrl(null); }}
                              className="text-xs text-red-500 flex items-center gap-1 mt-1 hover:underline"
                            >
                              <X className="w-4 h-4" /> Remove
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
                            <span className="text-sm truncate max-w-[200px]">{uploadedFile.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setUploadedFile(null); setFieldValue("attachment", null); }}
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-indigo-500 mb-1" />
                          <p className="text-sm text-gray-600">Click or drag a file</p>
                          <p className="text-xs text-gray-400">Max 10MB · jpg, png, pdf, txt</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl transition duration-300 hover:from-indigo-700 hover:to-purple-700 cursor-pointer"
                  >
                    {submitting ? "Sending..." : "Send message →"}
                  </button>
                </Form>
              )}
            </Formik>
          </motion.div>

          {/* ── DIRECT CONTACT ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {/* Contact details */}
            {/* <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Direct contact</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <FaEnvelope className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <a href="mailto:tarun.m@preneurs.in" className="text-indigo-600 hover:text-indigo-800 transition text-sm font-medium">
                      tarun.m@preneurs.in
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <FaPhone className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <a href="tel:+919632520648" className="text-indigo-600 hover:text-indigo-800 transition text-sm font-medium">
                      +91-9632520648
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <FaGlobe className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Website</p>
                    <a href="https://www.questpodai.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition text-sm font-medium">
                      www.questpodai.com
                    </a>
                  </div>
                </div>
              </div>
            </div> */}

            {/* For institutions */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <FaBuilding className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">For institutions</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Request a demo by emailing{" "}
                <a href="mailto:tarun.m@preneurs.in" className="text-indigo-600 font-medium">
                  tarun.m@preneurs.in
                </a>{" "}
                with your institution name and preferred demo format. We will confirm within 24 hours.
              </p>
            </div>

            {/* For students */}
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center">
                  <FaGraduationCap className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">For students</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Questions about your account or subscription? Email{" "}
                <a href="mailto:tarun.m@preneurs.in" className="text-purple-600 font-medium">
                  tarun.m@preneurs.in
                </a>{" "}
                — we respond the same day.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
