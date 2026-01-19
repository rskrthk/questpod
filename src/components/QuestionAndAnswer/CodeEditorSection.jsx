"use client"; // This directive is essential for Client Components in Next.js

import React, { useState, useRef, useEffect, useMemo } from "react";
// DO NOT import Editor directly from "@monaco-editor/react" here.
// We will import it dynamically.
import dynamic from "next/dynamic"; // Import dynamic from next/dynamic

import { Button } from "@/lib/button";
import {
  Code2,
  ClipboardCheck,
  Terminal,
  SkipForward,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast"; // Ensure react-hot-toast is correctly configured in your app
import { useDispatch, useSelector } from "react-redux";
import { SET_CODE_ANSWER } from "@/redux/slices/codeRecordslice";
import { chatSession } from "@/utils/GeminiAIModel";
import { UserAnswer } from "@/utils/schema";
import { db } from "@/utils/db";
import moment from "moment";
import { useRouter } from "next/navigation"; // Import useRouter

const supportedLanguages = [
  "javascript",
  "typescript",
  "html",
  "css",
  "json",
  "python",
  "php",
  "cpp",
  "c",
  "csharp",
  "java",
  "kotlin",
  "go",
  "rust",
  "ruby",
  "r",
  "swift",
  "sql",
  "shell",
  "powershell",
  "dockerfile",
  "yaml",
  "markdown",
  "ini",
  "perl",
  "lua",
  "plaintext",
  "solidity",
  "haskell",
];

const getLanguage = (lang) =>
  supportedLanguages.includes(lang) ? lang : "plaintext";

const CodeEditorSection = ({
  task,
  interviewData,
  goToNext,
  showSkipButton,
  mockInterviewQuestion,
  handleSkip,
  activeQuestionIndex,
  setAnswerSaved,
  totalTimeInSeconds,
  setInterviewTimeLeft, // ✅ new prop
}) => {
  // Dynamically import Editor only on the client side
  // This is the key fix for "window is not defined"
  const Editor = useMemo(
    () =>
      dynamic(
        () => import("@monaco-editor/react").then((mod) => mod.Editor),
        { ssr: false } // Crucial: This tells Next.js to skip SSR for this component
      ),
    []
  );

  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useState("vs-dark"); // State for theme, though currently fixed to vs-dark
  const [language, setLanguage] = useState("javascript");
  const [isAnswerUpdated, setIsAnswerUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(totalTimeInSeconds);
  const [email, setEmail] = useState(null);
  const toastIdRef = useRef(null);
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const { codeAnswer } = useSelector((state) => state.codeRecord);
  const { user } = useSelector((state) => state.auth);
  const router = useRouter(); // Initialize useRouter

  // Auto-set language based on task
  useEffect(() => {
    setLanguage(getLanguage(task?.language || "javascript"));
  }, [task?.language]);

  // Auto-save code changes
  useEffect(() => {
    // Only save if code is not empty, preventing saving of initial empty state if not intended
    if (code) {
      localStorage.setItem(`code-${task?.id}`, code);
    }
  }, [code, task?.id]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(user?.email || storedEmail);
  }, [user]);

  useEffect(() => {
    // const questionTime =
    //   totalTimeInSeconds ||
    //   interviewData?.totalTimeInSeconds ||
    //   task?.timeToSolveInSeconds ||
    //   600; // Default to 10 minutes if no time is provided

    setRemainingTime(remainingTime);

    // Clear any existing interval before setting a new one
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          toast.error("Time's up! Auto-submitting your answer.");
          handleSubmit(); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [totalTimeInSeconds, interviewData, task?.timeToSolveInSeconds]); // Added task?.timeToSolveInSeconds to dependencies

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const showSingleToast = (message) => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current); // Dismiss previous toast
    }
    toastIdRef.current = toast.error(message); // Show new toast and store ID
  };

  const handleSubmit = () => {
    if (!code.trim() || submitted || isLoading) {
      return toast.error("Cannot submit empty or duplicate answer.");
    }
    setSubmitted(true);
    dispatch(SET_CODE_ANSWER(code));
    setIsAnswerUpdated(true);
  };

  useEffect(() => {
    // Only attempt to update user answer if an update is pending AND codeAnswer is ready
    if (isAnswerUpdated && codeAnswer === code) {
      updateUserAnswer();
    }
  }, [isAnswerUpdated, codeAnswer, code]); // Added `code` to dependency array to ensure it matches `codeAnswer`

  // Removed handleCopy as you explicitly disabled copying within the editor.
  // const handleCopy = async () => {
  //   try {
  //     await navigator.clipboard.writeText(code);
  //     toast.success("Code copied!");
  //   } catch {
  //     toast.error("Copy failed.");
  //   }
  // };

  const handleSkipCodeTask = () => {
    saveSkippedCodeAnswer();
    // handleSkip(); // Call the parent's handleSkip function
  };

  const saveSkippedCodeAnswer = async () => {
    const questionObj = mockInterviewQuestion?.[activeQuestionIndex];
    if (!questionObj) {
      toast.error("Question not found for skipping.");
      return;
    }
    const questionText =
      questionObj.task?.trim() || questionObj.question?.trim() || "Untitled";

    try {
      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        questionIndex: activeQuestionIndex,
        question: questionText,
        correctAns: questionObj?.code || "", // Assuming correct answer is in questionObj.code
        userAns: "", // User answer is empty for skipped
        feedback: "Skipped by user",
        rating: 0,
        userEmail: email,
        createdAt: moment().format("DD-MM-yyyy"),
        timeToAnswerInSeconds: questionObj?.timeToAnswerInSeconds || 0, // Or calculate time spent
      });
      setCode(""); // Clear editor after skipping
      toast.success("Skipped code task saved.");
      goToNext?.(); // Move to next question
    } catch (err) {
      toast.error("Failed to save skipped task.");
      console.error("Error saving skipped task:", err);
    }
  };

  const updateUserAnswer = async () => {
    const questionObj = mockInterviewQuestion?.[activeQuestionIndex];
    if (!questionObj) {
      toast.error("Question not found for answer update.");
      return;
    }
    const questionText =
      questionObj.task?.trim() || questionObj.question?.trim() || "Untitled";

    try {
      setIsLoading(true);

      const prompt = `Question: ${questionText}, User Answer: ${codeAnswer}. Give rating (1-10) and short feedback (3-5 lines) in JSON: { "rating": X, "feedback": "..." }`;

      const result = await chatSession.sendMessage(prompt);
      const raw = result.response
        .text()
        .replace(/```json|```/g, "")
        .trim();

      let feedbackJson = {};
      try {
        feedbackJson = JSON.parse(raw);
      } catch (parseError) {
        console.error("Failed to parse AI feedback:", raw, parseError);
        toast.error(
          "Failed to get proper feedback from AI. Saving answer without full feedback."
        );
        feedbackJson = { rating: 0, feedback: "Error processing AI feedback." };
      }

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        questionIndex: activeQuestionIndex,
        question: questionText,
        correctAns: questionObj?.code || "",
        userAns: codeAnswer,
        feedback: feedbackJson?.feedback || "No feedback provided by AI.",
        rating: feedbackJson?.rating || 0,
        userEmail: email,
        createdAt: moment().format("DD-MM-yyyy"),
        timeToAnswerInSeconds: questionObj?.timeToAnswerInSeconds || 0,
      });

      toast.success("Answer recorded!");
      setAnswerSaved(true); // Notify parent
      setTimeout(() => goToNext?.(), 1000);
    } catch (err) {
      toast.error("Failed to save answer.");
      console.error("Error updating user answer:", err);
    } finally {
      setIsLoading(false);
      setCode("");
      setSubmitted(false);
      setIsAnswerUpdated(false);
    }
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()} // Prevents default right-click context menu
      className="min-h-[90vh] w-full h-full flex flex-col no-select lg:flex-row bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 gap-4 rounded-xl shadow-2xl"
    >
      {/* Editor Section */}
      <div className="w-full lg:w-[70%] flex flex-col rounded-2xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-center px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 theme-text" />
            <h2 className="text-sm sm:text-lg font-bold theme-colors bg-clip-text text-transparent">
              Coding Task – {interviewData?.jobPosition}
            </h2>
          </div>
          <div className="flex gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 text-white text-xs sm:text-sm px-2 py-1 rounded-md border border-gray-600"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative lg:flex-1 h-[60vh]">
          {/* Conditionally render Editor only when it's loaded (on the client) */}
          <Editor
            height="100%"
            width="100%"
            language={language}
            theme={theme}
            value={code}
            onMount={(editor, monaco) => {
              editorRef.current = editor;

              // --- Disable Paste (Ctrl+V, Shift+Insert) ---
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV,
                () => {
                  showSingleToast(
                    "Pasting code is disabled for security reasons."
                  );
                }
              );

              editor.addCommand(
                monaco.KeyMod.Shift | monaco.KeyCode.Insert,
                () => {
                  showSingleToast(
                    "Pasting code is disabled for security reasons."
                  );
                }
              );

              // --- Disable Copy (Ctrl/Cmd + C) ---
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC,
                () => {
                  showSingleToast(
                    "Copying code is disabled for security reasons."
                  );
                }
              );

              // --- Disable Cut (Ctrl/Cmd + X) ---
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX,
                () => {
                  showSingleToast(
                    "Cutting code is disabled for security reasons."
                  );
                }
              );

              // --- Disable context menu copy/cut (mouse right-click etc.) ---
              const clipboardContribution = editor.getContribution(
                "editor.contrib.clipboard"
              );
              if (
                clipboardContribution &&
                typeof clipboardContribution.get === "function"
              ) {
                clipboardContribution.get = function () {
                  return {
                    copy: () =>
                      showSingleToast(
                        "Copying code is disabled for security reasons."
                      ),
                    cut: () =>
                      showSingleToast(
                        "Cutting code is disabled for security reasons."
                      ),
                  };
                };
              } else {
                console.warn(
                  "Clipboard contribution not found. Context menu copy/cut might still work."
                );
              }

              setTimeout(() => {
                editor.layout();
                editor.focus();
              }, 300);
            }}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              fontFamily: "Fira Code, monospace",
              minimap: { enabled: false },
              wordWrap: "on",
              automaticLayout: true,
              formatOnType: true,
              formatOnPaste: true,
              contextmenu: true, // still allow context menu
            }}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[30%] flex flex-col justify-between rounded-2xl bg-black/30 border border-white/10 shadow-xl p-4 space-y-4">
        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
          <div className="flex justify-end">
            <div className="theme-colors text-white text-xs px-3 py-1.5 rounded-full shadow-md">
              Time Left: {formatTime(remainingTime)}
            </div>
          </div>

          <div>
            <p className="text-xs theme-text font-bold uppercase mb-1">
              Problem Statement
            </p>
            <p className="text-sm text-gray-200 whitespace-pre-wrap">
              {task?.task || task?.question || "No task description provided."}
            </p>
          </div>

          {task?.sampleInput && (
            <div>
              <p className="text-xs theme-text font-bold uppercase mb-1">
                Sample Input
              </p>
              <pre className="bg-gray-800 p-3 rounded-lg text-sm text-gray-100 overflow-x-auto">
                {task.sampleInput}
              </pre>
            </div>
          )}

          {task?.expectedOutput && (
            <div>
              <p className="text-xs theme-text font-bold uppercase mb-1">
                Expected Output
              </p>
              <pre className="bg-gray-800 p-3 rounded-lg text-sm text-green-300 overflow-x-auto">
                {task.expectedOutput}
              </pre>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={handleSkipCodeTask}
            className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 justify-center"
          >
            <SkipForward className="w-4 h-4" />
            Skip Question
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={submitted || isLoading}
            className={`text-sm px-6 py-2 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all ${
              submitted || isLoading
                ? "bg-green-600 text-white cursor-not-allowed"
                : "theme-colors hover:from-purple-700 hover:to-fuchsia-600 text-white"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Evaluating...
              </>
            ) : submitted ? (
              <>
                <ClipboardCheck className="w-4 h-4" />
                Submitted
              </>
            ) : (
              <>
                <Terminal className="w-4 h-4" />
                Submit Code
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorSection;
