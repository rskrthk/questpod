"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import withAuth from "@/middleware/withAuth";
import Layout from "@/components/Layout/Layout";

const topics = [
  {
    id: "quantitative",
    title: "Quantitative Aptitude",
    description: "Numbers, calculations, and problem-solving",
    icon: "📊",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "logical",
    title: "Logical Reasoning",
    description: "Patterns, sequences, and logical thinking",
    icon: "⚡",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "verbal",
    title: "Verbal Ability",
    description: "Language, comprehension, and communication",
    icon: "💬",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "general",
    title: "General Knowledge",
    description: "Current affairs and general awareness",
    icon: "📚",
    color: "from-blue-500 to-cyan-500"
  }
];

function AptitudePage() {
  const router = useRouter();
  const [questionStats, setQuestionStats] = useState(null);

  useEffect(() => {
    // Fetch question bank statistics
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/aptitude/stats');
        if (response.ok) {
          const data = await response.json();
          setQuestionStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching question stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleTopicSelect = (topicId) => {
    router.push(`/aptitude/quiz?topic=${topicId}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Topic</h1>
          <p className="text-lg text-gray-600">Select a category to start practicing</p>
        </div>

        {/* Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleTopicSelect(topic.id)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 border border-gray-200">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${topic.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl text-white">{topic.icon}</span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="mt-6 flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-2">Start Practice</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-3xl mx-auto border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              How it works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">1</span>
                </div>
                <p className="text-gray-600">Choose your topic</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">2</span>
                </div>
                <p className="text-gray-600">Answer 30 questions</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <p className="text-gray-600">Get detailed feedback</p>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(AptitudePage, ["admin", "user"]);