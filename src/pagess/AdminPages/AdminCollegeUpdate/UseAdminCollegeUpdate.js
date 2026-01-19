"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { updateCollege, viewCollege } from "@/redux/slices/collegeSlice";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export function UseAdminCollegeUpdate() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const collegeId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobNo: "",
      userName: "",
      password: "",
      address: "",
      role: "college",
      collegeId: "",
      status: "active",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("College Name is Required"),
      email: Yup.string().email("Invalid email").required("Email is Required"),
      mobNo: Yup.string().required("Mobile No is Required"),
      userName: Yup.string().required("Username is Required"),
      address: Yup.string().required("Address is Required"),
      status: Yup.string().required("Status is Required"),
    }),
    onSubmit: async (values) => {
      setError("");
      setSuccessMessage("");
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("id", collegeId);

        // Append all form fields except password (conditionally)
        Object.entries(values).forEach(([key, val]) => {
          if (key !== "password" && val !== undefined && val !== null) {
            formData.append(key, val);
          }
        });

        if (values.password) {
          formData.append("password", values.password);
        }

        if (file) {
          formData.append("file", file);
        }

        console.log("Submitting college update with FormData:");
        for (let pair of formData.entries()) {
          console.log(pair[0], ":", pair[1]);
        }

        await dispatch(updateCollege(formData)).unwrap();

        toast.success("College updated successfully!");
        setSuccessMessage("College updated successfully");
        router.push("/admin-college");
      } catch (err) {
        const msg = typeof err === "string" ? err : "Failed to update college";
        setError(msg);
        toast.error(msg);
        console.error("Update error:", err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      if (!collegeId) {
        console.warn("No collegeId found in URL");
        return;
      }

      console.log("Fetching college with ID:", collegeId);

      try {
        const data = await dispatch(viewCollege(collegeId)).unwrap();

        console.log("College fetched from view API:", data);

        formik.setValues({
          name: data.name || "",
          email: data.email || "",
          mobNo: data.mobNo || "",
          userName: data.userName || "",
          password: "", // Do not pre-fill password
          address: data.address || "",
          role: data.role || "college",
          collegeId: data.collegeId || "",
          status: data.status || "active",
        });

        if (data.logo) {
          setLogoPreview(data.logo);
        }
      } catch (err) {
        setError("Failed to fetch college details");
        toast.error("Failed to fetch college details");
        console.error("View API error:", err);
      }
    };

    fetchCollegeDetails();
  }, [collegeId, dispatch]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  return {
    formik,
    isLoading,
    error,
    successMessage,
    logoPreview,
    setLogoPreview, 
    handleFileChange,
  };
}
