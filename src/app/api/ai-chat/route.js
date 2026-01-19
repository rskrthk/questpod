import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, resumeData, conversationHistory } = await request.json();

    // Use Gemini AI to generate intelligent responses
    const aiResponse = await generateGeminiResponse(message, resumeData, conversationHistory);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

async function generateGeminiResponse(message, resumeData, conversationHistory) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  try {
    // Build context from conversation history
    const conversationContext = conversationHistory
      .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Parse resume data to extract structured information
    let parsedResumeData = null;
    try {
      // Try to parse if resumeData is a JSON string containing parsed data
      if (resumeData && typeof resumeData === 'string' && resumeData.includes('"skills"')) {
        const resumeMatch = resumeData.match(/\{[\s\S]*"skills"[\s\S]*\}/);
        if (resumeMatch) {
          parsedResumeData = JSON.parse(resumeMatch[0]);
        }
      }
    } catch (e) {
      // If parsing fails, we'll work with the raw text
    }

    // Count user messages to track interview progress (excluding initial bot message)
    const userMessages = conversationHistory.filter(msg => msg.type === 'user');
    const questionNumber = userMessages.length + 1;
    const isFirstQuestion = questionNumber === 1;
    const isLastQuestion = questionNumber >= 10;
    const isInterviewComplete = questionNumber > 10;

    // Create a comprehensive prompt for structured interview
    let prompt = '';
    const randomnessToken = `${Date.now()}-${Math.floor(Math.random()*1e9)}`;

    if (isInterviewComplete) {
      // Generate final interview summary
      prompt = `You are an AI interview assistant providing a final interview summary and evaluation.

RANDOMNESS TOKEN: ${randomnessToken}

RESUME CONTEXT:
${resumeData}

${parsedResumeData ? `
STRUCTURED RESUME DATA:
- Name: ${parsedResumeData.name || 'Not specified'}
- Skills: ${parsedResumeData.skills?.join(', ') || 'Not specified'}
- Experience: ${parsedResumeData.experience?.map(exp => `${exp.position} at ${exp.company}`).join(', ') || 'Not specified'}
- Education: ${parsedResumeData.education?.map(edu => edu.degree).join(', ') || 'Not specified'}
` : ''}

COMPLETE INTERVIEW CONVERSATION:
${conversationContext}

INSTRUCTIONS:
Generate a comprehensive interview summary that includes:

1. **Overall Performance Score**: Rate the candidate from 1-10 based on their technical responses
2. **Strengths Identified**: List 3-4 key strengths demonstrated during the interview
3. **Areas for Improvement**: List 2-3 areas where the candidate could improve
4. **Technical Competency Assessment**: Evaluate their knowledge in the technologies mentioned in their resume
5. **Communication Skills**: Rate their ability to explain technical concepts clearly
6. **Final Recommendation**: Provide a hiring recommendation (Strong Hire/Hire/No Hire) with reasoning

Format your response as a professional interview evaluation report. Be constructive and specific in your feedback.`;

    } else {
      // Generate structured interview questions with evaluation
      prompt = `You are an AI interview assistant conducting a structured technical interview with exactly 10 questions.

RANDOMNESS TOKEN: ${randomnessToken}

RESUME CONTEXT (EXTRACTED FROM UPLOADED PDF):
${resumeData}

${parsedResumeData ? `
STRUCTURED RESUME DATA:
- Name: ${parsedResumeData.name || 'Not specified'}
- Skills: ${parsedResumeData.skills?.join(', ') || 'Not specified'}
- Experience: ${parsedResumeData.experience?.map(exp => `${exp.position} at ${exp.company}`).join(', ') || 'Not specified'}
- Education: ${parsedResumeData.education?.map(edu => edu.degree).join(', ') || 'Not specified'}
` : ''}

CONVERSATION HISTORY:
${conversationContext}

CURRENT QUESTION NUMBER: ${questionNumber}/10
LATEST USER MESSAGE: ${message}

INTERVIEW STRUCTURE:
${isFirstQuestion ? `
This is the FIRST question. Start with a warm greeting and ask about their background or a key skill from their resume.
` : `
This is question ${questionNumber} of 10. ${isLastQuestion ? 'This is the FINAL question - make it comprehensive and challenging.' : ''}
`}

CRITICAL INSTRUCTIONS:

1. **ANSWER EVALUATION** (if not first question):
     - If the candidate says "I don't know" or indicates they don't know the answer:
       * Acknowledge their honesty positively
       * Provide a concise, correct answer (2-3 sentences max)
       * Rate as "Learning Opportunity" 
       * Immediately move to the next question
     - For other answers:
       * Provide a very brief evaluation (1 sentence only)
       * Rate their response: Excellent (9-10 out of 10), Good (7-8 out of 10), Average (5-6 out of 10), or Needs Improvement (1-4 out of 10)
       * Keep feedback short and specific

2. **QUESTION GENERATION**:
   - Ask technical questions specifically based on their resume content
   - Progress from basic to advanced concepts
   - Focus on technologies, frameworks, and tools they actually mention
   - Ask about real-world scenarios and problem-solving

3. **QUESTION CATEGORIES** (distribute across 10 questions):
   - Technical Skills (3-4 questions): Deep dive into their listed technologies
   - Problem Solving (2-3 questions): How they approach challenges
   - Experience-Based (2-3 questions): Specific projects and achievements
   - System Design/Architecture (1-2 questions): For senior candidates

4. **INTERVIEW STYLE**:
   - Maintain a professional, encouraging tone
   - Keep responses concise and move quickly between questions
   - Ask follow-up questions when appropriate
   - Keep questions relevant to their resume and experience level
   - Ensure questions test both technical knowledge and practical application
   - Prioritize efficiency - brief evaluations, quick transitions

4. **ACCURACY REQUIREMENTS**:
   - ONLY reference skills and experience EXPLICITLY mentioned in the resume
   - DO NOT assume or infer technologies not clearly stated
   - If information is missing, ask them to clarify

5. **RESPONSE FORMAT**:
${isFirstQuestion ? `
Since this is the first question, just ask your opening question naturally.
` : `
Format your response based on the candidate's previous answer:

IF CANDIDATE SAID "I DON'T KNOW" OR SIMILAR:
Learning Opportunity - Thank you for being honest! [Provide concise correct answer in 2-3 sentences max]

Next Question:
[Your next technical question]

FOR ALL OTHER ANSWERS:
[Very brief evaluation and rating - 1 sentence only]

Next Question:
[Your next technical question]
`}

${isLastQuestion ? `
**IMPORTANT**: After this question, inform them that this concludes the 10-question interview and you'll provide a comprehensive evaluation of their performance.
` : ''}

ADDITIONAL UNIQUENESS REQUIREMENTS:
- Avoid repeating any previously asked questions within this conversation.
- Vary phrasing and scenario style to ensure novelty.
- Use the randomness token to diversify outputs when in doubt.

Generate a professional, technical question that builds on the interview progression while staying true to their actual resume content.`;
    }

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt }
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('').trim() || 
      "I appreciate your response. Could you tell me more about your experience?";

    return aiResponse;

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback response
    return "Thank you for sharing that. Based on your background, I'd like to learn more about your experience. Can you tell me about a challenging project you've worked on?";
  }
}

// Separate endpoint for voice transcription
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert audio file to base64 for Gemini API
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = audioFile.type || 'audio/wav';

    // Use local transcription API on the same origin
    const origin = (() => { try { return new URL(request.url).origin; } catch { return ''; } })();
    const transcriptionUrl = `${origin}/api/gemini-transcribe`;
    const transcriptionResponse = await fetch(transcriptionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mimeType: mimeType,
        base64Audio: base64Audio
      }),
    });

    const transcriptionResult = await transcriptionResponse.json();

    if (!transcriptionResponse.ok) {
      throw new Error(transcriptionResult.error || 'Transcription failed');
    }

    return NextResponse.json({
      success: true,
      transcription: transcriptionResult.transcript || 'Could not transcribe audio',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
