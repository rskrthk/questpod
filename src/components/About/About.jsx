"use client";

import React, { useState } from "react"; // Import useState
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaGraduationCap,
  FaRocket,
  FaCheckCircle,
  FaClock,
  FaLightbulb,
  FaCode,
  FaUsers,
  FaBrain,
  FaArrowRight,
  FaLaptopCode,
  FaClipboardList,
  FaChevronDown, // For "Show More"
  FaChevronUp, // For "Show Less"
} from "react-icons/fa";
import Layout from "../Layout/Layout"; // Ensure this path is correct for your project
import Link from "next/link";

// --- Custom Tailwind CSS Configuration & Global Styles ---
// You MUST add these to your tailwind.config.js and global.css files respectively.
// (Already covered in previous responses, just ensure they are present)

const features = [
  {
    icon: FaRocket,
    title: "Industrial-Level Preparation",
    desc: "Simulates real corporate interview environments.",
  },
  {
    icon: FaFileAlt,
    title: "ATS-Optimized Resumes",
    desc: "Pass through automated screenings with ease.",
  },
  {
    icon: FaBrain,
    title: "Smart AI Suggestions",
    desc: "Personalized recommendations for your career goals.",
  },
  {
    icon: FaGraduationCap,
    title: "Student-Focused Design",
    desc: "Tailored for students entering the workforce.",
  },
  {
    icon: FaCheckCircle,
    title: "Instant Feedback",
    desc: "Real-time feedback on interviews and resumes.",
  },
  {
    icon: FaClock,
    title: "24/7 Accessibility",
    desc: "Access the platform anytime, anywhere.",
  },
];

const Section = ({ title, children, id }) => (
  <section
    id={id}
    className="max-w-6xl mx-auto px-6 py-16 md:py-20 relative z-10"
  >
    <motion.h2
      className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-12 text-center relative z-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.5 }}
    >
      {title}
      <span className="block w-24 h-1 bg-purple-600 mx-auto mt-4 rounded-full"></span>{" "}
      {/* Underline effect */}
    </motion.h2>
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  </section>
);

// Custom Divider Component
const Divider = ({ icon: Icon, className = "" }) => (
  <div
    className={`flex items-center justify-center my-16 md:my-20 ${className}`}
  >
    <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent w-1/3"></div>
    {Icon && (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Icon className="text-purple-500 text-3xl md:text-4xl mx-4 animate-pulse-slow" />
      </motion.div>
    )}
    <div className="h-0.5 bg-gradient-to-l from-transparent via-gray-300 to-transparent w-1/3"></div>
  </div>
);

