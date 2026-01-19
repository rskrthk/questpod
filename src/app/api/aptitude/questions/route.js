import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic parameter is required' },
        { status: 400 }
      );
    }

    // Get random questions from question bank
    const questions = await getRandomQuestionsFromBank(topic);

    return NextResponse.json({
      success: true,
      questions,
      topic,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching aptitude questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

async function getRandomQuestionsFromBank(topic) {
  try {
    // Load the question bank
    const questionBankPath = path.join(process.cwd(), 'data', 'questionBank.json');
    let questionBankData = fs.readFileSync(questionBankPath, 'utf8');
    
    // Remove BOM if present
    if (questionBankData.charCodeAt(0) === 0xFEFF) {
      questionBankData = questionBankData.slice(1);
    }
    
    const questionBank = JSON.parse(questionBankData);

    // Get questions for the specified topic
    let topicQuestions = [];
    switch (topic) {
      case 'quantitative':
        topicQuestions = questionBank.quantitative || [];
        break;
      case 'logical':
        topicQuestions = questionBank.logical || [];
        break;
      case 'verbal':
        topicQuestions = questionBank.verbal || [];
        break;
      case 'general':
        topicQuestions = questionBank.general || [];
        break;
      default:
        throw new Error(`Invalid topic: ${topic}`);
    }

    if (topicQuestions.length === 0) {
      throw new Error(`No questions found for topic: ${topic}`);
    }

    // Shuffle the questions array to get random selection
    const shuffledQuestions = [...topicQuestions].sort(() => Math.random() - 0.5);
    
    // Select exactly 30 questions (or all available if less than 30)
    const selectedQuestions = shuffledQuestions.slice(0, Math.min(30, shuffledQuestions.length));

    // Format questions for the frontend
    const formattedQuestions = selectedQuestions.map((q, index) => ({
      id: index + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || 'No explanation available'
    }));

    console.log(`Selected ${formattedQuestions.length} random questions from ${topicQuestions.length} available ${topic} questions`);
    
    return formattedQuestions;

  } catch (error) {
    console.error('Error loading questions from question bank:', error);
    throw error;
  }
}