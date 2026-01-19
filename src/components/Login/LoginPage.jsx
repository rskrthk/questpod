"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Loader2 } from "lucide-react";
import FullScreenLoader from "@/lib/FullScreenLoader";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(loginUser(values)).unwrap();
      const user = result?.user;
      if (user?.role) {
        toast.success("Login successful!");
        setIsNavigating(true);

        // Check if there's a stored redirect URL
        const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");

        if (user.role === "admin") {
          if (redirectAfterLogin && redirectAfterLogin.startsWith("/admin")) {
            sessionStorage.removeItem("redirectAfterLogin");
            router.push(redirectAfterLogin);
          } else {
            router.push("/admin-dashboard");
          }
        } else {
          if (redirectAfterLogin) {
            sessionStorage.removeItem("redirectAfterLogin");
            router.push(redirectAfterLogin);
          } else {
            const previousPath = sessionStorage.getItem("previousPath");
            if (previousPath && previousPath !== "/sign-in") {
              router.push(previousPath);
            } else {
              switch (user.role) {
                case "user":
                  router.push("/new-logindashboard");
                  break;
                default:
                  router.push("/");
              }
            }
          }
        }
      } else {
        toast.error("Login failed: No role found");
      }
    } catch (err) {
      toast.error(err?.message || "Login failed. Invalid credentials.");
    }

    setSubmitting(false);
  };

  if (isNavigating) return <FullScreenLoader />;

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
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Sign in to <span className="font-semibold text-gray-700">Questpod AI</span>
          </p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 transition-colors"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => router.push("/forgot-password")}
                  type="button"
                  className="text-sm font-medium text-purple-700 hover:text-fuchsia-600 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full py-3 text-white font-bold rounded-lg transition-all duration-300
                           bg-gradient-to-r from-purple-700 to-fuchsia-600
                           hover:from-purple-800 hover:to-fuchsia-700
                           focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
}
