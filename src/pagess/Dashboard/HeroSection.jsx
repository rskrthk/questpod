"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaMicrophoneAlt, FaFileAlt, FaBrain, FaRocket, FaLightbulb, FaChartLine } from "react-icons/fa"; // Import new icons for floating elements

export default function HeroSection() {
  // Define animation variants for better control and reusability
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Slightly faster stagger for a snappier entrance
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Reduced y displacement for subtlety
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12, // Slightly more dampening for a smoother stop
        stiffness: 110, // Slightly less stiffness for a softer feel
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 18px 40px rgba(128, 0, 128, 0.3)", // More pronounced purple-tinted shadow
      y: -3, // Subtle lift on hover
    },
    tap: {
      scale: 0.95,
      y: 0,
    },
  };

  // Variants for individual words in the headline
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Variants for floating icons
  const floatingIconVariants = {
    animate: {
      y: ["0%", "10%", "0%"],
      x: ["0%", "5%", "0%"],
      rotate: [0, 5, 0],
      opacity: [0.1, 0.2, 0.1],
    },
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <section className="relative min-h-screen  flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 lg:px-20  py-20 bg-white text-gray-800 overflow-hidden">
      {/* Dynamic Background Pattern with subtle parallax effect and animation */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05, x: "-5%", y: "-5%" }}
        animate={{ opacity: 0.03, scale: 1, x: "0%", y: "0%" }} // Subtle movement for depth
        transition={{ duration: 4, ease: "easeOut" }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://placehold.co/1920x1080/F5F5F5/E0E0E0?text=Subtle+Pattern")', // Placeholder for a very light, subtle pattern
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></motion.div>

      {/* Radial gradient overlay with subtle animation for ethereal feel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.8, ease: "easeInOut" }}
        className="absolute inset-0 z-0"
       
      >
        {/* Animated gradient elements */}
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-purple-100 opacity-20 blur-xl"
          animate={{
            x: ["-10%", "10%", "-10%"],
            y: ["-10%", "10%", "-10%"],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "15%", left: "10%" }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-indigo-200 opacity-20 blur-xl"
          animate={{
            x: ["10%", "-10%", "10%"],
            y: ["10%", "-10%", "10%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ bottom: "20%", right: "15%" }}
        />

        {/* Floating Icons */}
        <motion.div
          className="absolute text-purple-500 text-6xl opacity-10"
          variants={floatingIconVariants}
          style={{ top: "5%", left: "5%" }}
        >
          <FaBrain />
        </motion.div>
        <motion.div
          className="absolute text-purple-500 text-5xl opacity-10"
          variants={floatingIconVariants}
          transition={{ ...floatingIconVariants.transition, duration: 17, delay: 1 }}
          style={{ top: "25%", right: "8%" }}
        >
          <FaRocket />
        </motion.div>
        <motion.div
          className="absolute text-purple-500 text-7xl opacity-10"
          variants={floatingIconVariants}
          transition={{ ...floatingIconVariants.transition, duration: 20, delay: 2 }}
          style={{ bottom: "10%", left: "20%" }}
        >
          <FaLightbulb />
        </motion.div>
        <motion.div
          className="absolute text-purple-500 text-4xl opacity-10"
          variants={floatingIconVariants}
          transition={{ ...floatingIconVariants.transition, duration: 16, delay: 0.5 }}
          style={{ bottom: "5%", right: "30%" }}
        >
          <FaChartLine />
        </motion.div>
      </motion.div>

      {/* Main Content Container: Flexbox for hero and features sections */}
      <motion.div
        className="relative z-10 flex flex-col items-center max-w-8xl w-full gap-14 lg:gap-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Content (Left Side: Text, Right Side: Video) */}
        <div className="flex flex-col lg:flex-col xl:flex-row items-center justify-between w-full gap-14 lg:gap-24">
          {/* Left Side: Text Content */}
          <motion.div
            className="flex flex-col items-center gap-3 lg:items-start text-center lg:text-left w-full xl:w-1/2"
            variants={itemVariants}
          >
            <motion.h1
              className="text-4xl sm:text-5xl max-w-2xl mt-[20px] md:text-5xl tracking-wide xl:text-6xl font-extrabold drop-shadow-sm mb-5 text-gray-700" // Main headline text is black
              variants={containerVariants} // Apply container variants to h1 for staggered word animation
            >
              {"Unlock Your Career Potential with".split(" ").map((word, i) => (
                <motion.span
                  key={word + i}
                  variants={wordVariants}
                  className="inline-block mr-2" // Add margin between words
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                variants={wordVariants}
                className="text-purple-600 px-1 inline-block" // Important text is purple-600
              >
                AI-Powered Tools.
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 max-w-2xl lg:max-w-xl leading-relaxed font-light"
              variants={itemVariants}
            >
              Experience
              <span className="font-semibold px-1 text-purple-600">
                intelligent mock interviews
              </span>
              and craft
              <span className="font-semibold px-1 text-purple-600">
                ATS-optimized resumes
              </span>{" "}
              that give you the
              <span className="font-semibold px-1 text-purple-600">
                competitive edge
              </span>
              .
            </motion.p>
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-gray-700 mb-10 max-w-2xl lg:max-w-xl leading-relaxed font-light"
              variants={itemVariants}
            >
              Our platform leverages cutting-edge artificial intelligence to provide personalized feedback, identify skill gaps, and help you refine your professional narrative. Prepare effectively and confidently for your next career move.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6"
              variants={itemVariants}
            >
              <Link href="/new-logindashboard" passHref>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-8 py-3 rounded-full font-bold bg-purple-600 text-white hover:bg-purple-700 transition duration-300 shadow-lg cursor-pointer text-lg flex items-center gap-2 transform" // Solid purple button
                >
                  <FaMicrophoneAlt className="text-xl" /> Start Interview
                </motion.button>
              </Link>
              <Link href="/resume-landing" passHref>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-8 py-3 rounded-full font-bold border-2 border-purple-600 bg-white text-purple-600 hover:bg-purple-50 transition duration-300 cursor-pointer text-lg flex items-center gap-2 transform" // Outlined purple button
                >
                  <FaFileAlt className="text-xl" /> Build Resume
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side: Video Content with enhanced presentation */}
          <motion.div
            className="w-full xl:w-1/2 flex justify-center items-center mt-12 lg:mt-0"
            variants={itemVariants}
          >
            <div className="relative w-full max-w-3xl aspect-video bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-300 transform rotate-2 hover:rotate-0 transition-transform duration-700 ease-in-out-back group">
              <video
                width="100%"
                height="100%"
                src="https://www.shutterstock.com/shutterstock/videos/3761994365/preview/face-happy-woman-college-graduation-certificate-on.webm" // Keep your video path
                title="AI Questpodai Product Demo"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full rounded-3xl object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
              >
                Your browser does not support the video tag.
              </video>
              {/* Subtle overlay for visual appeal, disappears on hover */}
              <div className="absolute inset-0 bg-purple-900/10 group-hover:opacity-0 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
              {/* Subtle pulsing border animation on video */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(128, 0, 128, 0)",
                    "0 0 15px rgba(128, 0, 128, 0.4)",
                    "0 0 0px rgba(128, 0, 128, 0)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
