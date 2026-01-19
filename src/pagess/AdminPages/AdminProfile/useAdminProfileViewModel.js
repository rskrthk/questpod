"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { fetchAdminProfile } from "@/redux/slices/authSlice";

export default function useAdminProfileViewModel() {
  const dispatch = useDispatch();

  const {
    user: profile,
    loading,
    fetchProfileError: error,
  } = useSelector((state) => state?.auth || {});

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const [editableData, setEditableData] = useState({
    name: "",
    email: "",
    mobNo: "",
  });

  // Fetch profile initially
  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  // Set form values when profile loads
  useEffect(() => {
    if (profile) {
      setEditableData({
        name: profile?.name || "",
        email: profile?.email || "",
        mobNo: profile?.mobNo || "",
      });
    }
  }, [profile]);

  // Input field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    const tempUrl = URL.createObjectURL(file);
    setPreview(tempUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("logo", file);
      formData.append("name", editableData.name);
      formData.append("email", editableData.email);
      formData.append("mobNo", editableData.mobNo);
      formData.append("adminId", profile.id); // optional, depends on your API

      const token = sessionStorage.getItem("token");

      const res = await axios.post("/api/admin/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Logo upload response:", res.data);

      if (res.data?.success || res.data?.message?.toLowerCase().includes("success")) {
        toast.success(res.data.message || "Profile image updated!");
        dispatch(fetchAdminProfile());
        setTimeout(() => setPreview(null), 1000);
      } else {
        toast.error(res.data?.error || "Image update failed");
        console.error("Upload failed:", res.data?.error || res.data?.message);
      }
    } catch (err) {
      console.error("Logo upload error:", err);
      toast.error("Unexpected error during image upload");
    } finally {
      setUploading(false);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async () => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", editableData.name);
      formData.append("email", editableData.email);
      formData.append("mobNo", editableData.mobNo);
      formData.append("adminId", profile?.id); // optional

      const token = sessionStorage.getItem("token");

      const res = await axios.post("/api/admin/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile update response:", res.data);

      if (res.data?.success || res.data?.message?.toLowerCase().includes("success")) {
        toast.success(res.data.message || "Profile updated!");
        dispatch(fetchAdminProfile());
      } else {
        toast.error(res.data?.error || "Profile update failed");
        console.error("Profile update failed:", res.data?.error || res.data?.message);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong while updating profile");
    } finally {
      setUploading(false);
    }
  };

  // Final logo URL
  const logoSrc =
    preview ||
    (profile?.logo
      ? profile.logo.startsWith("http")
        ? profile.logo
        : `${baseUrl}${profile.logo}`
      : "/avatar-placeholder.png");

  return {
    profile,
    loading,
    error,
    logoSrc,
    uploading,
    editableData,
    handleChange,
    handleLogoChange,
    handleProfileSubmit,
  };
}
