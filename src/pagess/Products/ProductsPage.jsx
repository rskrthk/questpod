"use client";

import React from "react";
import Layout from "@/components/Layout/Layout";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaMicrophoneAlt,
  FaFileAlt,
  FaCalculator,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const products = [
  {
    icon: FaMicrophoneAlt,
    name: "AI Mock Interview",
    audience: "Students & Institutions",
    description:
      "Practice technical, HR, aptitude, and domain-specific interviews. AI evaluates every answer with scores for confidence, communication, technical accuracy, STAR method, and filler word usage. Model answer provided for every question.",
    available: "Free tier + paid plans",
    cta: "Start practising →",
    href: "/new-logindashboard",
    color: "indigo",
  },
  {
    icon: FaFileAlt,
    name: "AI Resume Builder",
    audience: "Students & Institutions",
    description:
      "Build ATS-optimised resumes with AI content suggestions, skill gap analysis against real job descriptions, cover letter generation, and Word or PDF export.",
    available: "Free tier + paid plans",
    cta: "Build resume →",
    href: "/resume-landing",
    color: "purple",
  },
  {
    icon: FaCalculator,
    name: "Aptitude Tests",
    audience: "Students & Institutions",
    description:
      "Quantitative, logical, and verbal aptitude practice with AI-generated question sets, timed tests, detailed answer explanations, and performance tracking.",
    available: "Free",
    cta: "Start practising →",
    href: "/aptitude",
    color: "indigo",
  },
  {
    icon: FaBuilding,
    name: "Academic Intelligence Platform",
    audience: "Institutions (Universities, Colleges, Schools)",
    description:
      "The complete institutional platform — 14 modules including admissions, marks, attendance, timetable, leave, placement portal, AI coach, teacher copilot, and admin analytics.",
    available: "Institutional licence — request a demo",
    cta: "Request a Demo →",
    href: "/contact",
    color: "purple",
  },
];

const allFeatures = [
  { feature: "AI Mock Interview", universities: true, colleges: true, schools: true, students: true },
  { feature: "AI Resume Builder", universities: true, colleges: true, schools: false, students: true },
  { feature: "AI Academic Coach", universities: true, colleges: true, schools: true, students: true },
  { feature: "Aptitude Tests", universities: true, colleges: true, schools: true, students: true },
  { feature: "Placement Intelligence", universities: true, colleges: true, schools: false, students: false },
  { feature: "Attendance Intelligence", universities: true, colleges: true, schools: true, students: false },
  { feature: "Marks & Grade Reports", universities: true, colleges: true, schools: true, students: false },
  { feature: "Timetable Management", universities: true, colleges: true, schools: true, students: false },
  { feature: "Leave Management", universities: true, colleges: true, schools: true, students: false },
  { feature: "Predictive Dropout Alerts", universities: true, colleges: true, schools: true, students: false },
  { feature: "Teacher Copilot", universities: true, colleges: true, schools: true, students: false },
  { feature: "Admissions Module", universities: true, colleges: true, schools: false, students: false },
  { feature: "Parent Portal", universities: false, colleges: false, schools: true, students: false },
  { feature: "Career Readiness Score", universities: true, colleges: true, schools: false, students: true },
  { feature: "Company-specific Interview Prep", universities: false, colleges: true, schools: false, students: true },
  { feature: "JD–Resume Matching", universities: true, colleges: true, schools: false, students: false },
  { feature: "HR Screening Tools", universities: true, colleges: true, schools: false, students: false },
  { feature: "AI Quiz Generator", universities: true, colleges: true, schools: true, students: false },
  { feature: "White-label Branding", universities: true, colleges: false, schools: false, students: false },
];

const Check = () => <FaCheckCircle className="w-4 h-4 text-indigo-600 mx-auto" />;
const Dash = () => <span className="text-gray-300 mx-auto block text-center">—</span>;

export default function ProductsPage() {
  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-gray-900 to-indigo-950 text-white py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full tracking-wide mb-6"
          >
            All Products
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6"
          >
            One Platform.<br />
            <span className="text-indigo-300">Every Tool You Need.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-indigo-100 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            QuestPodAI's products are available directly to students and as part of the institutional platform. Choose
            what fits your need.
          </motion.p>
        </div>
      </section>

      {/* ── PRODUCT CARDS ── */}
      <section className="bg-white py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            {products.map((p, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`rounded-2xl border p-8 hover:shadow-xl hover:-translate-y-1 transition flex flex-col gap-4 ${
                  p.color === "indigo"
                    ? "border-indigo-100 bg-indigo-50"
                    : "border-purple-100 bg-purple-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    p.color === "indigo" ? "bg-indigo-100" : "bg-purple-100"
                  }`}
                >
                  <p.icon className={`w-6 h-6 ${p.color === "indigo" ? "text-indigo-600" : "text-purple-600"}`} />
                </div>
                <div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-widest ${
                      p.color === "indigo" ? "text-indigo-600" : "text-purple-600"
                    }`}
                  >
                    For: {p.audience}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{p.name}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/60">
                  <span className="text-xs text-gray-500 font-medium">{p.available}</span>
                  <Link href={p.href}>
                    <span
                      className={`inline-flex items-center font-semibold transition cursor-pointer text-sm ${
                        p.color === "indigo"
                          ? "text-indigo-600 hover:text-indigo-800"
                          : "text-purple-600 hover:text-purple-800"
                      }`}
                    >
                      {p.cta}
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES TABLE ── */}
      <section className="bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Everything included in the platform</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full bg-white text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-6 py-4 font-semibold w-1/3">Feature</th>
                  <th className="px-4 py-4 font-semibold text-center">Universities</th>
                  <th className="px-4 py-4 font-semibold text-center">Colleges</th>
                  <th className="px-4 py-4 font-semibold text-center">Schools</th>
                  <th className="px-4 py-4 font-semibold text-center">Students</th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-t border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="px-6 py-3 font-medium text-gray-800">{row.feature}</td>
                    <td className="px-4 py-3 text-center">{row.universities ? <Check /> : <Dash />}</td>
                    <td className="px-4 py-3 text-center">{row.colleges ? <Check /> : <Dash />}</td>
                    <td className="px-4 py-3 text-center">{row.schools ? <Check /> : <Dash />}</td>
                    <td className="px-4 py-3 text-center">{row.students ? <Check /> : <Dash />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-indigo-600 text-white py-16 px-6 md:px-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/contact">
            <button className="px-8 py-3.5 rounded-full font-bold bg-white text-indigo-700 hover:bg-indigo-50 transition shadow-lg cursor-pointer text-base">
              Request a Demo →
            </button>
          </Link>
          <Link href="/sign-in">
            <button className="px-8 py-3.5 rounded-full font-bold border-2 border-white text-white hover:bg-white/10 transition cursor-pointer text-base">
              Start for Free →
            </button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
