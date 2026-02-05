"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, deleteJob } from "@/redux/slices/jobSlice";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";

export function UseAdminJob() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { jobs, loading } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleCreateJob = () => {
    router.push("/admin-job-create");
  };

  const handleEdit = (job) => {
    router.push(`/admin-job-update?id=${job.id}`);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this job?")) {
      await dispatch(deleteJob(id));
    }
  };

  const columns = [
    {
      header: "Job Title",
      accessorKey: "title",
    },
    {
      header: "Company",
      accessorKey: "company",
    },
    {
      header: "Location",
      accessorKey: "location",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            info.getValue() === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (info) => (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/admin-job-applications/${info.row.original.id}`)}
            className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
            title="View Applications"
          >
            <Users size={18} />
          </button>
          <button
            onClick={() => handleEdit(info.row.original)}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="p-1 text-red-600 hover:text-red-800 transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return {
    jobs,
    handleCreateJob,
    columns,
    loading,
  };
}
