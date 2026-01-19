"use client";
import React, { useEffect, useState } from "react";
import { FileText, ArrowRight, CheckCircle, Star } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import template11 from "@/assets/dashboard/template1.png";

const ResumeLandingPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleStartBuilding = () => {
    if (isAuthenticated) {
      router.push("/resume");
    } else {
      try { sessionStorage.setItem("redirectAfterLogin", "/resume"); } catch (_) {}
      router.push("/sign-in");
    }
  };

  const handleViewTemplates = () => {
    if (isAuthenticated) {
      router.push("/resume");
    } else {
      try { sessionStorage.setItem("redirectAfterLogin", "/resume"); } catch (_) {}
      router.push("/sign-in");
    }
  };

  return (
    <Layout>
      <section className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-fuchsia-100 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 mt-20 sm:mt-30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 py-8 md:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Build a <span className="theme-text">World-Class Resume</span>
            </h1>

            <p className="text-gray-700 text-base sm:text-lg md:text-lg max-w-xl mx-auto md:mx-0">
              Design your professional resume with our industry-leading
              templates and AI-powered suggestions. Trusted by 2M+ users
              globally.
            </p>

            <ul className="text-sm sm:text-base text-gray-600 space-y-3 max-w-md mx-auto md:mx-0">
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <CheckCircle className="w-5 h-5 text-green-600" />
                AI-Powered Writing Assistance
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Modern Templates for Every Industry
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Download in PDF & DOCX Formats
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-6">
              <button
                onClick={handleStartBuilding}
                className="theme-colors px-6 py-3 text-white font-medium text-sm rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 flex items-center gap-2"
              >
                Start Building
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleViewTemplates}
                className="flex items-center gap-2 px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-100 transition duration-300"
              >
                <FileText className="w-5 h-5 theme-icons" />
                View Templates
              </button>
            </div>

            <div className="pt-4 flex items-center justify-center md:justify-start gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-600">
                Rated <strong>4.9/5</strong> by 50,000+ users
              </span>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-[400px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[420px]">
              <Image
                src={template11}
                alt="Resume Preview"
                width={520}
                height={600}
                className="rounded-xl border border-gray-300 shadow-xl w-full h-auto object-cover"
                priority
              />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-600 px-4 py-2 rounded-xl shadow-md text-sm animate-bounce">
                Live Preview & Customization
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResumeLandingPage;
