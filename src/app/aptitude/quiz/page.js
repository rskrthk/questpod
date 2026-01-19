"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import withAuth from "@/middleware/withAuth";

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");

  const topicNames = {
    quantitative: "Quantitative Aptitude",
    logical: "Logical Reasoning",
    verbal: "Verbal Ability",
    general: "General Knowledge"
  };

  useEffect(() => {
    if (topic) {
      fetchQuestions();
    }
  }, [topic]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, questions.length]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/aptitude/questions?topic=${topic}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions. Please try again.");
      router.push("/aptitude");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit your quiz? You cannot change your answers after submission.')) {
      setSubmitting(true);
      
      try {
        const response = await fetch("/api/aptitude/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: topicNames[topic],
            questions,
            answers: selectedAnswers,
            timeSpent: (30 * 60) - timeLeft
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit quiz");
        }

        const result = await response.json();
        
        // Store results in sessionStorage for the feedback page
        sessionStorage.setItem("quizResults", JSON.stringify(result));
        
        router.push("/aptitude/feedback");
      } catch (error) {
        console.error("Error submitting quiz:", error);
        toast.error("Failed to submit quiz. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(selectedAnswers).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No questions available</h2>
          <button
            onClick={() => router.push("/aptitude")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {topicNames[topic] || "Aptitude Test"}
              </h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Time Remaining</div>
                <div className={`text-xl font-bold ${timeLeft < 300 ? "text-red-600" : "text-purple-600"}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600">Answered</div>
                <div className="text-xl font-bold text-green-600">
                  {getAnsweredCount()}/{questions.length}
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-purple-600 bg-purple-50 text-purple-900"
                      : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-purple-600 bg-purple-600"
                        : "border-gray-300"
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentQuestion === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  index === currentQuestion
                    ? "bg-purple-600 text-white"
                    : selectedAnswers[index] !== undefined
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(QuizPage, ["admin", "user"]);