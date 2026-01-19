"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiKey, saveApiKey, updateApiKeyLocally } from "@/redux/slices/apiKeySlice";
import toast from "react-hot-toast";

// Helper to safely decode base64 strings
function safeBase64Decode(str) {
  try {
    if (str && typeof str === "string") {
      return atob(str);
    }
    return "";
  } catch (err) {
    console.error("Base64 decode failed:", err);
    return "";
  }
}

// Helper to safely encode base64 strings
function safeBase64Encode(str) {
  try {
    return btoa(str);
  } catch (err) {
    console.error("Base64 encode failed:", err);
    return "";
  }
}

export default function useAdminApiSettingCreate() {
  const dispatch = useDispatch();
  const { value: encodedValue, loading, error } = useSelector((state) => state.apiKey);
  const [decodedApiKey, setDecodedApiKey] = useState("");

  // Fetch existing API key on load
  useEffect(() => {
    dispatch(fetchApiKey());
  }, [dispatch]);

  // Decode only if valid and changed
  useEffect(() => {
    const decoded = safeBase64Decode(encodedValue);
    setDecodedApiKey(decoded);
  }, [encodedValue]);

  const handleChange = (val) => {
    setDecodedApiKey(val);
    const encoded = safeBase64Encode(val);
    dispatch(updateApiKeyLocally(encoded));
  };

  const handleSave = async () => {
    if (!decodedApiKey.trim()) {
      return toast.error("API key is required");
    }

    try {
      await dispatch(saveApiKey(decodedApiKey)).unwrap();
      toast.success("API Key saved successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to save API key");
    }
  };

  return {
    decodedApiKey,
    encodedApiKey: safeBase64Encode(decodedApiKey),
    loading,
    error,
    handleChange,
    handleSave,
  };
}
