"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaBrain, FaBuilding, FaGraduationCap, FaChartLine } from "react-icons/fa";
import { Sparkles } from "lucide-react";

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

/* Floating icon widget */
function FloatWidget({ icon: Icon, label, color, style, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "backOut" }}
      style={style}
      className="absolute hidden xl:flex items-center gap-2.5 glass rounded-2xl px-4 py-2.5 shadow-xl pointer-events-none"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-white text-xs font-semibold whitespace-nowrap">{label}</span>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-12 pt-24 pb-16 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f0c29 0%, #1e1b4b 40%, #2d1b69 70%, #1a0533 100%)" }}
    >
      {/* ── Animated mesh blobs ── */}
      <motion.div
        className="blob w-[520px] h-[520px] bg-indigo-600/20"
        animate={{ x: [-40, 40, -40], y: [-20, 20, -20] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "-120px", left: "-120px" }}
      />
      <motion.div
        className="blob w-[400px] h-[400px] bg-violet-600/20"
        animate={{ x: [30, -30, 30], y: [20, -20, 20] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "-60px", right: "-80px" }}
      />
      <motion.div
        className="blob w-[260px] h-[260px] bg-purple-500/15"
        animate={{ x: [-20, 20, -20], y: [-30, 30, -30] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "35%", right: "20%" }}
      />

      {/* Dot grid */}
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-40" />

      {/* Floating widgets */}
      {/* <FloatWidget icon={FaBrain}       label="AI Academic Coach"       color="bg-indigo-500"  style={{ top: "26%",  left:  "7%"  }} delay={0.8} />
      <FloatWidget icon={FaBuilding}    label="Institutional Platform"  color="bg-violet-500"  style={{ top: "38%",  right: "6%"  }} delay={1.0} />
      <FloatWidget icon={FaGraduationCap} label="Career Readiness Score" color="bg-purple-500" style={{ bottom:"28%", left: "8%"  }} delay={1.2} />
      <FloatWidget icon={FaChartLine}   label="Placement Intelligence"  color="bg-fuchsia-500" style={{ bottom:"22%", right:"7%"  }} delay={1.1} /> */}

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.div variants={fadeUp}>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-4 py-1.5 rounded-full mb-7">
            <Sparkles size={12} />
            Academic Intelligence Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl xl:text-[64px] font-extrabold text-white leading-[1.1] tracking-tight mb-6"
        >
          The AI Platform Built for{" "}
          <span className="text-gradient-light">Every Stage</span>
          {" "}of Education
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="text-indigo-200 text-lg sm:text-xl max-w-2xl leading-relaxed mb-4"
        >
          From the first lecture to the first job offer — QuestPodAI connects students,
          educators, and institutions through artificial intelligence.
        </motion.p>

        {/* Body copy */}
        <motion.p
          variants={fadeUp}
          className="text-indigo-300/80 text-base max-w-xl leading-relaxed mb-10"
        >
          Whether you're a student preparing for placement, a teacher tracking your class,
          or an institution driving outcomes — QuestPodAI gives every stakeholder the
          intelligence they need to perform at their best.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/institutions">
            <motion.span
              whileHover={{ scale: 1.04, boxShadow: "0 12px 36px rgba(79,70,229,0.55)" }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-base py-4 px-8 inline-flex"
            >
              For Institutions →
            </motion.span>
          </Link>
          <Link href="/students">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline-white text-base py-4 px-8 inline-flex"
            >
              For Students →
            </motion.span>
          </Link>
        </motion.div>

        {/* Trust line */}
        {/* <motion.div variants={fadeUp} className="flex items-center gap-3 mb-12">
          <div className="flex -space-x-2">
            {["V", "K", "P", "A", "R"].map((l, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-indigo-900 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: `hsl(${245 + i * 20}, 70%, 55%)` }}
              >
                {l}
              </div>
            ))}
          </div>
          <p className="text-indigo-300 text-sm">
            Used by students, teachers & placement cells across India
          </p>
        </motion.div> */}

        {/* Video / Demo card */}
        {/* <motion.div
          variants={fadeUp}
          className="w-full max-w-3xl"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-pulse-glow"
            style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 40px 80px rgba(0,0,0,0.6)" }}
          > */}
            {/* Top bar decoration */}
            {/* <div className="bg-[#1a1840]/90 backdrop-blur px-5 py-3 flex items-center gap-2 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-400/70" />
              <div className="flex-1 mx-4 bg-white/5 rounded-md h-5 flex items-center px-3">
                <span className="text-white/30 text-[10px] font-mono">questpodai.com</span>
              </div>
            </div>
            <div className="aspect-video">
              <video
                width="100%" height="100%"
                src="https://www.shutterstock.com/shutterstock/videos/3761994365/preview/face-happy-woman-college-graduation-certificate-on.webm"
                title="QuestPodAI Platform Demo"
                autoPlay loop muted playsInline preload="auto"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div> */}
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
    </section>
  );
}
