"use client";

import React from "react";
import { motion } from "framer-motion";
import Layout from "../Layout/Layout";
import Link from "next/link";
import { FaBrain, FaTools, FaDatabase, FaEnvelope, FaPhone, FaGlobe } from "react-icons/fa";
import { ArrowRight, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = (delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
});

const beliefs = [
  { icon: FaBrain, title: "Every student deserves an AI coach.", body: "Not just students who can afford coaching centres. Every student — regardless of their institution's size, city, or budget — deserves personalised, intelligent guidance." },
  { icon: FaTools, title: "Institutions deserve better tools.", body: "Teachers are spending hours on administrative tasks that software should handle. Placement officers are managing Excel sheets. Admins are flying blind without real-time data. That is not acceptable." },
  { icon: FaDatabase, title: "Data should create action, not reports.", body: "There is no shortage of academic data in Indian institutions. There is a shortage of intelligence — systems that look at the data and tell you what to do next." },
];

const journey = ["Admit", "Teach", "Track", "Coach", "Place"];

export default function About() {
  return (
    <Layout>
      {/* ── HERO ── */}
      <section
        className="relative min-h-[80vh] flex items-center px-5 md:px-12 py-28 overflow-hidden"
        style={{ background: "linear-gradient(160deg,#0f0c29 0%,#1e1b4b 50%,#2d1b69 100%)" }}
      >
        <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />
        <motion.div className="blob w-[450px] h-[450px] bg-indigo-600/20"
          animate={{ x: [-30, 30, -30], y: [-20, 20, -20] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-80px", right: "-80px" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger(0.1)}>
            <motion.span variants={fadeUp}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-4 py-1.5 rounded-full mb-8">
              <Sparkles size={12} /> Our Story
            </motion.span>
            <motion.h1 variants={fadeUp}
              className="text-4xl sm:text-5xl xl:text-[60px] font-extrabold text-white leading-[1.1] tracking-tight mb-8">
              We built QuestPodAI because<br />
              <span className="text-gradient-light">Indian students deserve better.</span>
            </motion.h1>
            <motion.div variants={fadeUp} className="space-y-5 text-indigo-200 text-lg leading-relaxed max-w-3xl">
              <p>
                Every year, millions of Indian graduates walk out of colleges unprepared for the workplace —
                not because they are not capable, but because they never had access to the right tools.
              </p>
              <p>
                Coaching centres charge ₹10,000–₹50,000 a month for mock interview practice that a student
                at a rural college cannot afford. Resume guidance is scattered. Academic performance data
                sits in spreadsheets that nobody reads. Placement cells run an entire hiring process on WhatsApp.
              </p>
              <p className="font-bold text-white text-xl">We built QuestPodAI to change that.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT WE BELIEVE ── */}
      <section className="py-24 px-5 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div className="mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label">What We Believe</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Three beliefs that drive everything we build.
            </motion.h2>
          </motion.div>

          <motion.div className="grid gap-6 md:grid-cols-3"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger(0.1)}>
            {beliefs.map((b, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(79,70,229,0.14)" }}
                className="card group">
                <div className="icon-box-brand mb-5 group-hover:scale-110 transition-transform duration-300">
                  <b.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-3">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHAT QUESTPODAI IS ── */}
      <section className="py-24 px-5 md:px-12" style={{ background: "linear-gradient(160deg,#fafafa,#f0f0ff)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label"><Sparkles size={12} /> What QuestPodAI Is</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-8">
              Not an LMS. Not just an interview tool. Something bigger.
            </motion.h2>
            <motion.div variants={fadeUp} className="space-y-5 text-gray-600 text-lg leading-relaxed mb-10">
              <p>
                QuestPodAI is India's Academic Intelligence Platform. It is not a Learning Management System.
                It is not just an interview prep tool. It is not a resume builder.
              </p>
              <p>
                It is all of those things — unified under one AI brain that connects every data point
                and turns it into action for every stakeholder.
              </p>
              <p className="font-bold text-gray-900 text-xl">
                14 modules. 9 AI layers. One mission: from admission to employment, intelligently.
              </p>
            </motion.div>

            {/* Journey */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              {journey.map((word, i) => (
                <React.Fragment key={word}>
                  <motion.span
                    whileHover={{ scale: 1.08 }}
                    className="text-white font-semibold text-sm px-5 py-2.5 rounded-full cursor-default"
                    style={{ background: "linear-gradient(135deg,#d946ef,#8b5cf6)" }}
                  >
                    {word}
                  </motion.span>
                  {i < journey.length - 1 && (
                    <ArrowRight className="text-fuchsia-400 w-4 h-4" />
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── BUILT BY PRENEURS ── */}
      <section className="py-24 px-5 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label">The Team</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-8">
              Built by Preneurs
            </motion.h2>
            <motion.div variants={fadeUp} className="space-y-5 text-gray-600 text-lg leading-relaxed">
              <p>
                QuestPodAI is a product of Preneurs — a team that believes technology should solve real problems
                for real people. We are based in India, we understand the Indian education landscape, and we are
                building a platform that fits the way Indian institutions and students actually work.
              </p>
              <p>
                We are not building for Silicon Valley. We are building for Bangalore, Coimbatore, Nagpur, Lucknow,
                and every other city where a student is preparing for their first job interview on a ₹8,000 smartphone.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      {/* <section className="py-24 px-5 md:px-12 relative overflow-hidden"
        style={{ background:"linear-gradient(135deg,#0f0c29,#1e1b4b,#2d1b69)" }}>
        <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div className="text-center mb-12"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger()}>
            <motion.span variants={fadeUp} className="section-label-dark">Talk To Us</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-white tracking-tight">
              We're easy to reach.
            </motion.h2>
          </motion.div>

          <motion.div className="grid gap-5 sm:grid-cols-3 mb-12"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} variants={stagger(0.1)}>
            {[
              { icon:FaEnvelope, label:"Email",   value:"tarun.m@preneurs.in",  href:"mailto:tarun.m@preneurs.in"  },
              { icon:FaPhone,    label:"Phone",   value:"+91-9632520648",        href:"tel:+919632520648"           },
              { icon:FaGlobe,    label:"Website", value:"www.questpodai.com",    href:"https://www.questpodai.com"  },
            ].map((c, i) => (
              <motion.a key={i} href={c.href} target={c.icon === FaGlobe ? "_blank" : undefined}
                rel="noopener noreferrer" variants={fadeUp}
                whileHover={{ y:-4, borderColor:"rgba(99,102,241,0.5)" }}
                className="card-dark rounded-2xl p-6 text-center flex flex-col items-center gap-3 no-underline">
                <div className="icon-box-brand">
                  <c.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">{c.label}</p>
                <p className="text-indigo-200 text-sm font-medium">{c.value}</p>
              </motion.a>
            ))}
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <motion.span whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                className="btn-primary text-base py-4 px-9 inline-flex">
                Request a Demo →
              </motion.span>
            </Link>
            <Link href="/sign-in">
              <motion.span whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                className="btn-outline-white text-base py-4 px-9 inline-flex">
                Start for Free →
              </motion.span>
            </Link>
          </div>
        </div>
      </section> */}
    </Layout>
  );
}
