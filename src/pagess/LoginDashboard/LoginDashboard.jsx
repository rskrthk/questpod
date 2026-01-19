"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/lib/dialog";
import { Button } from "@/lib/button";
import { Input } from "@/lib/input";
import { Textarea } from "@/lib/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { makeRandomToken, filterDuplicatesForTopics, addToBank, getExistingTextsForTopics } from "@/utils/localQuestionBank";
import { db } from "@/utils/db";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { MockInterview, userResume } from "@/utils/schema";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import InterviewList from "../InterviewPage/InterviewList";
import FullScreenLoader from "@/lib/FullScreenLoader";
import { useDropzone } from "react-dropzone";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { GrAdd } from "react-icons/gr";
import { MdAdd } from "react-icons/md";
import toast from "react-hot-toast";
import withAuth from "@/middleware/withAuth";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.js`;

const Stepper = ({ step }) => {
  const steps = ["Upload Resume", "Select Topic & Start Interview"];
  return (
    <div className="flex justify-center p-1 mb-6 space-x-10">
      {steps.map((label, index) => {
        const isActive = step === index + 1;
        return (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${
                isActive
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1 text-gray-700 text-center w-max">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

function LoginDashboard() {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const extractTextFromFile = async (file) => {
    if (!file || !file.name) {
      throw new Error("No valid file provided");
    }
    const fileType = file.name.split(".").pop().toLowerCase();

    if (fileType === "pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }
      return text;
    }

    if (fileType === "docx") {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  useEffect(() => {
    if (!openDialog) {
      resetForm();
    }
  }, [openDialog]);

  const handleResumeUpload = async (file) => {
    setIsLoading(true);
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);

      const checkprompt = `Analyze the resume below and respond in this JSON format:${text}`;
      const checkresult = await chatSession.sendMessage(checkprompt);
      const rawcheck = checkresult.response.text().trim();

      // ✅ Insert to DB
      const dbResponses = await db
        .insert(userResume)
        .values({
          resumeJsonString: rawcheck,
          createdBy: email,
        })
        .onConflictDoUpdate({
          target: userResume.createdBy,
          set: {
            resumeJsonString: rawcheck,
            updatedAt: new Date(),
          },
        });

      const prompt = `
Analyze the resume below and extract all distinct technical and soft skills.
**Strictly and exclusively extract skills from sections explicitly titled "Skills," "Technologies," or similar.**
Do not infer or extract any skills from the "Work Experience," "Projects," or any other descriptive sections of the resume.
Categorize all identified skills under a single "topics" array.
Finally, suggest a job position, a brief job description, and estimated years of experience based on the entire resume content.

Respond only in the following JSON format:
{
  "topics": ["skill 1", "skill 2", "skill 3", ...],
  "jobPosition": "Suggested Role",
  "jobDesc": "One line job description summarizing the role",
  "jobExperience": "Estimated years of experience"
}

