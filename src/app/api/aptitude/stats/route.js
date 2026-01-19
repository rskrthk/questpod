import { NextRequest, NextResponse } from 'next/server';
import { getQuestionBankStats, getRecentQuestionsForStats } from '@/utils/questionBank';

export async function GET(request) {
  try {
    const stats = getQuestionBankStats();
    
    // Get recent questions for each topic using optimized function
    const topics = ['quantitative', 'logical', 'verbal', 'general'];
    const recentQuestions = {};
    
    topics.forEach(topic => {
      recentQuestions[topic] = getRecentQuestionsForStats(topic, 5);
    });

    return NextResponse.json({
      success: true,
      stats,
      recentQuestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting question bank stats:', error);
    return NextResponse.json(
      { error: 'Failed to get question bank statistics' },
      { status: 500 }
    );
  }
}