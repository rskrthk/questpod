"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import FullScreenLoader from "@/lib/FullScreenLoader";
import { useDispatch, useSelector } from "react-redux";
import { logout, fetchUserProfile } from "@/redux/slices/authSlice";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { FileText, ArrowRight, ChevronDown } from "lucide-react";

/* ── Shared animation presets ── */
const dropdownVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: "easeOut" } },
  exit:    { opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.12 } },
};

const mobileMenuVariants = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.25, ease: "easeOut" } },
  exit:    { opacity: 0, height: 0,    transition: { duration: 0.18 } },
};

export default function Header() {
  const [menuOpen,            setMenuOpen]            = useState(false);
  const [scrolled,            setScrolled]            = useState(false);
  const [showHeader,          setShowHeader]          = useState(true);
  const [lastScrollY,         setLastScrollY]         = useState(0);
  const [isNavigating,        setIsNavigating]        = useState(false);
  const [isLoggedIn,          setIsLoggedIn]          = useState(false);
  const [userRole,            setUserRole]            = useState(null);
  const [productsOpen,        setProductsOpen]        = useState(false);
  const [activeProductGroup,  setActiveProductGroup]  = useState(null);
  const [showResumeModal,     setShowResumeModal]     = useState(false);

  const router   = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  /* Auth */
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) dispatch(fetchUserProfile());
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try { setUserRole(JSON.parse(userStr).role); }
      catch { /* ignore */ }
    }
  }, [pathname, dispatch]);

  /* Scroll */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setShowHeader(!(y > lastScrollY && y > 80));
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const handleNavigate = (path) => {
    if (pathname === path) return;
    if (path === "/jobs" && isLoggedIn && (!user || !user.resume)) {
      setShowResumeModal(true);
      return;
    }
    setMenuOpen(false);
    setIsNavigating(true);
    router.push(path);
  };

  const handleLogout = async () => {
    setIsNavigating(true);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    dispatch(logout());
    toast.success("Logged out successfully");
    setIsLoggedIn(false);
    router.push("/");
    setTimeout(() => setIsNavigating(false), 800);
  };

  /* Nav items */
  const navItems = [
    { label: "Home",            path: "/" },
    { label: "For Institutions", path: "/institutions" },
    { label: "For Students",    path: "/students" },
    { label: "Case study",      path: "/case-study" },
    ...(isLoggedIn && userRole === "user" ? [{ label: "Jobs",    path: "/jobs"    }] : []),
    ...(isLoggedIn && userRole === "user" ? [{ label: "Profile", path: "/profile" }] : []),
    { label: "About",           path: "/about" },
    { label: "Contact",         path: "/contact" },
  ];

  const productGroups = useMemo(() => [
    {
      label: "University",
      items: [
        { label: "Mock Interview",   path: "/new-logindashboard" },
        { label: "Resume Builder",   path: isLoggedIn ? "/resume" : "/resume-landing" },
        { label: "Attendance",       path: "/attendance" },
        { label: "Chatbot/Admission",path: "/ai-chatbot" },
        { label: "Placement",        path: "/placement" },
      ],
    },
    {
      label: "Student",
      items: [
        { label: "Mock Interview",   path: "/new-logindashboard" },
        { label: "Resume Builder",   path: isLoggedIn ? "/resume" : "/resume-landing" },
        { label: "AI Coach",         path: "/ai-chat" },
        { label: "Aptitude Tests",   path: "/aptitude" },
      ],
    },
  ], [isLoggedIn]);

  const allProductPaths = productGroups.flatMap((g) => g.items.map((i) => i.path));
  const isProductsActive = allProductPaths.includes(pathname);

  if (isNavigating) return <FullScreenLoader />;

  /* ── Nav item component ── */
  const NavItem = ({ item }) => {
    const active = pathname === item.path;
    return (
      <button
        onClick={() => handleNavigate(item.path)}
        className={`relative px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors duration-200 ${
          active
            ? "text-white bg-brand shadow-sm"
            : "text-gray-700 hover:text-indigo-600"
        }`}
      >
        <span className="relative z-10">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-sm"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-5 h-16">

          {/* Logo */}
          <button
            onClick={() => handleNavigate(isLoggedIn ? "/new-logindashboard" : "/")}
            className="flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Image src="/quest_logo.png" width={138} height={38} alt="QuestPodAI" priority />
          </button>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => <NavItem key={item.path} item={item} />)}

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => { setProductsOpen(true); setActiveProductGroup(null); }}
              onMouseLeave={() => { setProductsOpen(false); setActiveProductGroup(null); }}
            >
              <button
                className={`relative px-3.5 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors duration-200 ${
                  isProductsActive ? "text-white bg-brand shadow-sm" : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                <span className="relative z-10">Products</span>
                <ChevronDown
                  size={14}
                  className={`relative z-10 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {productsOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div
                    className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-2 overflow-hidden ${
                      activeProductGroup ? "w-[420px]" : "w-56"
                    }`}
                    style={{ boxShadow: "0 20px 60px rgba(79,70,229,0.15), 0 4px 16px rgba(0,0,0,0.06)" }}
                  >
                    <div className="flex">
                      <div className={activeProductGroup ? "w-44 shrink-0" : "w-full"}>
                      {productGroups.map((group) => {
                        const isActive = activeProductGroup === group.label;
                        return (
                          <div
                            key={group.label}
                            onMouseEnter={() => setActiveProductGroup(group.label)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all duration-150 ${
                              isActive
                                ? "bg-indigo-50 text-indigo-700 font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span>{group.label}</span>
                            <ChevronDown size={13} className="-rotate-90 text-gray-400" />
                          </div>
                        );
                      })}
                    </div>

                    {activeProductGroup && (
                      <div className="flex-1 border-l border-gray-100 pl-2">
                        {productGroups
                          .find((g) => g.label === activeProductGroup)
                          ?.items.map((item) => {
                            const active = pathname === item.path;
                            return (
                              <div
                                key={item.path}
                                onClick={() => handleNavigate(item.path)}
                                className={`px-3 py-2 rounded-xl text-sm cursor-pointer transition-all duration-150 ${
                                  active
                                    ? "bg-indigo-50 text-indigo-600 font-medium"
                                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                              >
                                {item.label}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Auth + Mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Desktop auth */}
            <div className="hidden lg:flex items-center gap-2">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => handleNavigate("/sign-in")}
                  className="px-5 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg
                width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.path;
                return (
                  <div
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`flex items-center w-full text-left py-2.5 px-4 rounded-xl text-sm font-medium cursor-pointer ${
                      active
                        ? "text-white bg-brand"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </div>
                );
              })}

              {/* Mobile Products */}
              <div>
                <div
                  onClick={() => setProductsOpen(!productsOpen)}
                  className={`flex items-center justify-between w-full py-2.5 px-4 rounded-xl text-sm font-medium cursor-pointer ${
                    isProductsActive ? "text-white bg-brand" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Products
                  <ChevronDown size={14} className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
                </div>

                {productsOpen && (
                  <div className="ml-3 mt-1 space-y-0.5">
                    {productGroups.map((group) => (
                      <div key={group.label}>
                        <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          {group.label}
                        </p>
                        {group.items.map((item) => {
                          const active = pathname === item.path;
                          return (
                            <div
                              key={item.path}
                              onClick={() => { setMenuOpen(false); setProductsOpen(false); handleNavigate(item.path); }}
                              className={`py-2 px-4 rounded-xl text-sm cursor-pointer transition-all ${
                                active
                                  ? "text-indigo-600 bg-indigo-50 font-medium"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              {item.label}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile auth */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavigate("/sign-in")}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Resume Modal */}
      <Dialog.Root open={showResumeModal} onOpenChange={setShowResumeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl z-[70] focus:outline-none">
            <div className="flex flex-col items-center text-center">
              <div className="icon-box-brand mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-2">Resume Required</Dialog.Title>
              <Dialog.Description className="text-gray-500 text-sm mb-6">
                To access job listings, please upload your resume first.
              </Dialog.Description>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button onClick={() => setShowResumeModal(false)}
                  className="flex-1 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition cursor-pointer">
                  Cancel
                </button>
                <button onClick={() => { setShowResumeModal(false); handleNavigate("/profile"); }}
                  className="btn-primary flex-1 justify-center">
                  Go to Profile <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