Resume:
${text}
`;
      const result = await chatSession.sendMessage(prompt);
      const raw = result.response.text().trim();

      console.log("Raw model output:", raw);

      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Model response is not valid JSON.");
      }

      let parsed;
      try {
        parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        throw new Error("Invalid JSON returned from model.");
      }

      setSuggestedTopics(parsed.topics || []);
      setJobPosition(parsed.jobPosition || "");
      setJobDesc(parsed.jobDesc || "");
      setJobExperience(parsed.jobExperience || "");
      setStep(2);
    } catch (err) {
      console.error("Resume analysis failed:", err);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to determine if user is IT-related based on selected topics
  const isITUser = (topics) => {
    const itKeywords = [
      'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue', 'html', 'css',
      'sql', 'mongodb', 'mysql', 'postgresql', 'php', 'c++', 'c#', 'ruby', 'go', 'rust',
      'swift', 'kotlin', 'flutter', 'android', 'ios', 'web development', 'mobile development',
      'software development', 'programming', 'coding', 'algorithm', 'data structure',
      'database', 'api', 'rest', 'graphql', 'microservices', 'cloud', 'aws', 'azure',
      'docker', 'kubernetes', 'devops', 'git', 'github', 'machine learning', 'ai',
      'artificial intelligence', 'data science', 'big data', 'blockchain', 'cybersecurity',
      'network', 'system administration', 'linux', 'unix', 'windows server', 'frontend',
      'backend', 'full stack', 'ui/ux', 'software engineering', 'computer science',
      'information technology', 'it', 'tech', 'technology', 'software', 'hardware',
      'embedded systems', 'iot', 'internet of things', 'automation', 'testing',
      'quality assurance', 'qa', 'selenium', 'cypress', 'jest', 'unit testing'
    ];
    
    return topics.some(topic => 
      itKeywords.some(keyword => 
        topic.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const generateInterview = async () => {
    if (selectedTopics.length < 1 || selectedTopics.length > 3 || !difficulty) {
      toast.error("Select 1 to 3 topics and a difficulty level.");
      return;
    }

    setIsLoading(true);

    try {
      await sendSelectedTopicsToAPI(selectedTopics);

      const questionCount = parseInt(
        process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || "5",
        10
      );

      // Check if user is IT-related
      const userIsIT = isITUser(selectedTopics);

      // --- MODIFIED PROMPT TO LIMIT TOTAL INTERVIEW TIME TO 25-30 MINUTES ---
      let prompt;
      
      const randomnessToken = makeRandomToken();
      if (userIsIT) {
        // Include coding tasks for IT users
        prompt = `
Randomness Token: ${randomnessToken}
Topics: ${selectedTopics.join(", ")}

Generate ${questionCount} ${difficulty}-level mock interview questions and ${questionCount} coding tasks.
- Ensure every item is unique; do not reuse or paraphrase previously common questions.
- Vary subtopics, scenarios, and phrasing; avoid boilerplate.
- Mix theory, practical, debugging, and scenario-style questions.
- Keep total interview duration between 2700 and 3600 seconds.

Return ONLY this JSON:
{
  "codingTasks": [
    { "task": "string", "code": "string", "expectedOutput": "string", "sampleInput": "string", "timeToSolveInSeconds": number }
  ],
  "interviewQuestions": [
    { "question": "string", "answer": "string", "timeToAskInSeconds": number, "timeToAnswerInSeconds": number }
  ],
  "totalTimeInSeconds": number
}`;
      } else {
        // Exclude coding tasks for non-IT users
        prompt = `
Randomness Token: ${randomnessToken}
Topics: ${selectedTopics.join(", ")}

Generate ${questionCount * 2} ${difficulty}-level mock interview questions.
- Ensure every item is unique; do not reuse or paraphrase previously common questions.
- Vary subtopics, scenarios, and phrasing; avoid boilerplate.
- Mix behavioral, situational, and domain knowledge questions relevant to the topics.
- Keep total interview duration between 2700 and 3600 seconds.

Return ONLY this JSON:
{
  "codingTasks": [],
  "interviewQuestions": [
    { "question": "string", "answer": "string", "timeToAskInSeconds": number, "timeToAnswerInSeconds": number }
  ],
  "totalTimeInSeconds": number
}`;
      }
      // --- END MODIFIED PROMPT ---

      const result = await chatSession.sendMessage(prompt);
      const raw = await result.response.text();
      console.log("Raw AI response:", raw);

      // Safer JSON extraction using regex
      const jsonMatch = raw.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        throw new Error("Could not extract JSON from AI response.");
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("JSON parsing error:", e);
        console.log("Faulty JSON string:\n", jsonMatch[0]);
        throw new Error("Failed to parse JSON from model output.");
      }

      let interviewQuestions = parsed.interviewQuestions || [];
      let codingTasks = parsed.codingTasks || [];

      const topicsKey = selectedTopics;
      const existingTexts = getExistingTextsForTopics(topicsKey, 50);

      interviewQuestions = filterDuplicatesForTopics(topicsKey, interviewQuestions, q => q.question);
      codingTasks = filterDuplicatesForTopics(topicsKey, codingTasks, t => t.task || "");

      const desiredInterviewCount = userIsIT ? questionCount : questionCount * 2;
      const desiredCodingCount = userIsIT ? questionCount : 0;

      const interviewDeficit = Math.max(0, desiredInterviewCount - interviewQuestions.length);
      const codingDeficit = Math.max(0, desiredCodingCount - codingTasks.length);

      if (interviewDeficit > 0) {
        const regenPrompt = `
