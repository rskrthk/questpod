// components/AdminComponents/Breadcrumbs.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  // Filter out empty strings from split and the first empty string from root path
  const pathSegments = pathname.split("/").filter(segment => segment);

  return (
    <nav className="text-sm text-gray-500 flex items-center space-x-1 font-medium"> {/* Using space-x for consistent spacing */}
      <Link href="/admin-dashboard" className="hover:text-purple-600 transition duration-200"> {/* Consistent hover color */}
        Dashboard
      </Link>
      {pathSegments.map((segment, idx) => {
        // Construct the href for each segment
        const href = "/" + pathSegments.slice(0, idx + 1).join("/");
        const isLast = idx === pathSegments.length - 1;
        const displayName = decodeURIComponent(segment.replace(/-/g, ' ')); // Replace hyphens for better display

        return (
          <span key={idx} className="flex items-center space-x-1"> {/* Space for icon and text */}
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-800 capitalize">
                {displayName}
              </span>
            ) : (
              <Link
                href={href}
                className="capitalize text-gray-600 hover:text-purple-600 transition duration-200" // Consistent hover color
              >
                {displayName}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}