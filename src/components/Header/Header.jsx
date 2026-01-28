"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import FullScreenLoader from "@/lib/FullScreenLoader";
import { useDispatch, useSelector } from "react-redux";
import { logout, fetchUserProfile } from "@/redux/slices/authSlice";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { FileText, ArrowRight } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      dispatch(fetchUserProfile());
    }

    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch (e) {
        console.error("Error parsing user from session", e);
      }
    }
  }, [pathname, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const springConfig = {
    type: "spring",
    stiffness: 100,
    damping: 18,
  };

  const handleNavigate = (path) => {
    if (pathname === path) return;

    if (path === "/jobs") {
      // Check for resume
      if (isLoggedIn && (!user || !user.resume)) {
        setShowResumeModal(true);
        return;
      }
    }

    setIsNavigating(true);
    router.push(path);
  };

  const handleLogout = async () => {
    setIsNavigating(true);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    dispatch(logout());
    toast.success("Logout successful!");
    setIsLoggedIn(false);
    router.push("/");

    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  const navItems = [
    { label: "Home", path: "/" },
    // { label: "Pricing", path: "/price" },
    ...(isLoggedIn && userRole === "user" ? [{ label: "Jobs", path: "/jobs" }] : []),
    ...(isLoggedIn && userRole === "user" ? [{ label: "Profile", path: "/profile" }] : []),
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const productItems = [
    {
      label: "AI Mock Interview",
      path: isLoggedIn ? "/new-logindashboard" : "/new-logindashboard",
    },
    {
      label: "Resume Builder",
      path: isLoggedIn ? "/resume" : "/resume-landing",
    },
    {
      label: "AI Chat",
      path: "/ai-chat",
    },
    {
      label: "Aptitude",
      path: "/aptitude",
    },
  ];

  if (isNavigating) return <FullScreenLoader />;

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: showHeader ? 0 : -100 }}
      transition={springConfig}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300 bg-white border-b border-gray-200`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3">
        {/* Logo */}
        <button
          onClick={() =>
            handleNavigate(isLoggedIn ? "/new-logindashboard" : "/")
          }
          className="flex items-center gap-2 cursor-pointer"
        >
          <Image
            src="/Questpodai.svg" // Always use the gradient logo for a white background
            className="transition-all duration-300"
            width={140}
            height={40}
            alt="Logo"
          />
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {/* Home */}
          <div
            onClick={() => handleNavigate("/")}
            className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
              pathname === "/"
                ? "text-white bg-purple-600 shadow-md"
                : "text-gray-800 hover:text-purple-600"
            }`}
          >
            Home
          </div>
          
          {/* Products Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setProductsDropdownOpen(true)}
            onMouseLeave={() => setProductsDropdownOpen(false)}
          >
            <div
              className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                productItems.some(item => pathname === item.path)
                  ? "text-white bg-purple-600 shadow-md"
                  : "text-gray-800 hover:text-purple-600"
              }`}
            >
              Products
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  productsDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
              {productsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  {productItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <div
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        className={`w-full text-left px-4 py-3 transition-all duration-200 hover:bg-purple-50 cursor-pointer ${
                          isActive
                            ? "text-purple-600 bg-purple-50 font-medium"
                            : "text-gray-700 hover:text-purple-600"
                        }`}
                      >
                        {item.label}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Other Nav Items */}
          {navItems.slice(1).map((item) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-white bg-purple-600 shadow-md"
                    : "text-gray-800 hover:text-purple-600"
                }`}
              >
                {item.label}
              </div>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full transition duration-200 cursor-pointer text-purple-600 border border-purple-600 hover:bg-purple-50"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => handleNavigate("/sign-in")}
              className="px-6 py-2 rounded-full transition duration-200 cursor-pointer text-purple-600 border border-purple-600 hover:bg-purple-50"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-800"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden px-6 py-4 space-y-3 bg-white text-gray-800 border-t border-gray-200"
          >
            {/* Home */}
            <div
              onClick={() => {
                setMenuOpen(false);
                handleNavigate("/");
              }}
              className={`block w-full text-left py-2 px-4 rounded-md transition duration-200 cursor-pointer ${
                pathname === "/"
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              Home
            </div>
            
            {/* Mobile Products Section */}
            <div className="space-y-2">
              <div
                onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                className={`flex items-center justify-between w-full text-left py-2 px-4 rounded-md transition duration-200 cursor-pointer ${
                  productItems.some(item => pathname === item.path)
                    ? "bg-purple-100 text-purple-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                Products
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    productsDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              
              <AnimatePresence>
                {productsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 space-y-1"
                  >
                    {productItems.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <div
                          key={item.path}
                          onClick={() => {
                            setMenuOpen(false);
                            setProductsDropdownOpen(false);
                            handleNavigate(item.path);
                          }}
                          className={`block w-full text-left py-2 px-4 rounded-md transition duration-200 text-sm cursor-pointer ${
                            isActive
                              ? "bg-purple-100 text-purple-600"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.label}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Other Nav Items */}
            {navItems.slice(1).map((item) => {
              const isActive = pathname === item.path;
              return (
                <div
                  key={item.path}
                  onClick={() => {
                    setMenuOpen(false);
                    handleNavigate(item.path);
                  }}
                  className={`block w-full text-left py-2 px-4 rounded-md transition duration-200 cursor-pointer ${
                    isActive
                      ? "bg-purple-100 text-purple-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.label}
                </div>
              );
            })}
            
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 rounded-md transition duration-200 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleNavigate("/sign-in");
                }}
                className="block w-full text-left py-2 px-4 rounded-md transition duration-200 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold"
              >
                Login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Requirement Modal */}
      <Dialog.Root open={showResumeModal} onOpenChange={setShowResumeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 shadow-xl z-[70] animate-scale-in focus:outline-none">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-2">
                Resume Required
              </Dialog.Title>
              
              <Dialog.Description className="text-gray-500 mb-6">
                To access job listings and apply for positions, you need to upload your resume first. This helps employers understand your qualifications.
              </Dialog.Description>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="flex-1 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowResumeModal(false);
                    handleNavigate("/profile");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Go to Profile
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </motion.nav>
  );
}