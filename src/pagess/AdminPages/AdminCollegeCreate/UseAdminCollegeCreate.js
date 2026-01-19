"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLogoPreview } from "@/redux/slices/collegeSlice";
import { useState } from "react";

export function useAdminCollegeCreate() {
  const dispatch = useDispatch();
  const router = useRouter();
  const logoPreview = useSelector((state) => state.college.logoPreview);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobNo: "",
      password: "",
      address: "",
      file: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("College Name is Required"),
      email: Yup.string().email("Invalid email").required("Email is Required"),
      mobNo: Yup.string()
        .required("Mobile No is Required")
        .matches(/^\d{10}$/, "Must be 10 digits"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Password  is Required"),
      address: Yup.string().required("Address is Required"),
      file: Yup.mixed()
        .required("Logo is required")
        .test("fileType", "Only image files allowed", (value) =>
          value ? value.type.startsWith("image/") : false
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("mobNo", values.mobNo);
      formData.append("password", values.password);
      formData.append("address", values.address);
      formData.append("file", values.file);

      try {
        setIsSubmitting(true);
        const token = sessionStorage.getItem("token");
        const res = await fetch("/api/admin/college/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create college");

        toast.success("College created successfully");
        resetForm();
        dispatch(setLogoPreview(null));
        router.push("/admin-college");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("file", file);
      const previewUrl = URL.createObjectURL(file);
      dispatch(setLogoPreview(previewUrl));
    }
  };

  return {
    formik,
    logoPreview,
    isSubmitting,
    handleFileChange,
  };
}
