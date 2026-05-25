"use client";

import React, { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaMicrophoneAlt, FaFileAlt, FaBrain, FaCalculator, FaChartLine, FaCheckCircle } from "react-icons/fa";
import { ArrowRight, Sparkles } from "lucide-react";

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = (delay = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
});

const featureBlocks = [
  { icon: FaMicrophoneAlt, title: "AI Mock Interview",    href: "/new-logindashboard", cta: "Start practising →",
    body: "Practice unlimited mock interviews — technical, HR, aptitude, and domain-specific. AI evaluates your answer in real time: confidence, communication, technical accuracy, STAR method usage, filler words detected. You get a model answer for every question." },
  { icon: FaFileAlt,       title: "AI Resume Builder",    href: "/resume-landing",     cta: "Build your resume →",
    body: "Build an ATS-optimised resume in minutes. AI suggests content based on your target role, identifies skill gaps, and checks your resume against real job descriptions. Download as PDF or Word." },
  { icon: FaBrain,         title: "AI Academic Coach",    href: "/ai-chat",            cta: "Meet your coach →",
    body: "Your personal study coach that analyses your marks, attendance, quiz scores, and study patterns — then generates a personalised weekly plan. Know exactly which subject to focus on today and why." },
  { icon: FaCalculator,    title: "Aptitude Tests",       href: "/aptitude",           cta: "Start practising →",
    body: "Practice quantitative, logical, and verbal aptitude with AI-generated question sets. Timed, scored, and reviewed with explanations — just like the real test." },
];

const howItWorks = [
  { step:"01", title:"Create your profile",    body:"Sign up free. Build your QuestPodAI profile with your academic background, target role, and skills. Takes 5 minutes." },
  { step:"02", title:"Practice and improve",   body:"Attempt mock interviews. Build your resume. Take aptitude tests. Your AI coach tracks your progress and tells you exactly what to improve next." },
  { step:"03", title:"Get placement-ready",    body:"Your career readiness score improves with every session. When the placement drive comes, you are ready." },
];

const scoreFactors = [
  "AI Mock Interview performance across sessions",
  "Resume completeness and ATS score",
  "Aptitude test results",
  "Academic performance (if connected to institution)",
  "Skill coverage vs target role requirements",
];

const freeTier = [
  "2 AI mock interviews per month",
  "1 resume template with AI suggestions",
  "Basic aptitude practice",
  "Career readiness score overview",
];

const paidTier = [
  "Unlimited interviews across all types and difficulties",
  "STAR method analysis and filler word detection",
  "15 resume templates + ATS optimisation",
  "Skill gap analysis against real job descriptions",
  "Company-specific interview preparation",
  "Full career readiness score with competency radar",
];

const testimonials = [
  { name:"Ruthvik R.",  role:"Senior Software Engineer", org:"IT",         feedback:"Custom tailored interview questions based on a candidate's strengths and focus areas would significantly help graduates. AI with proper context of a graduate's technical capabilities can be as powerful as a personal mentor." },
  { name:"Swathi R",    role:"Verification Engineer",    org:"Semiconductor",feedback:"Great platform for students to test their skills on a real-time basis which is on par with industry levels according to their core skills." },
  { name:"Vivek",       role:"Senior Software Engineer", org:"DELL, IT",   feedback:"AI-driven mock interviews and resume builders provide personalized feedback, optimize resumes for ATS, and simulate varied interview formats to build real-world readiness." },
  { name:"Karthik",     role:"Sr. Software Developer",  org:"Cognizant, IT",feedback:"AI mock interviews build confidence and structure while quickly diagnosing gaps. AI resume builders tailor content so fresh graduates pass automated screens faster." },
  { name:"Pallavi B J", role:"Team Lead",               org:"J P Morgan, Finance",feedback:"AI-driven mock interviews and resume builders offer personalized, data-backed guidance addressing limited experience and interview anxiety." },
];

function avatarColor(name) {
  const hue = (name.charCodeAt(0) * 37 + name.charCodeAt(1) * 13) % 360;
  return `hsl(${hue}, 65%, 48%)`;
}

