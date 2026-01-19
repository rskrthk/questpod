import {
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaCog,
} from "react-icons/fa";

export const sidebarMenu = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: FaTachometerAlt,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: FaUsers,
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: FaBook,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: FaCog,
  },
];
