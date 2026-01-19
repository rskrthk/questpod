"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const plans = [
  "Basic Plan - $299/month",
  "Standard Plan - $599/month",
  "Premium Plan - $999/month",
];

const validationSchema = Yup.object().shape({
  universityName: Yup.string().required("Required"),
  position: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  contactNumber: Yup.string().required("Required"),
  message: Yup.string().required("Required"),
  plan: Yup.string().required("Please select a plan"),
});

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
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Submit Enquiry
          </h2>

          <Formik
            initialValues={{
              universityName: "",
              position: "",
              email: "",
              contactNumber: "",
              message: "",
              plan: selectedPlan,
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              console.log("Form Submitted:", values);
              resetForm();
              onClose();
            }}
          >
            {({ isSubmitting }) => (
              <Form className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    University Name
                  </label>
                  <Field
                    type="text"
                    name="universityName"
                    className="w-full border p-2 rounded-md mt-1 text-sm"
                  />
                  <ErrorMessage
                    name="universityName"
                    component="div"
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Your Position
                  </label>
                  <Field
                    type="text"
                    name="position"
                    className="w-full border p-2 rounded-md mt-1 text-sm"
                  />
                  <ErrorMessage
                    name="position"
                    component="div"
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full border p-2 rounded-md mt-1 text-sm"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <Field
                    type="text"
                    name="contactNumber"
                    className="w-full border p-2 rounded-md mt-1 text-sm"
                  />
                  <ErrorMessage
                    name="contactNumber"
                    component="div"
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Choose Plan
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
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Message
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
                    className="text-xs text-red-500 mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="theme-colors text-white py-2 rounded-md mt-2 font-semibold text-sm transition hover:opacity-90"
                >
                  {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                </button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PricingPopup;
