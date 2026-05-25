"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaBuilding, FaClock, FaPuzzlePiece, FaBriefcase, FaFileAlt, FaCheckCircle,
  FaBrain, FaMicrophoneAlt, FaUsers, FaGraduationCap, FaChartLine, FaShieldAlt, FaBell, FaCalendarAlt } from "react-icons/fa";
import { ArrowRight, Sparkles } from "lucide-react";

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = (delay = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
});

const problems = [
  { icon: FaClock,        title: "Late intervention",     body: "By the time a teacher notices a struggling student, the semester is nearly over. The warning signs were there weeks earlier — but no system was reading them." },
  { icon: FaPuzzlePiece,  title: "Fragmented tools",      body: "Attendance in one system. Marks in a spreadsheet. Interview prep at a coaching centre. No unified picture of any student's academic journey." },
  { icon: FaBriefcase,    title: "Placement left to chance",body:"Most institutions have no system connecting academic performance to career readiness in a structured, measurable way." },
  { icon: FaFileAlt,      title: "Admissions managed offline",body:"Google Forms, paper applications, Excel tracking. Students fill 10 different forms. Documents are chased by phone." },
];

const tabs = ["Universities", "Colleges", "Schools"];
const tabContent = {
  Universities: {
    heading: "Full institutional intelligence across every department",
    body: "Manage thousands of students across multiple departments with one unified AI-powered system. No IT infrastructure required. Live in 48 hours.",
    benefits: ["Institution-wide analytics dashboard with department drill-down","Predictive dropout alerts across all programs","NAAC-ready attendance and internal marks reports","AI-generated student risk scores","Multi-department quiz and assessment engine","Admissions module for management and PG quota","White-label option under your university brand"],
  },
  Colleges: {
    heading: "From classroom performance to placement-ready graduates",
    body: "For engineering, MBA, and degree colleges, placement rate is everything. QuestPodAI directly connects academic performance to career readiness.",
    benefits: ["AI Placement Portal: JD matching, shortlisting, round tracking, HR screening, offer management","AI Mock Interview for every student","Career readiness score per student — visible to your placement cell in real time","Teacher Copilot: at-risk students and revision suggestions per course automatically","AI quiz question generator saves teacher hours","Student academic report with AI narrative — PDF"],
  },
  Schools: {
    heading: "Simple, reliable, and built for school administration",
    body: "Schools need clarity, not complexity. QuestPodAI gives management full visibility while keeping the experience clean for teachers, students, and parents.",
    benefits: ["Attendance marked in seconds, parents notified instantly","Digital marks entry visible to students immediately","Timetable with 30-minute next-class push notifications","Leave management with one-tap admin approval","Student progress reports as PDF for every student","Parent portal: real-time marks, attendance, and alerts","Quiz engine with automated scoring"],
  },
};

const aiLayers = [
  { icon: FaBrain,       name: "AI Academic Coach",          desc: "Personalised study plans and weak subject detection per student" },
  { icon: FaMicrophoneAlt,name:"AI Interview Engine",        desc: "Real-time scoring on confidence, communication, and accuracy" },
  { icon: FaFileAlt,     name: "AI Resume Analyser",         desc: "ATS optimisation and skill gap analysis against target roles" },
  { icon: FaChartLine,   name: "Predictive Analytics",       desc: "Dropout risk, fail probability, and performance forecasting" },
  { icon: FaUsers,       name: "Teacher Copilot",            desc: "At-risk student alerts and automatic revision suggestions per course" },
  { icon: FaBriefcase,   name: "Placement Intelligence",     desc: "JD–resume matching, shortlisting with bias check, offer tracking" },
  { icon: FaBell,        name: "Smart Notification Engine",  desc: "Contextual alerts for attendance, classes, and exam deadlines" },
  { icon: FaShieldAlt,   name: "Attendance AI",              desc: "75% threshold tracking and attendance compliance prediction" },
  { icon: FaGraduationCap,name:"Admissions AI",             desc: "Automated application screening and document verification" },
];

const onboardingSteps = [
  { day: "Day 1",   step: "Account setup and branding configured" },
  { day: "Day 1",   step: "Student roll and teacher accounts imported" },
  { day: "Day 2",   step: "Teacher and admin training sessions" },
  { day: "Day 3",   step: "Student onboarding and app access" },
  { day: "Day 4–7", step: "Monitored go-live with QuestPodAI support" },
  { day: "Week 2+", step: "Monthly check-ins and ongoing support" },
];

