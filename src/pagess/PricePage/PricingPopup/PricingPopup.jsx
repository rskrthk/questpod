"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import usePricingPopup from "./UsePricingPopup";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 30 },
};

const PricingPopup = ({ onClose, selectedPlan = "" }) => {
  const { initialValues, validationSchema, handleSubmit, isSubmitting, plans } =
    usePricingPopup(selectedPlan, onClose);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg h-[90vh] overflow-y-auto p-5 sm:p-6 relative scrollbar-hide"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Enquiry Form
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            <Form className="grid gap-4">
              {["universityName", "position", "email", "contactNumber"].map(
                (field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                      <span className="text-red-500 px-2">*</span>
                    </label>
                    <Field
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      className="w-full border p-2 rounded-md mt-1 text-sm"
                    />
                    <ErrorMessage
                      name={field}
                      component="div"
                      className="text-xs text-red-500 px-2 mt-1"
                    />
                  </div>
                )
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Choose Plan
                  <span className="text-red-500 px-2">*</span>
                </label>
                <Field
                  as="select"
                  name="plan"
                  className="w-full border p-2 rounded-md mt-1 text-sm"
                >
                  <option value="">Select a plan</option>
                  {plans.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="plan"
                  component="div"
                  className="text-xs text-red-500 px-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                  <span className="text-red-500 px-2">*</span>
                </label>
                <Field
                  as="textarea"
                  name="message"
                  rows={3}
                  className="w-full border p-2 rounded-md mt-1 text-sm"
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-xs text-red-500 px-2 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="theme-colors text-white py-2 rounded-md mt-2 font-semibold text-sm transition hover:bg-purple-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </Form>
          </Formik>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PricingPopup;
