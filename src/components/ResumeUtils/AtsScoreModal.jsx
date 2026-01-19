import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { XCircle, Award, Lightbulb, TrendingUp, CheckCircle2 } from 'lucide-react';

const DISPLAY_LIMIT = 5; // Number of items to show initially before "Show More"

const AtsScoreModal = ({ atsScore, strengths, suggestions, onClose, isOpen, isLoading }) => {
  // Spring animation for the ATS score
  const animatedScoreValue = useSpring(0, { stiffness: 100, damping: 10 });
  // useTransform creates a new MotionValue that rounds the animatedScoreValue
  const roundedScore = useTransform(animatedScoreValue, (latest) => Math.round(latest));

  // State for "Show More" functionality
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  useEffect(() => {
    if (!isLoading && atsScore !== null) {
      animatedScoreValue.set(atsScore);
    } else {
      // Reset score and "show more" states when loading starts or modal closes
      animatedScoreValue.set(0);
      setShowAllStrengths(false);
      setShowAllSuggestions(false);
    }
  }, [isLoading, atsScore, animatedScoreValue]);

  // Animation variants for the modal backdrop and content
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      y: "-100vh", // Start from above the viewport
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      y: "0", // Slide into view
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150, // Slightly stiffer for quicker appearance
        damping: 15,
        when: "beforeChildren", // Animate modal first, then children
        staggerChildren: 0.08, // Slightly faster stagger
      },
    },
    exit: {
      y: "100vh", // Slide out downwards
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.25, // Quicker exit
      },
    },
  };

  // Animation variants for individual sections within the modal
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Determine border color based on score for visual feedback
  const borderColor = atsScore >= 80 ? 'border-green-500' :
                      atsScore >= 60 ? 'border-yellow-500' :
                      'border-red-500';

  return (
    <AnimatePresence>
      {isOpen && ( // Only render if isOpen is true
        <motion.div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // Close modal when clicking outside backdrop
        >
          <motion.div
            className={`bg-white rounded-xl shadow-2xl max-w-5xl w-full p-8 relative mx-auto my-auto
                        bg-gradient-to-br from-blue-50 to-purple-50 border-t-8 ${borderColor}
                        max-h-[80vh] overflow-y-auto custom-scrollbar`}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <XCircle size={28} />
            </button>

            <motion.h2
              className="text-3xl font-extrabold text-gray-900 mb-6 pb-3 border-b border-gray-200 text-center flex items-center justify-center gap-2"
              variants={itemVariants}
            >
              <Award className="text-blue-600" size={30} /> ATS Score Report
            </motion.h2>

            {isLoading ? (
              <motion.div
                className="flex flex-col items-center justify-center py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Enhanced AI Generation Animation */}
                <div className="relative w-32 h-32 mb-8">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    {/* Outer pulsing circle */}
                    <motion.circle
                      cx="50" cy="50" r="48" fill="none" stroke="#8B5CF6" strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Inner spinning dashed circle */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#6366F1" strokeWidth="3" strokeDasharray="10 10" strokeDashoffset="0">
                      <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 50 50" to="360 50 50"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    {/* Central pulsing dot */}
                    <motion.circle
                      cx="50" cy="50" r="5" fill="#4F46E5"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Abstract data flow lines */}
                    <motion.path
                      d="M 20 30 Q 50 10 80 30 T 50 70 T 20 30"
                      fill="none" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="5 5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.path
                      d="M 80 70 Q 50 90 20 70 T 50 30 T 80 70"
                      fill="none" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="5 5"
                      initial={{ pathLength: 0, x: -10 }}
                      animate={{ pathLength: 1, x: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-blue-700 font-extrabold text-2xl">AI</div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-3">Calculating ATS Score...</p>
                <p className="text-md text-gray-600 text-center max-w-xs">
                  Analyzing your resume for keywords, formatting, and relevance to common job descriptions.
                </p>
              </motion.div>
            ) : (
              <>
                {/* ATS Score at the top */}
                <motion.div className="mb-8 text-center bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg shadow-inner border border-blue-200" variants={itemVariants}>
                  <p className="text-xl font-semibold text-gray-700 mb-3">Your ATS Compatibility Score:</p>
                  <motion.p
                    className={`text-7xl font-extrabold mt-4 drop-shadow-lg ${
                      atsScore >= 80 ? 'text-green-700' :
                      atsScore >= 60 ? 'text-yellow-700' :
                      'text-red-700'
                    }`}
                  >
                    <motion.span>{roundedScore}</motion.span>%
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-3">
                    (Score based on AI evaluation of your resume's content)
                  </p>
                </motion.div>

                {/* Strengths and Suggestions side-by-side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {strengths && strengths.length > 0 && (
                    <motion.div className="bg-green-50 p-5 rounded-lg border border-green-200 shadow-sm" variants={itemVariants}>
                      <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="text-green-600" size={24} /> Key Strengths:
                      </h3>
                      <ol className="list-decimal text-gray-800 space-y-2 pl-5"> {/* Changed to <ol> and added pl-5 for numbering */}
                        {(showAllStrengths ? strengths : strengths.slice(0, DISPLAY_LIMIT)).map((s, index) => (
                          <motion.li key={index} variants={itemVariants} className="text-base p-2 rounded-md hover:bg-green-100 transition-colors duration-150">
                            {s}
                          </motion.li>
                        ))}
                      </ol>
                      {strengths.length > DISPLAY_LIMIT && (
                        <button
                          onClick={() => setShowAllStrengths(!showAllStrengths)}
                          className="mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-200"
                        >
                          {showAllStrengths ? 'Show Less' : `Show More (${strengths.length - DISPLAY_LIMIT} more)`}
                        </button>
                      )}
                    </motion.div>
                  )}

                  {suggestions && suggestions.length > 0 && (
                    <motion.div className="bg-blue-50 p-5 rounded-lg border border-blue-200 shadow-sm" variants={itemVariants}>
                      <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
                        <Lightbulb className="text-blue-600" size={24} /> Suggestions for Improvement:
                      </h3>
                      <ol className="list-decimal text-gray-800 space-y-2 pl-5"> {/* Changed to <ol> and added pl-5 for numbering */}
                        {(showAllSuggestions ? suggestions : suggestions.slice(0, DISPLAY_LIMIT)).map((s, index) => (
                          <motion.li key={index} variants={itemVariants} className="text-base p-2 rounded-md hover:bg-blue-100 transition-colors duration-150">
                            {s}
                          </motion.li>
                        ))}
                      </ol>
                      {suggestions.length > DISPLAY_LIMIT && (
                        <button
                          onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                          className="mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-200"
                        >
                          {showAllSuggestions ? 'Show Less' : `Show More (${suggestions.length - DISPLAY_LIMIT} more)`}
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>

                <motion.div className="mt-8 text-center" variants={itemVariants}>
                  <button
                    onClick={onClose}
                    className="px-10 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                  >
                    Got It!
                  </button>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AtsScoreModal;