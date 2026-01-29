import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

/**
 * Analyzes a resume against a job description to determine eligibility
 * @param {string} resumeText - The extracted text from the resume
 * @param {Object} job - Job object with title, experience, skills, etc.
 * @returns {Promise<{eligible: boolean, reason: string, matchScore: number}>}
 */
export async function analyzeResumeForJob(resumeText, job) {
    try {
        // Use gemini-2.0-flash-exp (matching the working model in the codebase)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are an expert resume analyzer. Analyze the following resume against the job requirements and determine if the candidate is eligible.

**Job Details:**
- Title: ${job.title}
- Company: ${job.company}
- Required Experience: ${job.experience || "Not specified"}
- Required Skills: ${job.skills || "Not specified"}
- Notice Period: ${job.noticePeriod || "Immediate"}
- Job Type: ${job.type || "Not specified"}
- Description: ${job.description || "Not specified"}

**Resume:**
${resumeText.substring(0, 3000)}

**Analysis Instructions:**
1. Check if the candidate has the required skills mentioned in the job (at least 60% match)
2. Check if the candidate's experience level matches or exceeds the required experience
3. Consider if the resume demonstrates relevant expertise and background
4. Provide a match score from 0-100

**Response Format (JSON only):**
{
  "eligible": true/false,
  "reason": "Brief explanation (max 50 words)",
  "matchScore": number between 0-100,
  "keyMatches": ["list", "of", "matching", "skills"],
  "missingSkills": ["list", "of", "missing", "skills"]
}

Provide ONLY the JSON response, no additional text.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("AI response doesn't contain valid JSON:", text);
            throw new Error("Invalid response format from AI");
        }

        const analysis = JSON.parse(jsonMatch[0]);

        return {
            eligible: analysis.eligible || false,
            reason: analysis.reason || "Unable to determine eligibility",
            matchScore: analysis.matchScore || 0,
            keyMatches: analysis.keyMatches || [],
            missingSkills: analysis.missingSkills || []
        };
    } catch (error) {
        console.error("Error analyzing resume for job:", job.title, error);
        console.error("Error details:", error.message);

        // Return a neutral response on error
        return {
            eligible: false,
            reason: "Unable to analyze resume at this time",
            matchScore: 0,
            keyMatches: [],
            missingSkills: []
        };
    }
}

/**
 * Batch analyze resume against multiple jobs
 * @param {string} resumeText - The extracted text from the resume
 * @param {Array} jobs - Array of job objects
 * @returns {Promise<Map<string, Object>>} Map of job IDs to analysis results
 */
export async function batchAnalyzeResume(resumeText, jobs) {
    const analyses = new Map();

    // Process jobs in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);
        const promises = batch.map(job =>
            analyzeResumeForJob(resumeText, job)
                .then(result => ({ jobId: job.id, result }))
        );

        const results = await Promise.all(promises);
        results.forEach(({ jobId, result }) => {
            analyses.set(jobId, result);
        });

        // Small delay between batches to avoid rate limiting
        if (i + batchSize < jobs.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return analyses;
}
