"use client";

import React, { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaBuilding, FaGraduationCap, FaBrain, FaChalkboardTeacher,
  FaBriefcase, FaMicrophoneAlt, FaFileAlt, FaClock, FaTrophy,
  FaCalendarAlt, FaCheckCircle, FaExclamationTriangle, FaChartLine,
} from "react-icons/fa";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroSection from "./HeroSection";

/* ── Shared animation presets ── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = (delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
});

/* ── Section wrapper ── */
function Section({ label, heading, sub, children, dark = false, id }) {
  return (
    <section id={id} className={`py-24 px-5 md:px-10 ${dark ? "bg-[#0f0c29]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        {(label || heading || sub) && (
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger()}
          >
            {label && (
              <motion.span variants={fadeUp} className={dark ? "section-label-dark" : "section-label"}>
                {label}
              </motion.span>
            )}
            {heading && (
              <motion.h2
                variants={fadeUp}
                className={`text-4xl md:text-5xl font-extrabold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}
              >
                {heading}
              </motion.h2>
            )}
            {sub && (
              <motion.p
                variants={fadeUp}
                className={`mt-4 text-lg max-w-2xl mx-auto ${dark ? "text-indigo-300" : "text-gray-500"}`}
              >
                {sub}
              </motion.p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ── Data ── */
const stats = [
  { value: "2,340", label: "AI Mock Interviews Completed", icon: FaMicrophoneAlt },
  { value: "1,875", label: "Resumes Built and Optimised", icon: FaFileAlt },
  { value: "1m 12s", label: "Average AI Feedback Delivery Time", icon: FaClock },
  { value: "760", label: "Interview Reports Shared with Recruiters", icon: FaTrophy },
];

const whyCards = [
  { icon: FaBrain, title: "For Students", body: "A personal AI coach that knows your weak subjects, predicts your exam performance, prepares you for interviews, and builds your resume — available 24 hours a day." },
  { icon: FaChalkboardTeacher, title: "For Educators", body: "An AI copilot that tells you which topics confused your class, which students are at risk, and what to revise next — before a single student falls behind." },
  { icon: FaBuilding, title: "For Institutions", body: "Predictive analytics, attendance intelligence, academic performance tracking, and placement dashboards — a live picture of every student and every outcome." },
  { icon: FaBriefcase, title: "For Placement Cells", body: "AI-powered JD–resume matching, structured round tracking, HR screening tools, and offer management — replacing Excel sheets and WhatsApp chains entirely." },
];

const coreFeatures = [
  { icon: FaBrain, title: "AI Academic Coach", body: "Every student gets a personalised AI coach that generates a weekly study plan, detects weak subjects, and predicts next exam performance." },
  { icon: FaMicrophoneAlt, title: "AI Mock Interview", body: "Practice technical, HR, aptitude, and domain-specific interviews with real-time AI scoring on confidence, communication, and accuracy." },
  { icon: FaFileAlt, title: "AI Resume Builder", body: "ATS-optimised resumes with AI content suggestions, skill gap analysis, and target role matching. PDF and Word export included." },
  { icon: FaBriefcase, title: "Placement Intelligence", body: "JD–resume parsing, AI shortlisting with bias check, round-by-round tracking, HR screening, and offer probability prediction." },
  { icon: FaCalendarAlt, title: "Timetable Management", body: "Admin builds the weekly schedule. Students receive AI-contextual next-class notifications. Cancellations managed in one tap." },
  { icon: FaCheckCircle, title: "Attendance Intelligence", body: "Track attendance per session with the 75% threshold warning calculated live. AI predicts compliance for every student." },
  { icon: FaChartLine, title: "Marks & Academic Reports", body: "Teachers enter marks digitally. Students see grades, performance charts, and AI-generated narrative reports instantly." },
  { icon: FaExclamationTriangle, title: "Predictive Dropout Alerts", body: "AI calculates dropout risk and fail probability per student per subject — giving institutions time to intervene." },
];

const audienceCards = [
  {
    color: "from-indigo-600 to-indigo-700",
    iconBg: "bg-white/15",
    icon: FaBuilding,
    label: "For Institutions",
    title: "Universities, Colleges & Schools",
    body: "Deploy QuestPodAI across your institution. Admissions, academic management, AI coaching, timetables, leave management, attendance, placement intelligence — one platform, zero IT setup.",
    cta: "Explore Institutional Platform",
    href: "/institutions",
  },
  {
    color: "from-violet-600 to-purple-700",
    iconBg: "bg-white/15",
    icon: FaGraduationCap,
    label: "For Students",
    title: "Students & Job Seekers",
    body: "Use QuestPodAI directly to prepare for placements. AI mock interviews, resume builder, aptitude tests, and an AI academic coach — no institution required.",
    cta: "Start for Free",
    href: "/students",
  },
];

const institutionCols = [
  { title: "Universities", body: "Manage multiple departments, track institution-wide performance, generate NAAC-ready reports, run admissions digitally, and predict student dropout before it happens." },
  { title: "Colleges", body: "Improve placement rates with AI interview prep, career readiness scores, and a placement intelligence dashboard your placement cell will actually use." },
  { title: "Schools", body: "Track marks and attendance digitally, engage parents in real time, manage timetables and leave, and give every student a clear picture of their academic progress." },
];

const testimonials = [
  { name: "Ruthvik R.", role: "Senior Software Engineer", org: "IT", feedback: "Custom tailored interview questions based on a candidate's strengths and focus areas would significantly help graduates. AI with proper context of a graduate's technical capabilities can be as powerful as a personal mentor." },
  { name: "Swathi R", role: "Verification Engineer", org: "Semiconductor Industry", feedback: "Great platform for students to test their skills on a real-time basis which is on par with industry levels according to their core skills." },
  { name: "Karthik C", role: "Professional", org: "Semiconductor", feedback: "This platform helps freshers get used to realistic questions and prepares them for actual interviews by reflecting industry expectations." },
  { name: "Vivek", role: "Senior Software Engineer", org: "DELL, IT", feedback: "AI-driven mock interviews and resume builders provide personalized feedback, optimize resumes for ATS, and simulate varied interview formats to build real-world readiness." },
  { name: "Karthik", role: "Sr. Software Developer", org: "Cognizant, IT", feedback: "AI mock interviews build confidence and structure while quickly diagnosing gaps. AI resume builders tailor content so fresh graduates pass automated screens faster." },
  { name: "Aquib", role: "Customer Renewal Specialist", org: "TeamViewer / SaaS", feedback: "Provides exposure to actual interviews and helps build confidence among freshers." },
  { name: "Vishal S", role: "Method Developer", org: "Scania, Automotive", feedback: "Graduates often lack interview experience and industry relevance. Industry-specific questions bridge this gap effectively." },
  { name: "Pallavi B J", role: "Team Lead", org: "J P Morgan, Finance", feedback: "AI-driven mock interviews and resume builders offer personalized, data-backed guidance addressing limited experience and interview anxiety." },
  { name: "Amruth", role: "Sales Manager", org: "KUN Exclusive Cars – BMW Dealership", feedback: "There is a gap between classroom theory and practical industry expectations. These tools help freshers overcome that gap and present stronger to potential employers." },
];

/* ── Avatar color helper ── */
function avatarColor(name) {
  const hue = (name.charCodeAt(0) * 37 + name.charCodeAt(1) * 13) % 360;
  return `hsl(${hue}, 65%, 48%)`;
}

export default function LandingPage() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <Layout>
      <HeroSection />

      {/* ══ AUDIENCE SPLIT ══ */}
      <Section label="Who Is QuestPodAI For?" heading="One Platform, Two Audiences.">
        <motion.div
          className="grid gap-6 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger()}
        >
          {audienceCards.map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(79,70,229,0.2)" }}
              className={`relative rounded-3xl p-8 bg-gradient-to-br ${card.color} text-white overflow-hidden group cursor-pointer`}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
              <motion.div
                className="blob w-48 h-48 bg-white/10"
                animate={{ x: [-10, 10, -10], y: [-10, 10, -10] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ top: "-40px", right: "-40px" }}
              />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-5`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2 block">{card.label}</span>
                <h3 className="text-2xl font-extrabold mb-3">{card.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">{card.body}</p>
                <Link href={card.href}>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all duration-200">
                    {card.cta} <ArrowRight size={15} />
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ══ WHY QUESTPODAI ══ */}
      <section className="py-24 px-5 md:px-10" style={{ background: "linear-gradient(160deg,#fafafa,#f0f0ff)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={stagger()}
          >
            <motion.span variants={fadeUp} className="section-label"><Sparkles size={12} /> Why QuestPodAI</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              One Platform. Every Stakeholder.<br />Infinite Outcomes.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              QuestPodAI is not built for one type of user. It is built for the entire academic ecosystem.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            variants={stagger(0.05)}
          >
            {whyCards.map((c, i) => (
              <motion.div
                key={i} variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(79,70,229,0.14)" }}
                className="card group"
              >
                <div className="icon-box mb-5 group-hover:scale-110 transition-transform duration-300">
                  <c.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="py-24 px-5 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={stagger()}
          >
            <motion.span variants={fadeUp} className="section-label">Platform Impact</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Real Impact. Real Numbers.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
              QuestPodAI is live and working. Here is what the platform has delivered so far.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            variants={stagger(0.05)}
          >
            {stats.map((s, i) => (
              <motion.div
                key={i} variants={fadeUp}
                whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(79,70,229,0.14)" }}
                className="card text-center group"
              >
                <div className="icon-box mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <s.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-4xl font-extrabold text-gradient mb-1">{s.value}</p>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="mt-10 text-center text-sm text-gray-400 font-medium"
          >
            Professionals from Dell · JP Morgan · Cognizant · Scania · TeamViewer · BMW · Semiconductor industry have validated our platform.
          </motion.p>
        </div>
      </section>

      {/* ══ CORE FEATURES ══ */}
      <section className="py-24 px-5 md:px-10" style={{ background: "linear-gradient(160deg,#f8f8ff,#f0f0ff)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={stagger()}
          >
            <motion.span variants={fadeUp} className="section-label">Platform Features</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Everything Your Institution Needs.<br />Everything Your Students Deserve.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-500">
              14 integrated modules. 9 AI engines. One platform.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            variants={stagger(0.04)}
          >
            {coreFeatures.map((f, i) => (
              <motion.div
                key={i} variants={fadeUp}
                whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(79,70,229,0.14)" }}
                className="card group"
              >
                <div className="icon-box mb-4 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ FOR INSTITUTIONS DARK STRIP ══ */}
      <section
        className="py-24 px-5 md:px-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0f0c29,#1e1b4b,#2d1b69)" }}
      >
        <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />
        <motion.div
          className="blob w-[500px] h-[500px] bg-indigo-600/15"
          animate={{ x: [-30, 30, -30], y: [-20, 20, -20] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-100px", right: "-100px" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={stagger()}
          >
            <motion.span variants={fadeUp} className="section-label-dark">Built for Institutions</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Give Your Institution the Intelligence<br />It Has Always Needed
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-indigo-300 max-w-2xl mx-auto">
              One AI-powered system that manages academics and drives placement outcomes.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid gap-5 md:grid-cols-3 mb-14"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            variants={stagger(0.08)}
          >
            {institutionCols.map((col, i) => (
              <motion.div
                key={i} variants={fadeUp}
                whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.5)" }}
                className="card-dark rounded-2xl p-7"
              >
                <h3 className="text-lg font-bold text-white mb-3">{col.title}</h3>
                <p className="text-indigo-300 text-sm leading-relaxed">{col.body}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <Link href="/contact">
              <motion.span
                whileHover={{ scale: 1.05, boxShadow: "0 12px 36px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.97 }}
                className="btn-outline-white inline-flex text-base py-4 px-9"
              >
                Request a Demo →
              </motion.span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-24 px-5 md:px-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={stagger()}
          >
            <div>
              <motion.span variants={fadeUp} className="section-label">Industry Voices</motion.span>
              <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-gray-900">
                What Professionals Say
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-3 text-gray-500 max-w-lg">
                Validated by professionals from India's leading companies — the same people who sit across the table in real interviews.
              </motion.p>
            </div>
            <motion.div variants={fadeUp} className="flex gap-2 shrink-0">
              <button
                onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition cursor-pointer"
              >‹</button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition cursor-pointer"
              >›</button>
            </motion.div>
          </motion.div>

          <div
            ref={containerRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="overflow-hidden rounded-3xl"
          >
            <motion.div
              className="flex"
              animate={{ x: `-${current * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0">
                  <div
                    className="rounded-3xl p-8 md:p-10"
                    style={{ background: "linear-gradient(135deg,#eef2ff,#f5f3ff)", border: "1px solid #e0e7ff" }}
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                        style={{ background: avatarColor(t.name) }}
                      >
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                          <span className="font-bold text-gray-900">{t.name}</span>
                          <span className="text-sm text-gray-500">{t.role}</span>
                          <span className="text-sm text-indigo-500 font-medium">· {t.org}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed mt-3 text-[15px]">{t.feedback}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrent(i)}
                animate={{ width: current === i ? 28 : 8, backgroundColor: current === i ? "var(--brand-primary)" : "#d1d5db" }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full cursor-pointer"
              />
            ))}
          </div>

          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-8 text-sm text-gray-400"
          >
            Validated by professionals at Dell · JP Morgan · Cognizant · Scania · TeamViewer · BMW · Semiconductor industry
          </motion.p>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      {/* <section
        className="py-24 px-5 md:px-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#c026d3,#7c3aed)" }}
      >
        <motion.div
          className="blob w-[400px] h-[400px] bg-white/10"
          animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-100px", left: "-80px" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={stagger()}
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5">
              Ready to See It for Yourself?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-indigo-100 text-lg mb-10 leading-relaxed">
              No commitment. No IT setup. Just a live demonstration of what AI-powered
              academic management looks like when it is built for institutions.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.span
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-indigo-700 bg-white hover:bg-indigo-50 transition shadow-xl cursor-pointer text-base"
                >
                  Request a Demo →
                </motion.span>
              </Link>
              <Link href="/students">
                <motion.span
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="btn-outline-white inline-flex text-base py-4 px-8"
                >
                  Start for Free →
                </motion.span>
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-6 text-indigo-200 text-sm">
              On-campus and online demos available across India.
            </motion.p>
          </motion.div>
        </div>
      </section> */}
    </Layout>
  );
}
