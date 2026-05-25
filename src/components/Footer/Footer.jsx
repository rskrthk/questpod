"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaGlobe } from "react-icons/fa";

const footerLinks = {
  Platform: [
    { label: "For Institutions", href: "/institutions" },
    { label: "For Students", href: "/students" },
    { label: "AI Mock Interview", href: "/new-logindashboard" },
    { label: "Resume Builder", href: "/resume-landing" },
    { label: "Aptitude Tests", href: "/aptitude" },
    { label: "AI Academic Coach", href: "/ai-chat" },
  ],
  Institutions: [
    { label: "Universities", href: "/institutions" },
    { label: "Engineering Colleges", href: "/institutions" },
    { label: "MBA Institutes", href: "/institutions" },
    { label: "Schools", href: "/institutions" },
    { label: "Request a Demo", href: "/contact" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative theme-colors text-white overflow-hidden">
      {/* Dot grid overlay */}
      <div className="dot-grid absolute inset-0 opacity-20 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image src="/Questpodai_White.svg" width={150} height={42} alt="QuestPodAI" className="object-contain" />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-7 max-w-xs">
              QuestPodAI is India's Academic Intelligence Platform — connecting students,
              educators, and institutions through AI to deliver better academic outcomes
              and stronger placement results.
            </p>

            {/* Contact mini-list */}
            {/* <div className="space-y-3">
              {[
                { icon: FaEnvelope, label: "tarun.m@preneurs.in",  href: "mailto:tarun.m@preneurs.in"  },
                { icon: FaPhone,    label: "+91-9632520648",        href: "tel:+919632520648"           },
                { icon: FaGlobe,    label: "www.questpodai.com",    href: "https://www.questpodai.com"  },
              ].map((c, i) => (
                <motion.a
                  key={i}
                  href={c.href}
                  target={c.icon === FaGlobe ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 text-white/60 hover:text-white transition text-sm no-underline"
                >
                  <c.icon className="w-4 h-4 text-indigo-400 shrink-0" />
                  {c.label}
                </motion.a>
              ))}
            </div> */}
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-widest">{section}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <motion.span whileHover={{ x: 3 }} className="inline-block">
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white transition text-sm leading-snug"
                      >
                        {link.label}
                      </Link>
                    </motion.span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="rounded-2xl p-8 mb-12 border border-white/10"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-lg font-bold text-white mb-1">Ready to transform your institution?</p>
              <p className="text-white/60 text-sm">See QuestPodAI in action — 45 minute demo, no commitment.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/contact">
                <motion.span
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-indigo-700 bg-white hover:bg-indigo-50 transition cursor-pointer"
                >
                  Request Demo →
                </motion.span>
              </Link>
              <Link href="/sign-in">
                <motion.span
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition cursor-pointer"
                >
                  Start Free →
                </motion.span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>
            © 2026 QuestPodAI by{" "}
            <span className="bg-white text-indigo-700 font-bold px-1.5 py-0.5 rounded text-xs">Preneurs</span>
            . All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
