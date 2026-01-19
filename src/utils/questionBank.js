// Question Bank Management Utility
// This module handles storing and retrieving previously generated questions
// to prevent repetitive questions across quiz sessions

import fs from 'fs';
import path from 'path';

const QUESTION_BANK_FILE = path.join(process.cwd(), 'data', 'questionBank.json');

// In-memory cache for question bank data
let questionBankCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(QUESTION_BANK_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load existing question bank with caching
export const loadQuestionBank = () => {
  try {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (questionBankCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      return questionBankCache;
    }
    
    ensureDataDirectory();
    let questionBank;
    
    if (fs.existsSync(QUESTION_BANK_FILE)) {
      const data = fs.readFileSync(QUESTION_BANK_FILE, 'utf8');
      questionBank = JSON.parse(data);
    } else {
      questionBank = {
        quantitative: [],
        logical: [],
        verbal: [],
        general: []
      };
    }
    
    // Update cache
    questionBankCache = questionBank;
    cacheTimestamp = now;
    
    return questionBank;
  } catch (error) {
    console.error('Error loading question bank:', error);
    const fallback = {
      quantitative: [],
      logical: [],
      verbal: [],
      general: []
    };
    
    // Cache the fallback to avoid repeated errors
    questionBankCache = fallback;
    cacheTimestamp = Date.now();
    
    return fallback;
  }
};

// Save question bank and invalidate cache
export const saveQuestionBank = (questionBank) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(QUESTION_BANK_FILE, JSON.stringify(questionBank, null, 2));
    
    // Update cache with new data
    questionBankCache = questionBank;
    cacheTimestamp = Date.now();
    
    return true;
  } catch (error) {
    console.error('Error saving question bank:', error);
    return false;
  }
};

// Add new questions to the bank
export const addQuestionsToBank = (topic, questions) => {
  const questionBank = loadQuestionBank();
  
  if (!questionBank[topic]) {
    questionBank[topic] = [];
  }
  
  // Add questions with timestamp
  const questionsWithTimestamp = questions.map(q => ({
    ...q,
    addedAt: new Date().toISOString(),
    questionHash: generateQuestionHash(q.question)
  }));
  
  questionBank[topic].push(...questionsWithTimestamp);
  
  // Keep only the last 500 questions per topic to prevent file from growing too large
  if (questionBank[topic].length > 500) {
    questionBank[topic] = questionBank[topic].slice(-500);
  }
  
  saveQuestionBank(questionBank);
  return questionBank;
};

// Generate a simple hash for question text to check for duplicates
export const generateQuestionHash = (questionText) => {
  // Simple hash function - normalize text and create hash
  const normalized = questionText
    .toLowerCase()
    .replace(/\(question \d+\)$/i, '') // Remove "(Question X)" suffix
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

// Check if a question already exists in the bank
export const isQuestionDuplicate = (topic, questionText) => {
  const questionBank = loadQuestionBank();
  const questionHash = generateQuestionHash(questionText);
  
  if (!questionBank[topic]) {
    return false;
  }
  
  return questionBank[topic].some(q => q.questionHash === questionHash);
};

// Get existing questions for a topic (for reference in AI prompt)
export const getExistingQuestions = (topic, limit = 50) => {
  const questionBank = loadQuestionBank();
  
  if (!questionBank[topic] || questionBank[topic].length === 0) {
    return [];
  }
  
  // Return the most recent questions
  return questionBank[topic]
    .slice(-limit)
    .map(q => q.question);
};

// Filter out duplicate questions from a new set
export const filterDuplicateQuestions = (topic, newQuestions) => {
  const questionBank = loadQuestionBank();
  
  if (!questionBank[topic]) {
    return newQuestions;
  }
  
  const existingHashes = new Set(
    questionBank[topic].map(q => q.questionHash)
  );
  
  return newQuestions.filter(q => {
    const hash = generateQuestionHash(q.question);
    return !existingHashes.has(hash);
  });
};

// Get statistics about the question bank
export const getQuestionBankStats = () => {
  const questionBank = loadQuestionBank();
  
  return {
    quantitative: questionBank.quantitative?.length || 0,
    logical: questionBank.logical?.length || 0,
    verbal: questionBank.verbal?.length || 0,
    general: questionBank.general?.length || 0,
    total: Object.values(questionBank).reduce((sum, questions) => sum + (questions?.length || 0), 0)
  };
};

// Get lightweight recent questions for stats (only question preview and timestamp)
export const getRecentQuestionsForStats = (topic, limit = 5) => {
  const questionBank = loadQuestionBank();
  
  if (!questionBank[topic] || questionBank[topic].length === 0) {
    return [];
  }
  
  // Return only the most recent questions with minimal data
  return questionBank[topic]
    .slice(-limit)
    .map(q => ({
      question: q.question.substring(0, 100) + (q.question.length > 100 ? '...' : ''),
      addedAt: q.addedAt
    }));
};