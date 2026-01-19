import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { topic, questions, answers, timeSpent } = await request.json();

    if (!topic || !questions || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate results
    const results = calculateQuizResults(questions, answers, timeSpent);

    return NextResponse.json({
      success: true,
      results: {
        ...results,
        topic,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error processing quiz submission:', error);
    return NextResponse.json(
      { error: 'Failed to process quiz submission' },
      { status: 500 }
    );
  }
}

function calculateQuizResults(questions, userAnswers, timeSpent) {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  
  const detailedResults = questions.map((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer !== undefined && userAnswer === question.correctAnswer;
    const isAnswered = userAnswer !== undefined;
    
    if (isAnswered) {
      if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    } else {
      unansweredCount++;
    }
    
    return {
      questionId: question.id,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      userAnswer: userAnswer,
      isCorrect,
      isAnswered,
      explanation: question.explanation
    };
  });

  const totalQuestions = questions.length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  
  // Determine performance level
  let performanceLevel = '';
  let performanceColor = '';
  if (scorePercentage >= 90) {
    performanceLevel = 'Excellent';
    performanceColor = 'green';
  } else if (scorePercentage >= 75) {
    performanceLevel = 'Good';
    performanceColor = 'blue';
  } else if (scorePercentage >= 60) {
    performanceLevel = 'Average';
    performanceColor = 'yellow';
  } else {
    performanceLevel = 'Needs Improvement';
    performanceColor = 'red';
  }

  // Calculate time statistics
  const totalTimeAllowed = 30 * 60; // 30 minutes in seconds
  const timeUsed = timeSpent || 0;
  const timeRemaining = totalTimeAllowed - timeUsed;
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Generate insights and recommendations
  const insights = generateInsights(correctCount, incorrectCount, unansweredCount, scorePercentage, timeUsed);

  return {
    summary: {
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unansweredQuestions: unansweredCount,
      scorePercentage,
      performanceLevel,
      performanceColor,
      timeUsed: formatTime(timeUsed),
      timeRemaining: formatTime(timeRemaining)
    },
    detailedResults,
    insights,
    recommendations: generateRecommendations(scorePercentage, incorrectCount, unansweredCount)
  };
}

function generateInsights(correct, incorrect, unanswered, percentage, timeUsed) {
  const insights = [];
  
  // Accuracy insights
  if (percentage >= 90) {
    insights.push("🎉 Outstanding performance! You have excellent command over this topic.");
  } else if (percentage >= 75) {
    insights.push("👍 Good job! You have a solid understanding of the concepts.");
  } else if (percentage >= 60) {
    insights.push("📚 Decent performance, but there's room for improvement.");
  } else {
    insights.push("💪 Don't worry! This is a learning opportunity to strengthen your skills.");
  }

  // Time management insights
  const totalTime = 30 * 60; // 30 minutes
  const timePercentage = (timeUsed / totalTime) * 100;
  
  if (timePercentage < 50) {
    insights.push("⚡ You completed the quiz quickly! Consider spending more time reviewing questions.");
  } else if (timePercentage > 90) {
    insights.push("⏰ You used most of the available time. Practice time management for better efficiency.");
  } else {
    insights.push("⏱️ Good time management! You used your time effectively.");
  }

  // Answer pattern insights
  if (unanswered > 5) {
    insights.push("❓ You left several questions unanswered. Try to attempt all questions even if unsure.");
  } else if (unanswered === 0) {
    insights.push("✅ Great! You attempted all questions, showing good confidence.");
  }

  return insights;
}

function generateRecommendations(percentage, incorrect, unanswered) {
  const recommendations = [];
  
  if (percentage < 60) {
    recommendations.push("📖 Focus on strengthening fundamental concepts in this topic");
    recommendations.push("🎯 Practice more questions to improve accuracy");
    recommendations.push("📝 Review explanations for incorrect answers carefully");
  } else if (percentage < 80) {
    recommendations.push("🔍 Review the questions you got wrong to identify knowledge gaps");
    recommendations.push("📚 Practice advanced level questions to reach the next level");
  } else {
    recommendations.push("🌟 Maintain your excellent performance with regular practice");
    recommendations.push("🎯 Challenge yourself with more complex problems");
  }

  if (unanswered > 3) {
    recommendations.push("⏰ Work on time management to attempt all questions");
    recommendations.push("🤔 Practice educated guessing for uncertain answers");
  }

  if (incorrect > 10) {
    recommendations.push("🎯 Focus on accuracy over speed in your next attempt");
    recommendations.push("📋 Create a study plan targeting your weak areas");
  }

  return recommendations;
}