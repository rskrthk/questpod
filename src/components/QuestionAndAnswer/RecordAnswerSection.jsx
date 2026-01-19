"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, Loader2 } from "lucide-react";
import { Button } from "@/lib/button";
import Webcam from "react-webcam";
import useGeminiServerSpeechToText from "@/lib/useGeminiServerSpeechToText";
import { toast } from "react-hot-toast";
import { chatSession } from "@/utils/GeminiAIModel";
import { UserAnswer } from "@/utils/schema";
import { db } from "@/utils/db";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { RECORDING_ANSWER } from "@/redux/slices/Recordslice";
import { motion } from "framer-motion";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
  setStartRecording,
  setIsRecording,
  setStopRecording,
  setAnswerSaved,
  goToNext,
  showSkipButton = false,
  isSpeaking = false,
  handleSkip = () => {},
  totalTimeInSeconds,
  onInterviewEnd = () => {},
  setInterviewTimeLeft,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [interviewTime, setInterviewTime] = useState(0);
  const [interviewTimerStarted, setInterviewTimerStarted] = useState(false);
  const [isPreparingSave, setIsPreparingSave] = useState(false);

  const timerRef = useRef(null);
  const interviewTimerRef = useRef(null);
  const recordedQuestionIndexRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(null);

  const {
    results,
    isRecording,
    setResults,
    startSpeechToText,
    stopSpeechToText,
    error,
  } = useGeminiServerSpeechToText({ autoStart: false });

  const question = mockInterviewQuestion?.[activeQuestionIndex];
  const questionTimeLimit = question?.timeToAnswerInSeconds || 60;

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(user?.email || storedEmail);
  }, [user]);

  useEffect(() => {
    const totalTime = totalTimeInSeconds || interviewData?.totalTimeInSeconds;
    setInterviewTime(
      totalTime && Number(totalTime) > 0 ? Number(totalTime) : 600
    );
  }, [totalTimeInSeconds, interviewData]);

  // ✅ Sync interviewTime back to parent
  useEffect(() => {
    if (typeof setInterviewTimeLeft === "function") {
      setInterviewTimeLeft(interviewTime);
    }
  }, [interviewTime, setInterviewTimeLeft]);

  useEffect(() => {
    setRemainingTime(questionTimeLimit);
  }, [activeQuestionIndex, questionTimeLimit]);

  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer((prev) => prev + result.transcript);
    });
  }, [results]);

  // Trigger save after recording stops AND transcript has been appended
  useEffect(() => {
    // Removed auto-save on recording stop to prevent unintended submissions
  }, [isRecording, userAnswer]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(interviewTimerRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startCountdown = (duration) => {
    clearInterval(timerRef.current);
    setRemainingTime(duration);
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          stopSpeechToText();
          dispatch(RECORDING_ANSWER);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startInterviewTimer = () => {
    clearInterval(interviewTimerRef.current);
    interviewTimerRef.current = setInterval(() => {
      setInterviewTime((prev) => {
        if (prev <= 1) {
          clearInterval(interviewTimerRef.current);
          onInterviewEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (interviewTime > 0 && !interviewTimerStarted) {
      startInterviewTimer();
      setInterviewTimerStarted(true);
    }
  }, [interviewTime, interviewTimerStarted]);

  const startRecording = () => {
    if (!questionTimeLimit) return toast.error("Invalid question time.");
    if (isRecording) return;
    recordedQuestionIndexRef.current = activeQuestionIndex;
    setUserAnswer("");
    setResults([]);
    setIsPreparingSave(false);

    try {
      startSpeechToText();
      setIsRecording(true);
      startCountdown(questionTimeLimit);
    } catch (err) {
      console.error("Error starting speech recognition:", err);
    }
  };

  const stopRecording = async () => {
    try {
      await stopSpeechToText();
    } finally {
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsPreparingSave(true);
      await stopRecording();
      dispatch(RECORDING_ANSWER);
      setIsPreparingSave(false);
    } else {
      startRecording();
    }
  };

  const handleSkipWithTimer = () => {
    setIsPreparingSave(false);
    stopRecording();
    sendSkippedQuestionToAPI(activeQuestionIndex);
    handleSkip?.();
  };

  useEffect(() => {
    setStartRecording(() => startRecording);
    setStopRecording(() => stopRecording);
  }, [questionTimeLimit, activeQuestionIndex]);

  useEffect(() => {
    if (error) {
      toast.error("Transcription issue. Please retry in a moment.");
    }
  }, [error]);

  const updateUserAnswer = async () => {
    const questionObj = mockInterviewQuestion?.[activeQuestionIndex];
    if (!questionObj) return toast.error("Invalid question index");

    setIsLoading(true);
    const prompt = `Question: ${questionObj.question}, User Answer: ${userAnswer}. Please give rating(1-10) and short feedback (3-5 lines) in JSON format with "rating" and "feedback".`;

    try {
      const result = await chatSession.sendMessage(prompt);
      const jsonFeedback = JSON.parse(
        result.response.text().replace(/```json|```/g, "")
      );

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        questionIndex: activeQuestionIndex,
        question: questionObj.question,
        correctAns: questionObj.answer,
        userAns: userAnswer,
        feedback: jsonFeedback?.feedback,
        rating: jsonFeedback?.rating,
        userEmail: email,
        createdAt: moment().format("DD-MM-yyyy"),
        timeToAnswerInSeconds: questionTimeLimit || 0,
      });

      toast.success("Answer recorded!");
      setAnswerSaved(true);
      setShowSuccess(true);
      setUserAnswer("");
      recordedQuestionIndexRef.current = null;

      setTimeout(() => {
        setShowSuccess(false);
        goToNext?.();
      }, 1000);
    } catch (error) {
      toast.error("Failed to save answer.");
      console.error(error);
    }

    setIsLoading(false);
  };

  const sendSkippedQuestionToAPI = async (questionIndex) => {
    try {
      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[questionIndex]?.question,
        correctAns: mockInterviewQuestion[questionIndex]?.answer,
        userAns: "",
        questionIndex,
        feedback: "Skipped by user",
        rating: 0,
        userEmail: email,
        createdAt: moment().format("DD-MM-yyyy"),
        timeToAnswerInSeconds: questionTimeLimit,
      });

      toast.success("Question skipped!");
    } catch (error) {
      console.error("Error saving skipped question:", error);
    }
  };

  return (
    <div className="w-full max-w-5xl h-[70vh] p-2 rounded-2xl  mx-auto backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center gap-3">
      {/* Webcam feed */}
      <div className="relative w-full h-[100%] rounded-xl shadow-lg overflow-hidden">
        <Webcam
          mirrored
          audio={false}
          className="w-full h-full object-cover border border-white/10 rounded-xl"
        />
        <div className="absolute top-4 right-4 theme-colors to-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md backdrop-blur-sm">
          Interview Time Left: {formatTime(interviewTime)}
        </div>
      </div>

      {/* Record/Skip Buttons */}
      <div className="flex justify-center items-center gap-4 w-full flex-wrap">
        <motion.button
          disabled={isLoading || isSpeaking}
          onClick={toggleRecording}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-xl
            font-semibold text-white transition-all duration-300
            shadow-md focus:outline-none
            ${
              isRecording
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }
            ${isLoading || isSpeaking ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          <Mic className="w-5 h-5" />
          {isRecording
            ? `Stop (${formatTime(remainingTime)})`
            : `Start Recording`}
        </motion.button>

        {/* Loader shown just before Save button becomes visible */}
        {!isRecording && isPreparingSave && (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-100 text-neutral-700">
            <Loader2 className="w-5 h-5 animate-spin" />
            Preparing to save...
          </div>
        )}

        {/* Explicit Save Answer button to avoid unintended auto-save */}
        {!isRecording && !isPreparingSave && (userAnswer?.trim()?.length || 0) >= 10 && (
          <Button
            onClick={updateUserAnswer}
            disabled={isLoading || isSpeaking}
            className="text-sm px-5 py-3 cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>Save Answer</>
            )}
          </Button>
        )}

        {showSkipButton && (
          <Button
            variant="outline"
            onClick={handleSkipWithTimer}
            className="text-sm px-5 py-2 border cursor-pointer border-red-400 text-red-600 rounded-full hover:bg-red-100 transition-all"
          >
            Skip Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecordAnswerSection;