export default function StudentsPage() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <Layout>
      {/* ── HERO ── */}
      <section
        className="relative min-h-[88vh] flex items-center px-5 md:px-12 py-28 overflow-hidden"
        style={{ background: "linear-gradient(160deg,#1a042d 0%,#31065c 40%,#200742 80%,#120126 100%)" }}
      >
        <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />
        <motion.div className="blob w-[480px] h-[480px] bg-violet-600/20"
          animate={{ x:[-30,30,-30], y:[-20,20,-20] }} transition={{ duration:18, repeat:Infinity, ease:"easeInOut" }}
          style={{ top:"-80px", right:"-80px" }} />
        <motion.div className="blob w-[300px] h-[300px] bg-purple-500/20"
          animate={{ x:[20,-20,20], y:[20,-20,20] }} transition={{ duration:14, repeat:Infinity, ease:"easeInOut" }}
          style={{ bottom:"-60px", left:"-40px" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger(0.1)}>
            <motion.span variants={fadeUp}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-300 bg-violet-500/15 border border-violet-500/30 px-4 py-1.5 rounded-full mb-7">
              <Sparkles size={12} /> For Students & Job Seekers
            </motion.span>

            <motion.h1 variants={fadeUp}
              className="text-4xl sm:text-5xl xl:text-[64px] font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Your AI Edge.<br />
              <span className="text-gradient-light">From Exam to Offer Letter.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-violet-200 text-lg max-w-2xl leading-relaxed mb-10">
              QuestPodAI is your personal AI academic coach, interview trainer, and resume builder —
              all in one place. No institution required. Start free today.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/sign-in">
                <motion.span whileHover={{ scale:1.04, boxShadow:"0 12px 36px rgba(124,58,237,0.5)" }}
                  whileTap={{ scale:0.97 }} className="btn-primary text-base py-4 px-9 inline-flex">
                  Start for Free →
                </motion.span>
              </Link>
              <a href="#how-it-works">
                <motion.span whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                  className="btn-outline-white text-base py-4 px-9 inline-flex">
                  See How It Works ↓
                </motion.span>
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="text-violet-400 text-sm">
              2,340 mock interviews completed · Validated by professionals from Dell, JP Morgan, Cognizant & more
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-5 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label"><Sparkles size={12}/> What You Get</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Everything you need to go from student to employed.
            </motion.h2>
          </motion.div>

          <motion.div className="grid gap-6 md:grid-cols-2"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} variants={stagger(0.08)}>
            {featureBlocks.map((f, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y:-6, boxShadow:"0 24px 60px rgba(124,58,237,0.12)" }}
                className="card group">
                <div className="icon-box mb-5 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{f.body}</p>
                <Link href={f.href}>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:gap-3 transition-all group-hover:text-indigo-700 cursor-pointer">
                    {f.cta} <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-5 md:px-12" style={{ background:"linear-gradient(160deg,#fafafa,#f0f0ff)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label">How It Works</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Three steps to placement readiness.
            </motion.h2>
          </motion.div>

          <motion.div className="grid gap-6 md:grid-cols-3"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} variants={stagger(0.1)}>
            {howItWorks.map((h, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y:-5, boxShadow:"0 20px 50px rgba(79,70,229,0.12)" }}
                className="card text-center group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ background:"var(--grad-brand)" }}>
                  <span className="text-white font-extrabold text-sm">{h.step}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-3">{h.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{h.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CAREER READINESS ── */}
      <section className="py-24 px-5 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div className="grid md:grid-cols-2 gap-14 items-center"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <div>
              <motion.span variants={fadeUp} className="section-label">Your Score</motion.span>
              <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-gray-900 tracking-tight mb-5">
                Know exactly where you stand.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 leading-relaxed mb-4">
                Every session you complete updates your Career Readiness Score — a composite measure of your technical
                skills, communication, problem-solving, and resume quality.
              </motion.p>
              <motion.p variants={fadeUp} className="text-gray-500 leading-relaxed">
                You will always know: am I ready — and if not, what exactly needs to improve before the next placement drive.
              </motion.p>
            </div>
            <motion.div variants={fadeUp}
              className="rounded-3xl p-8 border border-indigo-100"
              style={{ background:"var(--grad-subtle)" }}>
              <h3 className="text-sm font-bold text-gray-800 mb-5">What goes into your score:</h3>
              <ul className="space-y-3">
                {scoreFactors.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background:"var(--grad-brand)" }}>
                      <FaCheckCircle className="w-2.5 h-2.5 text-white" />
                    </span>
                    <span className="text-sm text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FREE VS PAID ── */}
      <section className="py-24 px-5 md:px-12 relative overflow-hidden"
        style={{ background:"linear-gradient(135deg,#0f0c29,#1e1b4b,#2d1b69)" }}>
        <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div className="text-center mb-14"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label-dark">Pricing</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-white tracking-tight">
              Start free. No card required.
            </motion.h2>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 gap-6 mb-10"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} variants={stagger(0.1)}>
            <motion.div variants={fadeUp} className="card-dark rounded-2xl p-8">
              <h3 className="text-base font-bold text-white mb-6">Free tier includes:</h3>
              <ul className="space-y-3">
                {freeTier.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FaCheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-indigo-200">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUp}
              className="rounded-2xl p-8 border border-violet-500/30"
              style={{ background:"rgba(124,58,237,0.06)" }}>
              <h3 className="text-base font-bold text-violet-300 mb-6">Upgrade for:</h3>
              <ul className="space-y-3">
                {paidTier.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-violet-400 shrink-0 mt-0.5">→</span>
                    <span className="text-sm text-indigo-200">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-in">
              <motion.span whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                className="btn-primary text-base py-4 px-9 inline-flex">
                Start for Free →
              </motion.span>
            </Link>
            <Link href="/price">
              <motion.span whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                className="btn-outline-white text-base py-4 px-9 inline-flex">
                See all plans →
              </motion.span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-5 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label">Industry Voices</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-gray-900">
              Students who used QuestPodAI got results.
            </motion.h2>
          </motion.div>

          <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="overflow-hidden rounded-3xl">
            <motion.div className="flex" animate={{ x:`-${current * 100}%` }} transition={{ type:"spring", stiffness:300, damping:35 }}>
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0">
                  <div className="rounded-3xl p-8 md:p-10" style={{ background:"linear-gradient(135deg,#f5f3ff,#eef2ff)", border:"1px solid #e0e7ff" }}>
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                        style={{ background:avatarColor(t.name) }}>
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                          <span className="font-bold text-gray-900">{t.name}</span>
                          <span className="text-sm text-gray-500">{t.role}</span>
                          <span className="text-sm text-violet-500 font-medium">· {t.org}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed mt-3 text-[15px]">{t.feedback}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <motion.button key={i} onClick={() => setCurrent(i)}
                animate={{ width: current === i ? 28 : 8, backgroundColor: current === i ? "var(--brand-primary)" : "#d1d5db" }}
                transition={{ duration: 0.3 }} className="h-2 rounded-full cursor-pointer" />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-5 md:px-12 relative overflow-hidden"
        style={{ background:"linear-gradient(135deg,#c026d3,#7c3aed)" }}>
        <motion.div className="blob w-[400px] h-[400px] bg-white/10"
          animate={{ x:[-20,20,-20], y:[-20,20,-20] }} transition={{ duration:16, repeat:Infinity, ease:"easeInOut" }}
          style={{ bottom:"-100px", right:"-80px" }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5">
              Your next interview is your best interview.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-violet-100 text-lg mb-10 leading-relaxed">
              Join thousands of students who are preparing smarter, building stronger resumes, and walking
              into placement drives with confidence.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/sign-in">
                <motion.span whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-violet-700 bg-white hover:bg-violet-50 transition shadow-xl cursor-pointer text-base">
                  Start for Free <ArrowRight size={16} />
                </motion.span>
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-5 text-violet-200 text-sm">
              No credit card required. Free tier available forever.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
