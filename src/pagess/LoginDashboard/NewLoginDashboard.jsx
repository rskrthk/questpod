"use client";

import React from "react";

import { Mic, Video, Play } from "lucide-react";
import Layout from "@/components/Layout/Layout";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function NewLoginDashboard() {
  const router = useRouter();

  const features = [
    {
      icon: <Mic />,
      title: "Voice Recognition",
      description:
        "Practice speaking clearly and confidently with real-time voice feedback.",
    },
    {
      icon: <Video />,
      title: "Video Analysis",
      description:
        "Get feedback on your body language and presentation skills.",
    },
    {
      icon: <Play />,
      title: "Instant Feedback",
      description:
        "Receive detailed suggestions to improve your interview performance.",
    },
  ];

  const handleDemoClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/login-dashboard");
    } else {
      toast.error("Please log in to use the AI Mock Interview");
      try { sessionStorage.setItem("redirectAfterLogin", "/login-dashboard"); } catch (_) {}
      router.push("/sign-in");
    }
  };

  return (
    <Layout>
      <section className="relative min-h-screen w-full bg-gradient-to-br from-white via-gray-100 to-purple-100 py-20 px-4 sm:px-6 overflow-hidden flex items-center justify-center">
        {/* Glass Background Overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-2xl" />

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-6xl text-center">
          {/* Heading */}
          <div className="mb-14 px-2 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
              AI-Powered Mock Interviews
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
              Practice and perfect your interview skills with cutting-edge AI
              feedback, real-time analysis, and guided improvement.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 px-2 sm:px-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 sm:p-6 text-left hover:-translate-y-1"
              >
                {/* Icon with hover effects */}
                <div className="p-3 rounded-xl inline-block mb-4 bg-purple-100 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-fuchsia-500 transition-all duration-300">
                  {React.cloneElement(feature.icon, {
                    className:
                      "w-6 h-6 text-purple-600 group-hover:text-white transition-all duration-300",
                  })}
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-16 sm:mt-20">
            <button
              onClick={handleDemoClick}
              className="theme-colors bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white font-semibold px-6 sm:px-10 py-3 sm:py-4 rounded-full shadow-md hover:shadow-xl transition-all duration-300 text-base sm:text-lg tracking-wide cursor-pointer"
            >
              Try Mock Interview Demo
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default NewLoginDashboard;
