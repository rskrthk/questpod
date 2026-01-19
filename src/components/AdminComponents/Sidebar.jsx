// components/AdminComponents/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, // Example icon for Dashboard
  Building2, // Example icon for College Management
  UserCog, // Example icon for Profile Management
  Briefcase, // Example icon for Job Management
  Code, // Example icon for Gemini AI (if uncommented)
} from "lucide-react"; // Import icons from lucide-react

const sidebarItems = [
  { title: "Dashboard", path: "/admin-dashboard", group: "General", icon: LayoutDashboard },
  { title: "College Management", path: "/admin-college", group: "Login Management", icon: Building2 },
  { title: "Job Management", path: "/admin-job", group: "Login Management", icon: Briefcase },
  { title: "Profile Management", path: "/admin-profile", group: "Profile Management", icon: UserCog },
  // { title: "Gemini Ai", path: "/admin-api-setting", group: "API Setting", icon: Code }, // Uncomment and use Code icon if needed
];

export default function Sidebar({ isOpen }) {
  const pathname = usePathname();

  // Group items by their 'group' property
  const groupedSidebarItems = sidebarItems.reduce((acc, item) => {
    acc[item.group] = [...(acc[item.group] || []), item];
    return acc;
  }, {});

  return (
    <aside
      className={`fixed top-[62px] left-0 h-[calc(100vh-62px)] w-64 bg-white border-r border-gray-200 shadow-lg overflow-y-auto z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } md:w-64`} 
    >
      <div className="p-5 text-gray-800"> {/* Increased padding for better spacing */}
        <nav className="space-y-6"> {/* Adjusted space between groups */}
          {Object.entries(groupedSidebarItems).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs text-gray-500 uppercase mb-3 font-bold tracking-wider"> {/* Stronger uppercase, more subtle color */}
                {group}
              </p>
              <div className="space-y-2"> {/* Increased space between links */}
                {items.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon; // Get the icon component

                  return (
                    <Link
                      key={item.title}
                      href={item.path}
                      className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group
                        ${isActive
                          ? "bg-purple-600 text-white font-semibold shadow-md" // Primary brand color, bold, shadow for active
                          : "text-gray-700 hover:bg-purple-50 hover:text-purple-700" // Subtle hover
                        }`}
                    >
                      {Icon && (
                        <Icon
                          size={18}
                          className={`mr-3 ${isActive ? "text-white" : "text-gray-500 group-hover:text-purple-600"}`} // Icon styling
                        />
                      )}
                      <span className="text-sm">{item.title}</span> {/* Consistent text size */}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}