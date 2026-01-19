"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchApiKey, updateApiKeyLocally } from "@/redux/slices/apiKeySlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function useAdminApiSettingViewModel() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    value: encodedKey,
    loading,
    error,
  } = useSelector((state) => state?.apiKey);

  console.log("value", encodedKey);

  const [apiKeyInput, setApiKeyInput] = useState("");

  // Fetch API key on component mount
  useEffect(() => {
    dispatch(fetchApiKey());
  }, [dispatch]);

  // Decode base64 key
  useEffect(() => {
    try {
      setApiKeyInput(encodedKey ? base64.decode(encodedKey) : "");
    } catch {
      setApiKeyInput("");
    }
  }, [encodedKey]);

  const handleChange = (val) => {
    setApiKeyInput(val);
    dispatch(updateApiKeyLocally(btoa(val)));
  };

  const handleSave = () => {
    if (!apiKeyInput.trim()) {
      toast.error("API key cannot be empty");
      return;
    }

    const base64 = btoa(apiKeyInput);
    console.log("Save Base64:", base64);
    toast.success("API Key saved (Base64)");
    // TODO: API integration for saving to backend
  };

  const handleNavigateToCreate = () => {
    router.push("/admin-api-setting/create");
  };

  return {
    apiKeyInput,
    encodedKey,
    loading,
    error,
    handleChange,
    handleSave,
    handleNavigateToCreate,
  };
}
