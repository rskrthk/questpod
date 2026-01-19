"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "@/redux/slices/dashboardSlice";

export default function useAdminDashboardViewModel() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return {
    stats: data,
    loading,
    error,
  };
}