Randomness Token: ${makeRandomToken()}
Topics: ${selectedTopics.join(", ")}
Previously Asked (avoid any overlap): ${JSON.stringify(existingTexts)}
Generate ${interviewDeficit} additional unique interview questions.
Return ONLY JSON { "interviewQuestions": [ { "question": "string", "answer": "string", "timeToAskInSeconds": number, "timeToAnswerInSeconds": number } ] }`;
        const regenRes = await chatSession.sendMessage(regenPrompt);
        const regenRaw = await regenRes.response.text();
        const regenMatch = regenRaw.match(/{[\s\S]*}/);
        if (regenMatch) {
          try {
            const regenObj = JSON.parse(regenMatch[0]);
            const regenQs = Array.isArray(regenObj.interviewQuestions) ? regenObj.interviewQuestions : [];
            const uniqueRegens = filterDuplicatesForTopics(topicsKey, regenQs, q => q.question);
            interviewQuestions = interviewQuestions.concat(uniqueRegens).slice(0, desiredInterviewCount);
          } catch {}
        }
      }

      if (codingDeficit > 0) {
        const regenPrompt2 = `
Randomness Token: ${makeRandomToken()}
Topics: ${selectedTopics.join(", ")}
Previously Asked (avoid any overlap): ${JSON.stringify(existingTexts)}
Generate ${codingDeficit} additional unique coding tasks.
Return ONLY JSON { "codingTasks": [ { "task": "string", "code": "string", "expectedOutput": "string", "sampleInput": "string", "timeToSolveInSeconds": number } ] }`;
        const regenRes2 = await chatSession.sendMessage(regenPrompt2);
        const regenRaw2 = await regenRes2.response.text();
        const regenMatch2 = regenRaw2.match(/{[\s\S]*}/);
        if (regenMatch2) {
          try {
            const regenObj2 = JSON.parse(regenMatch2[0]);
            const regenTasks = Array.isArray(regenObj2.codingTasks) ? regenObj2.codingTasks : [];
            const uniqueTasks = filterDuplicatesForTopics(topicsKey, regenTasks, t => t.task || "");
            codingTasks = codingTasks.concat(uniqueTasks).slice(0, desiredCodingCount);
          } catch {}
        }
      }

      addToBank(topicsKey, interviewQuestions, q => q.question);
      addToBank(topicsKey, codingTasks, t => t.task || "");

      // The AI should now provide a better totalTimeInSeconds, but we can still calculate as fallback.
      const totalTime =
        parsed.totalTimeInSeconds || // Use AI's provided total time if available
        interviewQuestions.reduce(
          (sum, q) =>
            sum + (q.timeToAskInSeconds || 0) + (q.timeToAnswerInSeconds || 0),
          0
        ) +
          codingTasks.reduce(
            (sum, t) => sum + (t.timeToSolveInSeconds || 0),
            0
          ) +
          120; // Keep a small buffer, or remove if not needed.

      const mockId = uuidv4();
      const dbResponse = await db
        .insert(MockInterview)
        .values({
          mockId,
          jsonMockResp: JSON.stringify({ interviewQuestions, codingTasks }),
          createdBy: email,
          createdAt: moment().format("DD-MM-YYYY"),
          totalTimeInSeconds: totalTime, // This value should now be closer to 25-30 mins from AI
          resumeSummary: resumeText,
          difficulty,
          jobPosition,
          jobDesc,
          jobExperience,
        })
        .returning({ mockId: MockInterview.mockId });

      if (!dbResponse?.[0]?.mockId) {
        console.error("DB insertion failed:", dbResponse);
        throw new Error("Failed to insert into database");
      }

      setOpenDialog(false);
      router.push(`/interview/${dbResponse[0].mockId}`);
    } catch (err) {
      console.error("Interview generation error:", err);
      toast.error(
        "Something went wrong while generating the interview. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResumeText("");
    setSuggestedTopics([]);
    setSelectedTopics([]);
    setDifficulty("");
    setJobPosition("");
    setJobDesc("");
    setJobExperience("");
    setStep(1);
  };

  const toggleTopicSelection = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else if (selectedTopics.length < 3) {
      setSelectedTopics([...selectedTopics, topic]);
    } else {
      toast.error("You can select up to 3 topics only.");
    }
  };

  const sendSelectedTopicsToAPI = async (topics) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/student/stack/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stackNames: topics }),
      });

      if (!response.ok) {
        throw new Error("Failed to update stack names.");
      }

      const result = await response.json();
      console.log("Stack update successful:", result);
    } catch (error) {
      console.error("Error sending stack names:", error);
      toast.error("Failed to update your tech stack.");
    }
  };

  const ResumeDropzone = ({ onFileAccepted }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "text/plain": [".txt"],
      },
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0 && acceptedFiles[0]) {
          onFileAccepted(acceptedFiles[0]);
        } else {
          toast.error("Please select a valid file");
        }
      },
    });

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center  hover:border-purple-600 ${
          isDragActive ? "border-purple-600 bg-purple-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm font-medium text-gray-700">
          Drop your resume or click to upload
        </p>
        <p className="text-xs text-gray-500">
          Accepted formats: PDF, DOCX, TXT
        </p>
      </div>
    );
  };

  if (isLoading)
    return <FullScreenLoader message="Processing... Please wait..." />;

  return (
    <Layout>
      <section className="bg-white text-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl mt-10 font-semibold leading-snug text-gray-900 text-center">
            Upload Your Resume to <br />
            <span className="block text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold px-1 theme-colors bg-clip-text text-transparent">
              Generate AI Interview
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600">
            Step 1: Upload → Step 2: Select & Start
          </p>
          <Button
            onClick={() => setOpenDialog(true)}
            className="text-lg px-6 py-3 cursor-pointer space-x-1 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <MdAdd /> <span> Start Interview</span>
          </Button>
        </div>
      </section>

      <section className="py-12 mb-14 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-10">
            Your Interview History
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 max-h-[75vh] overflow-y-auto">
            <InterviewList />
          </div>
        </div>
      </section>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white rounded-xl shadow-2xl max-w-3xl w-[95%] sm:w-full border border-gray-100 p-6 sm:p-8 overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <Stepper step={step} />
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900 pt-4">
              {step === 1 ? "Upload Resume" : "Select Skills & Difficulty"}
            </DialogTitle>
            <DialogDescription asChild>
              {step === 1 ? (
                <div className="mt-6">
                  <ResumeDropzone onFileAccepted={handleResumeUpload} />
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Suggested Skills
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {suggestedTopics.map((topic, i) => (
                        <div
                          key={i}
                          className={`min-h-max border rounded-lg p-3 text-sm overflow-hidden whitespace-pre-wrap cursor-pointer transition-all duration-200 ease-in-out ${
                            selectedTopics.includes(topic)
                              ? "theme-colors text-white border-purple-600 shadow-md transform scale-105"
                              : "bg-white text-gray-800 hover:bg-purple-50 border-gray-200 hover:border-purple-300"
                          }`}
                          onClick={() => toggleTopicSelection(topic)}
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Job Position
                      </label>
                      <Input
                        value={jobPosition}
                        onChange={(e) => setJobPosition(e.target.value)}
                        autoComplete="off"
                        autoFocus={false}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Experience
                      </label>
                      <Input
                        value={jobExperience}
                        onChange={(e) => setJobExperience(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Job Description
                    </label>
                    <Textarea
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Select Difficulty
                    </label>
                    <select
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white pr-8"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="">Select difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={generateInterview}
                      disabled={!selectedTopics || !difficulty}
                      className="px-6 py-3 text-lg rounded-xl shadow-md theme-colors hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200"
                    >
                      Start Interview
                    </Button>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

export default withAuth(LoginDashboard, ["admin", "user"]);
