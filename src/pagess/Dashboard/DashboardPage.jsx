"use client";

import React, { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaComments,
  FaUsers,
  FaCog,
  FaTrophy,
  FaGlobe,
  FaMobileAlt,
  FaCogs,
  FaLightbulb,
} from "react-icons/fa";
import { AiOutlineRobot } from "react-icons/ai";
import HeroSection from "./HeroSection";

const benefits = [
  {
    title: "AI-Powered Interviews",
    description:
      "Conduct real-time mock interviews with instant AI feedback, scoring, and improvement tips.",
    icon: FaTrophy,
  },
  {
    title: "24/7 Practice Access",
    description:
      "Reduce anxiety and practice anytime at your convenience from any device.",
    icon: FaGlobe,
  },
  {
    title: "Resume Perfection",
    description:
      "Build ATS-friendly resumes that stand out to recruiters and bypass filters.",
    icon: FaCogs,
  },
];

const features = [
  {
    title: "Mock Interviews",
    description:
      "Practice job interviews with AI-generated questions and feedback.",
    icon: FaTrophy,
  },
  {
    title: "AI Feedback Engine",
    description: "Get accurate, personalized feedback and score instantly.",
    icon: AiOutlineRobot,
  },
  {
    title: "Resume Builder",
    description:
      "Craft optimized resumes that pass ATS and impress recruiters.",
    icon: FaMobileAlt,
  },
];

const stats = [
  { title: "Mock Interviews Taken", value: "2,340", icon: FaUsers },
  { title: "Resumes Created", value: "1,875", icon: FaChartLine },
  { title: "Avg. Feedback Time", value: "1m 12s", icon: FaComments },
  { title: "Interview Feedback Shared", value: "760", icon: FaLightbulb },
];

const testimonials = [
  {
    name: "Ruthvik R.",
    role: "Senior Software Engineer",
    org: "IT",
    experience: "3–7 years",
    feedback:
      "Custom tailored interview questions based on a candidate's strengths and focus areas would significantly help graduates. AI with proper context of a graduate's technical capabilities can be as powerful as a personal mentor.",
  },
  {
    name: "Swathi R",
    role: "Verification Engineer",
    org: "Semiconductor Industry",
    experience: "3–7 years",
    feedback:
      "Great platform for students to test their skills on a real-time basis which is on par with industry levels according to their core skills.",
  },
  {
    name: "Karthik C",
    role: "Professional",
    org: "Semiconductor",
    experience: "3–7 years",
    feedback:
      "This platform helps freshers get used to realistic questions and prepares them for actual interviews by reflecting industry expectations.",
  },
  {
    name: "Vivek",
    role: "Senior Software Engineer",
    org: "DELL, IT",
    experience: "7–15 years",
    feedback:
      "AI-driven mock interviews and resume builders provide personalized feedback, optimize resumes for applicant tracking systems, and simulate varied interview formats to build real-world readiness. These tools boost confidence and enable continuous improvement through data-driven insights.",
  },
  {
    name: "Karthik",
    role: "Sr. Software Developer",
    org: "Cognizant, IT",
    experience: "3–7 years",
    feedback:
      "AI mock interviews build confidence and structure while quickly diagnosing gaps. AI resume builders tailor content to job descriptions so fresh graduates pass automated screens and reach real interviews faster.",
  },
  {
    name: "Aquib",
    role: "Customer Renewal Specialist",
    org: "TeamViewer / SaaS",
    experience: "0–3 years",
    feedback:
      "Provides exposure to actual interviews and helps build confidence among freshers.",
  },
  {
    name: "Vishal S",
    role: "Method Developer",
    org: "Scania, Automotive",
    experience: "3–7 years",
    feedback:
      "Graduates often lack interview experience and industry relevance. Industry-specific questions bridge this gap effectively.",
  },
  {
    name: "Pallavi B J",
    role: "Team Lead",
    org: "J P Morgan, Finance",
    experience: "7–15 years",
    feedback:
      "AI-driven mock interviews and resume builders offer personalized, data-backed guidance addressing limited experience and interview anxiety, while demystifying hiring processes that rely on automated screening.",
  },
  {
    name: "Amruth",
    role: "Sales Manager",
    org: "KUN Exclusive Cars – BMW Dealership / Sales",
    experience: "7–15 years",
    feedback:
      "There is a gap between classroom theory and practical industry expectations. These tools help freshers overcome that gap and present stronger to potential employers.",
  },
];

export default function LandingPage() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />

      {/* Benefits Section */}
      <section className="bg-white py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why QuestpodAI?
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Prepare smarter and faster with our cutting-edge AI tools.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg hover:-translate-y-1 transition"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-200 to-fuchsia-100 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#6b21a8]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Core Features
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Everything you need for interview and resume success.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3  justify-items-center">
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg hover:border-[#6d28d9] transition flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-200 to-violet-100 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-purple-700" />
                </div>
                <h3 className="text-lg font-semibold  text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm max-w-xs">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-100 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">
            Platform Impact
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition"
              >
                <div className="flex items-center justify-center mb-3 text-violet-700">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-medium text-gray-700 mb-1">
                  {stat.title}
                </h4>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Industry Testimonials</h2>
              <p className="text-gray-600 mt-2">Perspectives from professionals across domains</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
                className="h-10 w-10 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center justify-center"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
                className="h-10 w-10 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center justify-center"
              >
                ›
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative overflow-hidden"
          >
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex-shrink-0 px-1"
                >
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl shadow-sm p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-semibold">
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
                          <span className="text-sm text-gray-600">{t.role}</span>
                          <span className="text-sm text-gray-500">• {t.org}</span>
                          {/* <span className="text-sm text-gray-500">• {t.experience}</span> */}
                        </div>
                        <p className="mt-3 text-gray-800 leading-relaxed">{t.feedback}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 w-2.5 rounded-full ${
                    current === i ? "bg-purple-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
