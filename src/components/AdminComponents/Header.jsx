"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Menu, LogOut, User } from "lucide-react";
import { logout } from "@/redux/slices/authSlice";
import FullScreenLoader from "@/lib/FullScreenLoader";

export default function Header({ toggleSidebar }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const { user } = useSelector((state) => state?.auth || {}); 
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const logoSrc = user?.logo
    ? user.logo.startsWith("http")
      ? user.logo
      : `${baseUrl}${user.logo}`
    : null;

  const handleLogout = async () => {
    setIsNavigating(true);

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    dispatch(logout());
    toast.success("Logout successful!");
    router.push("/");

    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  if (isNavigating) return <FullScreenLoader />;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-5 py-3 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between transition-all duration-300 ease-in-out">
      {/* Left - Sidebar Toggle + Brand */}
      <div className="flex items-center gap-4 md:gap-6">
        <button
          onClick={toggleSidebar}
          className="xl:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <Link href="/admin-dashboard">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 cursor-pointer">
            QuestpodAI <span className="text-purple-600">Admin</span>
          </h1>
        </Link>
      </div>

      {/* Right - Profile + Logout */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Profile Image or Icon */}
        <Link href="/admin-profile" className="group" aria-label="User profile">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt="Profile Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-purple-200 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 border border-purple-200 text-purple-700 group-hover:bg-purple-200 group-hover:border-purple-300 group-hover:text-purple-800 transition-all duration-200 shadow-sm">
              <User className="w-5 h-5" />
            </div>
          )}
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
