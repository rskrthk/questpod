// components/AdminComponents/AdminLayout.jsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1200); 
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize); // Listen for resize events
    return () => window.removeEventListener("resize", handleResize); // Clean up
  }, []);

  const shouldShowSidebar = isLargeScreen || sidebarOpen;
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 overflow-hidden flex flex-col"> {/* Changed bg to gray-100 for softer look */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 pt-[62px]"> {/* Ensures content starts below header, flex-1 for full height */}
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && !isLargeScreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
            onClick={toggleSidebar}
          ></div>
        )}

        {shouldShowSidebar && <Sidebar isOpen={sidebarOpen || isLargeScreen} />} {/* Pass actual isOpen state */}

        <main
          className={`flex-1 p-6 h-[calc(100vh-62px)] overflow-y-auto transition-all duration-300 ease-in-out ${
            isLargeScreen ? "ml-64" : (sidebarOpen ? "ml-64" : "ml-0") // Dynamic margin for layout
          }`}
        >
          <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4"> {/* Increased mb for better separation */}
            <Breadcrumbs />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}