"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  fetchColleges,
  clearCollegeError,
  deleteCollege,
} from "@/redux/slices/collegeSlice";
import { FaUsersViewfinder } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import Image from "next/image";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export function UseAdminCollege() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { colleges, loading, error } = useSelector((state) => state?.college);

  const [showModal, setShowModal] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

  useEffect(() => {
    dispatch(fetchColleges());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearCollegeError());
    }
  }, [error, dispatch]);

  const handleCreateCollege = () => {
    router.push("/admin-college-create");
  };

  const handleEdit = (id) => {
    router.push(`/admin-college-update?id=${id}`);
  };

  // const handleDelete = (id) => {
  //   const confirmDelete = confirm("Are you sure you want to deactivate this college?");
  //   if (!confirmDelete) return;

  //   dispatch(deleteCollege({ id, status: "inactive" }))
  //     .unwrap()
  //     .then(() => {
  //       toast.success("College marked as inactive");
  //       dispatch(fetchColleges());
  //     })
  //     .catch((err) => {
  //       toast.error(err || "Failed to mark as inactive");
  //     });
  // };

    const handleToggleStatus = (college) => {
    dispatch(
      deleteCollege({
        id: college._id || college.id,
        currentStatus: college.status,
      })
    )
      .unwrap()
      .then((res) => {
        toast.success(`Status changed to ${res.status}`);
        dispatch(fetchColleges());
      })
      .catch((err) => toast.error(err || "Failed to update status"));
  };

  const handleView = (id) => {
    const college = colleges.find((c) => c._id === id || c.id === id);
    if (college) {
      setSelectedCollege(college);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCollege(null);
  };

  const columns = [
    {
      accessorKey: "logo",
      header: "Logo",
      cell: (info) => {
        const logo = info.getValue();
        const logoSrc = logo
          ? logo.startsWith("http")
            ? logo
            : `${baseUrl.replace(/\/$/, "")}/${encodeURI(logo).replace(/^\//, "")}`
          : "/avatar-placeholder.png";

        return logo ? (
          <Image
            src={logoSrc}
            width={100}
            height={100}
            alt="College Logo"
            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Logo</span>
        );
      },
    },
    {
      accessorKey: "name",
      header: "College Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "mobNo",
      header: "Phone",
      cell: (info) => info.getValue(),
    },
   {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const colleges = row.original;
        const isActive = colleges.status?.toLowerCase() === "active";
        return (
          <button
            onClick={() => handleToggleStatus(colleges)}
            title={isActive ? "Click to deactivate" : "Click to activate"}
            className={`px-2 py-1 rounded text-white text-xs font-medium cursor-pointer ${
              isActive
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {colleges.status}
          </button>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original._id || row.original.id;
        return (
          <div className=" w-full flex justify-center items-center gap-2">
            <button
              onClick={() => handleEdit(id)}
              className="p-2 bg-gray-100 hover:bg-blue-100 text-blue-600 rounded shadow cursor-pointer"
            >
              <FaUserEdit />
            </button>
          </div>
        );
      },
    },
  ];

  return {
    colleges,
    columns,
    loading,
    handleCreateCollege,
    showModal,
    selectedCollege,
    handleCloseModal,
  };
}
