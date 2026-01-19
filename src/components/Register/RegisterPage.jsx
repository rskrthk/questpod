"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/authSlice";
import Image from "next/image";
import k_logo from "@/assets/LoginAndSignup/k_icon.png";
import aws from "@/assets/LoginAndSignup/aws-logo.png";
import google from "@/assets/LoginAndSignup/Google_Startups_page.png";
import microsoft from "@/assets/LoginAndSignup/MS_Startups.webp";
import NVIDIA from "@/assets/LoginAndSignup/nvidia-inception-logo.png";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function SignupPage() {
  const dispatch = useDispatch();
  const { loading, registerError } = useSelector(
    (state) => state.auth
  );
  const route = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const resultAction = await dispatch(
        registerUser({ ...values, role: "user" })
      ).unwrap();
      if (resultAction?.message) {
        toast.success("User registered successfully!");
        route.push("/sign-in");
      }
      resetForm();
    } catch (err) {
      toast.error(err?.message || "Registration failed!");
      console.error("Registration failed:", err);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4 py-12">
        <div className="bg-zinc-900 shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-xl">
          <div className="flex flex-col items-center mb-6">
            <Image src={"/White.svg"} alt="Questpodai Logo" className="h-10 mb-4" />
            {/* <Logo className="h-10 mb-4" /> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center pb-4">
              Create your account
            </h2>
            <p className="text-sm text-gray-300 text-center">
              to continue to{" "}
              <span className="text-cyan-400 font-semibold">Questpod AI</span>
            </p>
          </div>

          <Formik
            initialValues={{ name: "", email: "", mobNo: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {["name", "email", "mobNo", "password"].map((field, idx) => (
                  <div className="pb-3" key={idx}>
                    <Field
                      name={field}
                      type={field === "password" ? "password" : "text"}
                      placeholder={
                        field === "mobNo"
                          ? "Mobile Number"
                          : field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      className="w-full p-3 border border-white rounded-lg bg-transparent text-white placeholder-gray-400"
                    />
                    <ErrorMessage
                      name={field}
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-all duration-200"
                >
                  {isSubmitting || loading ? "Signing up..." : "Continue"}
                </button>

                {registerError && (
                  <div className="text-red-400 text-sm mt-4 text-center">
                    {registerError}
                  </div>
                )}
              </Form>
            )}
          </Formik>

          <p className="text-sm text-center mt-6 flex justify-center items-center text-gray-300">
            <span>Have an account?</span>
            <button
              onClick={() => {
                setIsNavigating(true);
                route.push("/sign-in");
              }}
              className="text-cyan-400 hover:underline font-medium pl-2"
            >
              {isNavigating ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </p>
        </div>
      </div>

      {/* Right Panel - Testimonial (Only visible on lg+) */}
      <div className="hidden lg:flex w-full lg:w-1/2 flex-col justify-center items-center bg-gray-200 px-6 py-12 text-center">
        <Image
          src={k_logo}
          alt="Emily"
          className="w-20 h-20 rounded-full mb-4 object-cover"
        />
        <h3 className="text-lg font-semibold">Emily, 25</h3>
        <p className="text-sm text-gray-700 mb-2">UI/UX @ Google</p>
        <p className="text-sm text-gray-600 max-w-lg">
          "Interviews used to stress me out big time, but Questpod AI made it
          super easy. I nailed every system design and coding question during my
          Google interviews. Landed a $220k position. This thing is fire!"
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 w-full max-w-md">
          <Image src={aws} alt="AWS" width={100} height={24} />
          <Image src={google} alt="Google" width={100} height={24} />
          <Image src={microsoft} alt="Microsoft" width={100} height={24} />
          <Image src={NVIDIA} alt="NVIDIA" width={100} height={24} />
        </div>
      </div>
    </div>
  );
}
