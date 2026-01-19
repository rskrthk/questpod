"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  return (
    <footer className="relative theme-colors text-white py-16 px-6 sm:px-10 lg:px-20 overflow-hidden">
      {/* Optional Overlay Blur for Depth */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm pointer-events-none z-0"></div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo & Tagline */}
        <div>
          <Link href="/" className="flex items-center mb-4">
            <Image
              src={"/Questpodai_White.svg"}
              width={160}
              height={80}
              alt="Questpodai Logo"
              className="object-contain"
            />
            {/* <Logos className="w-40 h-20 object-contain" /> */}
          </Link>
          <p className="text-sm text-white/80 leading-relaxed">
            Empowering your career with AI-powered resume building and job tools tailored for the modern era.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/resume-landing" className="hover:text-black transition">Resume Builder</Link></li>
            <li><Link href="/new-logindashboard" className="hover:text-black transition">AI Mock Interview</Link></li>
            <li><Link href="/ai-chat" className="hover:text-black transition">AI Chat</Link></li>
            <li><Link href="/aptitude" className="hover:text-black transition">Aptitude</Link></li>
            {/* <li><Link href="/price" className="hover:text-black transition">Pricing</Link></li> */}
            {!isLoggedIn && (
              <li><Link href="/sign-in" className="hover:text-black transition">Login</Link></li>
            )}
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/about" className="hover:text-black transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-black transition">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-black transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-black transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
          <p className="text-sm text-white/80 mb-4">
            Get the latest updates and resume tips straight to your inbox.
          </p>
          <div className="flex overflow-hidden rounded-md shadow-lg">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-full text-sm bg-white text-black placeholder-gray-500 focus:outline-none"
            />
            <button className="px-4 py-2 text-sm font-semibold text-white bg-black hover:bg-white hover:text-black transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 pt-6 border-t border-white/20 text-center text-sm text-white/70 relative z-10">
        © {new Date().getFullYear()} QuestpodAI by <span className="bg-white text-black font-semibold px-1 rounded">Preneurs</span>. All rights reserved.
      </div>
    </footer>
  );
}