// New component for the service cards with Show More/Less
const ServiceCard = ({
  icon: Icon,
  title,
  description1,
  description2,
  delay = 0,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const toggleText = () => setShowFullText(!showFullText);

  // We'll estimate lines by character count. Adjust `lineLimitChar` as needed.
  // A typical line of text is about 50-70 characters. 6 lines * 60 chars/line = 360 characters.
  const lineLimitChar = 360;
  const combinedDescription = `${description1}\n\n${description2}`;
  const isTextLong = combinedDescription.length > lineLimitChar;

  return (
    <motion.div
      className="relative p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden
                   transform-gpu perspective-1000 group cursor-pointer
                    bg-opacity-5" // Subtle pattern background, adjusted padding
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{
        scale: 1.02,
        boxShadow:
          "0 25px 50px -12px rgba(128, 0, 128, 0.25), 0 10px 20px -5px rgba(128, 0, 128, 0.15)",
        rotateY: title.includes("InterviewAce") ? 2 : -2, // Tilt based on card type
      }}
    >
      {/* Dynamic Border Glow on Hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        initial={{ borderWidth: 0, borderColor: "transparent" }}
        whileInView={{}} // Ensures it's active when in view
        whileHover={{
          borderWidth: 4,
          borderColor: "rgba(168, 85, 247, 0.6)",
          transition: { duration: 0.3 },
        }}
      ></motion.div>

      <div className="relative z-10">
        <div
          className="flex flex-col gap-4 sm:gap-2 items-start sm:flex-row sm:items-center mb-6 pb-4 border-b border-gray-100 group-hover:border-purple-200 transition-colors duration-300"
          onClick={isTextLong ? toggleText : undefined} // Make header clickable for toggle
        >
          <motion.div
            className="text-4xl sm:text-5xl mr-4 p-3 rounded-xl bg-purple-100 group-hover:bg-purple-600 group-hover:text-white
                       transition-all duration-300 transform group-hover:scale-110" // Adjusted icon size for responsiveness
            whileHover={{ rotate: title.includes("InterviewAce") ? 10 : -10 }}
          >
            <Icon className="text-purple-700" /> {/* Icon color moved here */}
          </motion.div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 group-hover:text-purple-800 transition-colors duration-300"> {/* Adjusted heading size for responsiveness */}
            {title}
          </h3>
          {isTextLong && (
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: showFullText ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-auto text-purple-600 text-xl group-hover:text-purple-800"
            >
              <FaChevronDown />
            </motion.span>
          )}
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${
            !showFullText && isTextLong
              ? "max-h-48 overflow-hidden relative"
              : ""
          }`}
        >
          <p className="text-base sm:text-lg leading-relaxed mb-4 text-gray-700"> {/* Adjusted text size for responsiveness */}
            {description1}
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700"> {/* Adjusted text size for responsiveness */}
            {description2}
          </p>
          {!showFullText && isTextLong && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          )}
        </div>

        {isTextLong && (
          <button
            onClick={toggleText}
            className="mt-4 text-purple-600 hover:text-purple-800 font-semibold flex items-center transition-colors duration-200 text-sm sm:text-base" // Adjusted text size for responsiveness
          >
            {showFullText ? "Show Less" : "Show More"}
            {showFullText ? (
              <FaChevronUp className="ml-2 text-xs sm:text-sm" /> // Adjusted icon size for responsiveness
            ) : (
              <FaChevronDown className="ml-2 text-xs sm:text-sm" /> // Adjusted icon size for responsiveness
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default function About() {
  return (
    <Layout>
      <div className="bg-white text-gray-800 font-sans relative overflow-hidden">
        {/* Subtle background overlay patterns for the entire page */}
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/F5F5F5/E0E0E0?text=Subtle+Pattern')] bg-repeat opacity-[0.03] z-0"></div>

        <div className="relative bg-white py-20 md:py-32 text-center text-gray-900 overflow-hidden">
          {/* Floating animated icons */}
          <motion.div
            className="absolute top-1/4 left-1/4 text-purple-300/20 text-6xl md:text-7xl z-0 hidden md:block"
            animate={{ y: [0, 20, 0], x: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaLaptopCode />
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 right-1/4 text-purple-300/20 text-6xl md:text-7xl z-0 hidden md:block"
            animate={{ y: [0, -20, 0], x: [0, 20, 0], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaClipboardList />
          </motion.div>
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-300/20 text-7xl md:text-8xl z-0 hidden md:block"
            animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.1, 0.2] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaBrain />
          </motion.div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 mt-0 lg:mt-6">
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight leading-tight text-gray-900"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Unlock Your Career Potential with{" "}
              <span className="text-purple-600"> QuestpodAI</span>
            </motion.h1>
            <motion.p
              className="text-base md:text-lg font-light px-4 text-gray-700"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We bridge the gap between academic success and career readiness,
              empowering students with cutting-edge AI for interview and resume
              mastery.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link href="/resume-landing" className="inline-flex items-center bg-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg 
              hover:bg-purple-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
                Learn More
                <FaArrowRight className="ml-3 text-lg" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* --- What We Do (Now using ServiceCard component) --- */}
        <Section title="What We Do" id="what-we-do">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 text-gray-700"> {/* Adjusted gap for mobile */}
            <ServiceCard
              icon={FaCode}
              title="AI Mock Interview Platform - InterviewAce"
              description1="Step into a virtual boardroom designed for every academic discipline. Our revolutionary mock interview platform features department-agnostic AI that intelligently generates questions for any field of study—from Engineering and Computer Science to Liberal Arts, Business, Medicine, and beyond. Whether you're a Psychology major preparing for clinical interviews or a Mechanical Engineering student facing technical assessments, our AI understands the unique requirements, terminologies, and expectations of every department."
              description2="Our advanced scenario engine creates authentic interview experiences tailored to your specific academic background and career aspirations. The AI dynamically generates industry-relevant questions, case studies, and situational challenges that reflect real-world scenarios in your field. Practice until you can confidently bridge the gap between classroom theory and industry application, regardless of your major."
              delay={0}
            />
            <ServiceCard
              icon={FaFileAlt}
              title="AI Resume Builder - ResumeGenius"
              description1="Transform your academic achievements into a career-launching resume that beats both robots and recruiters. Our intelligent resume builder doesn't just format your information—it strategically repositions your academic projects, internships, and extracurricular activities into industry-relevant accomplishments that resonate with hiring managers."
              description2="Our proprietary ATS Intelligence Engine scans thousands of job postings in real-time to identify the exact keywords, skills, and formatting preferences that get resumes shortlisted. Watch as our AI suggests powerful action verbs, quantifies your achievements, and restructures your experiences to match what recruiters are actively seeking."
              delay={0.2}
            />
          </div>
        </Section>

        <Divider icon={FaBrain} />

        {/* --- Features --- */}
        <Section title="Why  QuestpodAI?" id="why-AIQuestpodAI">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"> {/* Adjusted grid for better mobile stacking */}
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="p-6 sm:p-8 bg-white rounded-2xl border border-gray-200 shadow-md flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-purple-400 transform hover:-translate-y-2 group" // Adjusted padding for responsiveness
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="text-4xl sm:text-5xl mb-4 p-3 sm:p-4 rounded-full bg-purple-50 group-hover:bg-purple-100 transition-all duration-300 transform group-hover:scale-110"> {/* Adjusted icon size and padding for responsiveness */}
                  <f.icon className="text-purple-600" /> {/* Icon color moved here */}
                </div>
                <h4 className="font-bold text-lg sm:text-xl mb-3 text-gray-900 group-hover:text-purple-800 transition-colors duration-300"> {/* Adjusted heading size for responsiveness */}
                  {f.title}
                </h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300"> {/* Adjusted text size for responsiveness */}
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Divider icon={FaLightbulb} />

        {/* --- Our Mission --- */}
        <Section title="Our Mission" id="our-mission">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-10 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg"> {/* Adjusted padding and gap */}
            <motion.div
              className="md:w-1/3 flex justify-center p-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FaLightbulb className="text-6xl sm:text-7xl opacity-70 text-purple-600" /> {/* Adjusted icon size for responsiveness */}
            </motion.div>
            <motion.p
              className="text-base md:text-lg text-gray-700 text-center md:text-left max-w-2xl md:w-2/3 leading-relaxed"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              We believe every student deserves to enter the job market with
              confidence and industry-ready skills. By harnessing the power of
              artificial intelligence, we're{" "}
              <strong className="text-purple-600">
                democratizing access to professional-grade career preparation
                tools
              </strong>{" "}
              that help students compete at the highest level from day one.
            </motion.p>
          </div>
        </Section>

        <Divider icon={FaUsers} />

        {/* --- Our Vision --- */}
        <Section title="Our Vision" id="our-vision">
          <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-8 sm:gap-10 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg"> {/* Adjusted padding and gap */}
            <motion.div
              className="md:w-1/3 flex justify-center p-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FaUsers className="text-6xl sm:text-7xl opacity-70 text-purple-600" /> {/* Adjusted icon size for responsiveness */}
            </motion.div>
            <motion.p
              className="text-base md:text-lg text-gray-700 text-center md:text-right max-w-2xl md:w-2/3 leading-relaxed"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              We envision a world where every student graduates not just with
              academic knowledge, but with the{" "}
              <strong className="text-purple-600">
                professional skills and confidence to succeed
              </strong>{" "}
              in their chosen career. QuestpodAI is committed to empowering
              students at every stage of their academic journey, from first-year
              undergraduates to graduating seniors, with the tools they need to
              stand out in today's competitive job market.
            </motion.p>
          </div>
        </Section>

        {/* --- Call to Action (Gray background, black text) --- */}
        <div className="bg-gray-50 text-gray-900 text-center py-16 md:py-20 shadow-inner">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-5"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            Ready to launch your career?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl mb-7 max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            Experience the future of career preparation with QuestpodAI. Position
            yourself for career success from day one—your dream job is just a
            practice session away.
          </motion.p>
          <Link href="/" passHref>
            <p
              className="inline-flex items-center justify-center bg-purple-600 text-white px-8 py-3 rounded-full font-bold text-base
                hover:bg-purple-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 group"
            >
              Get Started
              <FaArrowRight className="ml-3 text-lg group-hover:translate-x-1 transition-transform duration-200" />
            </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
