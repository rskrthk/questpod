'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Target, TrendingUp, ArrowLeft, RotateCcw } from 'lucide-react';
import withAuth from '@/middleware/withAuth';

function FeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    // Get results from sessionStorage (passed from quiz page)
    const storedResults = sessionStorage.getItem('quizResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
      setLoading(false);
    } else {
      // Redirect back to aptitude page if no results found
      router.push('/aptitude');
    }
  }, [router]);

  const handleRetakeQuiz = () => {
    // Use topicKey if available, otherwise map display name back to topic key
    debugger;
    const topicKey = results?.results?.topicKey;
    const topicDisplayName = results?.results?.topic;
    
    if (topicKey) {
      sessionStorage.removeItem('quizResults');
      router.push(`/aptitude/quiz?topic=${topicKey}`);
    } else if (topicDisplayName) {
      // Fallback: Map display names back to topic keys for backward compatibility
      const topicKeyMap = {
        'Quantitative Aptitude': 'quantitative',
        'Logical Reasoning': 'logical',
        'Verbal Ability': 'verbal',
        'General Knowledge': 'general'
      };
      
      const mappedTopicKey = topicKeyMap[topicDisplayName] || topicDisplayName.toLowerCase();
      sessionStorage.removeItem('quizResults');
      router.push(`/aptitude/quiz?topic=${mappedTopicKey}`);
    }
  };

  const handleBackToTopics = () => {
    sessionStorage.removeItem('quizResults');
    router.push('/aptitude');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No results found</p>
          <button
            onClick={handleBackToTopics}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  const { summary, detailedResults, insights, recommendations } = results.results;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToTopics}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Topics
              </button>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-800">Quiz Results</h1>
            </div>
            <button
              onClick={handleRetakeQuiz}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </button>
          </div>

          {/* Score Display */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold text-white mb-4 ${
              summary.performanceColor === 'green' ? 'bg-green-500' :
              summary.performanceColor === 'blue' ? 'bg-blue-500' :
              summary.performanceColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {summary.scorePercentage}%
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{summary.performanceLevel}</h2>
            <p className="text-gray-600">
              {summary.correctAnswers} out of {summary.totalQuestions} questions correct
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Correct</p>
                <p className="text-xl font-semibold text-gray-800">{summary.correctAnswers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Incorrect</p>
                <p className="text-xl font-semibold text-gray-800">{summary.incorrectAnswers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Unanswered</p>
                <p className="text-xl font-semibold text-gray-800">{summary.unansweredQuestions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Time Used</p>
                <p className="text-xl font-semibold text-gray-800">{summary.timeUsed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'summary'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('detailed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'detailed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Detailed Review
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'insights'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Insights & Tips
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Accuracy Rate</span>
                        <span className="font-semibold">{summary.scorePercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            summary.performanceColor === 'green' ? 'bg-green-500' :
                            summary.performanceColor === 'blue' ? 'bg-blue-500' :
                            summary.performanceColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${summary.scorePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Questions:</span>
                        <span className="font-semibold">{summary.totalQuestions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Spent:</span>
                        <span className="font-semibold">{summary.timeUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Performance Level:</span>
                        <span className="font-semibold">{summary.performanceLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'detailed' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Question by Question Review</h3>
                {detailedResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                        {result.isAnswered ? (
                          result.isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        result.isAnswered ? (
                          result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        ) : 'bg-gray-100 text-gray-800'
                      }`}>
                        {result.isAnswered ? (result.isCorrect ? 'Correct' : 'Incorrect') : 'Not Answered'}
                      </span>
                    </div>
                    
                    <p className="text-gray-800 mb-3">{result.question}</p>
                    
                    <div className="space-y-2 mb-3">
                      {result.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded border ${
                            optionIndex === result.correctAnswer
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : optionIndex === result.userAnswer && result.userAnswer !== result.correctAnswer
                              ? 'bg-red-50 border-red-200 text-red-800'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                            <span>{option}</span>
                            {optionIndex === result.correctAnswer && (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                            )}
                            {optionIndex === result.userAnswer && result.userAnswer !== result.correctAnswer && (
                              <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {result.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Explanation:</strong> {result.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Performance Insights
                  </h3>
                  <div className="space-y-3">
                    {insights.map((insight, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations for Improvement</h3>
                  <div className="space-y-3">
                    {recommendations.map((recommendation, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(FeedbackPage, ["admin", "user"]);