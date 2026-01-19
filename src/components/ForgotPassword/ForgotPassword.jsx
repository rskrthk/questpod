"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "@/redux/slices/authSlice";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const resultAction = await dispatch(forgotPassword(values)).unwrap();
      if (resultAction?.message) {
        toast.success(resultAction.message || "Check your email.");
        router.push("/sign-in");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong. Try again.");
      console.error("Forgot password error:", err);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <Image
            src={"/Questpodai.svg"}
            alt="Questpodai Logo"
            width={120}
            height={120}
            className="mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 transition-colors"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-white font-bold rounded-lg transition-all duration-300
                           bg-gradient-to-r from-purple-700 to-fuchsia-600
                           hover:from-purple-800 hover:to-fuchsia-700
                           focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-sm text-center mt-8 text-gray-500">
          <button
            onClick={() => {
              setIsNavigating(true);
              router.push("/sign-in");
            }}
            type="button"
            className="font-medium text-purple-700 hover:text-fuchsia-600 transition-colors"
          >
            {isNavigating ? (
              <span className="flex items-center justify-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : (
              "Back to Login"
            )}
          </button>
        </p>
      </div>
    </div>
  );
}