export default function InstitutionsPage() {
  const [activeTab, setActiveTab] = useState("Universities");

  return (
    <Layout>
      {/* ── HERO ── */}
      <section
        className="relative min-h-[88vh] flex items-center px-5 md:px-12 py-28 overflow-hidden"
        style={{ background: "linear-gradient(160deg,#120126 0%,#200742 45%,#31065c 80%,#1a042d 100%)" }}
      >
        <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />
        <motion.div className="blob w-[480px] h-[480px] bg-indigo-600/20"
          animate={{ x:[-30,30,-30], y:[-20,20,-20] }} transition={{ duration:18, repeat:Infinity, ease:"easeInOut" }}
          style={{ top:"-80px", left:"-80px" }} />
        <motion.div className="blob w-[340px] h-[340px] bg-violet-600/20"
          animate={{ x:[20,-20,20], y:[20,-20,20] }} transition={{ duration:22, repeat:Infinity, ease:"easeInOut" }}
          style={{ bottom:"-60px", right:"-60px" }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger(0.1)}>
            <motion.span variants={fadeUp}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-4 py-1.5 rounded-full mb-7">
              <Sparkles size={12} /> For Universities · Colleges · Schools
            </motion.span>

            <motion.h1 variants={fadeUp}
              className="text-4xl sm:text-5xl xl:text-[60px] font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Give Your Institution<br />the Intelligence It Has<br />
              <span className="text-gradient-light">Always Needed</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-indigo-200 text-lg max-w-2xl leading-relaxed mb-10">
              QuestPodAI connects every academic data point — marks, attendance, timetables, assessments,
              and student engagement — into a live, AI-powered picture of every student, every course, and every outcome.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <motion.span whileHover={{ scale:1.04, boxShadow:"0 12px 36px rgba(79,70,229,0.5)" }}
                  whileTap={{ scale:0.97 }} className="btn-primary text-base py-4 px-9 inline-flex">
                  Request a Demo →
                </motion.span>
              </Link>
              <a href="#features">
                <motion.span whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                  className="btn-outline-white text-base py-4 px-9 inline-flex">
                  View Features ↓
                </motion.span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="py-24 px-5 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div className="max-w-3xl mb-14"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label">The Problem</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Most institutions are managing data.<br />Not outcomes.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-500 leading-relaxed">
              Marks are recorded. Attendance is logged. Reports are generated. But nobody is asking —
              or answering — the question that actually matters: which students need help right now, and what should happen next?
            </motion.p>
          </motion.div>

          <motion.div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} variants={stagger(0.06)}>
            {problems.map((p, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y:-5 }}
                className="rounded-2xl p-6 border border-red-100 bg-red-50 hover:shadow-lg transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TABS ── */}
      <section id="features" className="py-24 px-5 md:px-12" style={{ background:"linear-gradient(160deg,#fafafa,#f0f0ff)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label"><Sparkles size={12}/> Choose Your Institution</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Built for Every Type of Institution
            </motion.h2>
          </motion.div>

          {/* Tab buttons */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                className={`px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "text-white shadow-lg"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600"
                }`}
                style={activeTab === tab ? { background:"var(--grad-brand)" } : {}}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
              transition={{ duration:0.28 }}
              className="bg-white rounded-3xl border border-indigo-100 p-8 md:p-12 shadow-xl"
              style={{ boxShadow:"0 20px 60px rgba(124,58,237,0.06)" }}
            >
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-4">{tabContent[activeTab].heading}</h3>
                  <p className="text-gray-600 leading-relaxed">{tabContent[activeTab].body}</p>
                </div>
                <ul className="space-y-3">
                  {tabContent[activeTab].benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background:"var(--grad-brand)" }}>
                        <FaCheckCircle className="w-2.5 h-2.5 text-white" />
                      </span>
                      <span className="text-sm text-gray-700 leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 9 AI LAYERS ── */}
      <section className="py-24 px-5 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label">AI Infrastructure</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              9 AI Engines. One Unified Platform.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Each AI layer solves a specific institutional problem. Together they form the intelligence backbone of QuestPodAI.
            </motion.p>
          </motion.div>

          <motion.div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} variants={stagger(0.05)}>
            {aiLayers.map((layer, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y:-5, boxShadow:"0 20px 50px rgba(124,58,237,0.1)" }}
                className="card group flex items-start gap-4">
                <div className="icon-box-brand shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <layer.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{layer.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{layer.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ONBOARDING TIMELINE ── */}
      <section className="py-24 px-5 md:px-12 relative overflow-hidden"
        style={{ background:"linear-gradient(135deg,#120126,#200742,#31065c)" }}>
        <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div className="text-center mb-14"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label-dark">Zero to Live</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-white tracking-tight">
              Live in 48 hours. Zero IT required.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-indigo-300 max-w-xl mx-auto">
              Cloud-hosted and accessible from any smartphone, tablet, or browser.
            </motion.p>
          </motion.div>

          <motion.div className="space-y-4"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} variants={stagger(0.08)}>
            {onboardingSteps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ x:4, borderColor:"rgba(124,58,237,0.3)" }}
                className="card-dark rounded-2xl px-6 py-4 flex items-center gap-5">
                <span className="text-xs font-bold text-violet-400 bg-violet-950/60 border border-violet-700/50 px-3 py-1 rounded-full shrink-0 min-w-[60px] text-center">
                  {s.day}
                </span>
                <p className="text-violet-200 text-sm">{s.step}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-5 md:px-12 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label"><Sparkles size={12}/> Get Started</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-5">
              Ready to give your institution the intelligence it deserves?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg mb-10 leading-relaxed">
              Schedule a 45-minute demo tailored to your institution. No generic presentations.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.span whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                  className="btn-primary text-base py-4 px-9 inline-flex">
                  Request a Demo →
                </motion.span>
              </Link>
              <a href="mailto:tarun.m@preneurs.in">
                <motion.span whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                  className="btn-outline text-base py-4 px-9 inline-flex">
                  Email Us Directly →
                </motion.span>
              </a>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-6 text-sm text-gray-400">
              Pilot available at no cost · No long-term commitment · Live in 48 hours
            </motion.p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
