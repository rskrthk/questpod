"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/lib/button";
import { useParams, useRouter } from "next/navigation";
import QuestionsSection from "@/components/QuestionAndAnswer/QuestionsSection";
import RecordAnswerSection from "@/components/QuestionAndAnswer/RecordAnswerSection";
import Layout from "@/components/Layout/Layout";
import BlobCursor from "@/lib/BlobCursor";
import { Mic } from "lucide-react";
import FullScreenLoader from "@/lib/FullScreenLoader";
import CodeEditorSection from "@/components/QuestionAndAnswer/CodeEditorSection";
import { toast } from "react-hot-toast";
import withAuth from "@/middleware/withAuth";

const StartInterview = () => {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [welcomeSpeechGiven, setWelcomeSpeechGiven] = useState(false);
  const [answerSaved, setAnswerSaved] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [heeraVoice, setHeeraVoice] = useState(null);
  const [startRecording, setStartRecording] = useState(null);
  const [stopRecording, setStopRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [interviewTimeLeft, setInterviewTimeLeft] = useState(null);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    loadVoices();
    if (params?.slug) getInterviewDetails();
  }, [params?.slug]);

  useEffect(() => {
    if (
      mockInterviewQuestion.length > 0 &&
      welcomeSpeechGiven &&
      mockInterviewQuestion[activeQuestionIndex]?.type === "interviewQuestion"
    ) {
      handleSpeakQuestionAndRecord();
    }
  }, [activeQuestionIndex, welcomeSpeechGiven]);

  useEffect(() => {
    setAnswerSaved(false);
    setShowSkipButton(false);
  }, [activeQuestionIndex]);

  const loadVoices = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const allVoices = window.speechSynthesis.getVoices();
    setVoices(allVoices);
    const heera = allVoices.find((v) =>
      v.name.toLowerCase().includes("microsoft heera")
    );
    if (heera) setHeeraVoice(heera);
    window.speechSynthesis.onvoiceschanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      setVoices(updatedVoices);
      const updatedHeera = updatedVoices.find((v) =>
        v.name.toLowerCase().includes("microsoft heera")
      );
      if (updatedHeera) setHeeraVoice(updatedHeera);
    };
  };

  const getInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.slug));
      console.log("result", result);

      if (!result || result.length === 0) {
        toast.error("Interview not found.");
        return router.push("/dashboard");
      }

      const rawResp = result[0]?.jsonMockResp || "{}";

      let parsed;
      try {
        parsed = JSON.parse(rawResp);
      } catch (e) {
        toast.error("Invalid mock interview data.");
        return router.push("/dashboard");
      }

      const interviewQuestions =
        parsed.interviewQuestions?.map((q) => ({
          ...q,
          type: "interviewQuestion",
        })) || [];

      const codingTasks =
        parsed.codingTasks?.map((t) => ({ ...t, type: "codingTask" })) || [];

      // const mergedQuestions = [...codingTasks, ...interviewQuestions];
      const mergedQuestions = [...interviewQuestions, ...codingTasks];

      setMockInterviewQuestion(mergedQuestions);
      setInterviewData(result[0]);
      setTimeout(() => speakWelcome(result[0]), 1000);
    } catch (err) {
      console.error("Error fetching interview data:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const speakWelcome = (data) => {
    if (!("speechSynthesis" in window)) return;
    const text = `Welcome to your mock interview. The job position is ${data.jobPosition}. Experience required: ${data.jobExperience} years. Let's start.`;
    speakText(text, () => setWelcomeSpeechGiven(true));
  };

  const handleSpeakQuestionAndRecord = () => {
    const question = mockInterviewQuestion[activeQuestionIndex]?.question;
    if (!question) return;
    speakText(question, () => {
      if (startRecording) startRecording();
      setShowSkipButton(true);
    });
  };

  const speakText = (text, onComplete) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = heeraVoice || null;
    utterance.lang = "en-IN";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setTimeout(() => onComplete?.(), 200);
    };
    window.speechSynthesis.speak(utterance);
  };

  const goToNext = () => {
    if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    } else {
      setShowConclusion(true);
    }
  };

  const handleSkip = () => {
    if (stopRecording) stopRecording();
    setTimeout(() => goToNext(), 200);
  };

  const handleInterviewTimeout = () => setShowConclusion(true);

  const handleEndInterview = () => {
    setIsNavigating(true);
    router.push(`/interview/${interviewData?.mockId}/feedback`);
  };

  if (loading || !interviewData) {
    return <FullScreenLoader />;
  }

  const currentQuestion = mockInterviewQuestion[activeQuestionIndex];

  return (
    <Layout>
      {/* <BlobCursor /> */}
      <section className="min-h-screen pt-20 sm:pt-24 px-4 bg-white text-gray-800">
        <div className="container-x space-y-6">
          <div className="sticky top-0 z-30 bg-white border border-gray-200 shadow-md rounded-xl px-2 sm:px-6 py-2 sm:py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <h1 className="flex items-center gap-3 text-sm sm:text-xl font-bold text-gray-700">
              <Mic className="w-6 h-6 theme-icons" />
              Interview for:
              <span className="ml-2 theme-text">
                {interviewData?.jobPosition}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 italic">
              Please answer after the question is spoken aloud.
            </p>
          </div>

          {!showConclusion ? (
            <div
              className={`grid gap-6 mb-10 ${
                currentQuestion?.type !== "codingTask"
                  ? "md:grid-cols-2"
                  : "md:grid-cols-1"
              }`}
            >
              {currentQuestion?.type !== "codingTask" && (
                <div className="rounded-xl bg-white border border-gray-200 shadow-md p-4">
                  <QuestionsSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    setActiveQuestionIndex={setActiveQuestionIndex}
                    isSpeaking={isSpeaking}
                    isRecording={isRecording}
                    setIsSpeaking={setIsSpeaking}
                    startStopRecording={() => {
                      if (stopRecording) stopRecording();
                      if (startRecording) startRecording();
                    }}
                  />
                </div>
              )}

              <div className="rounded-xl bg-white border border-gray-200 shadow-md sm:p-4 overflow-x-hidden">
                {currentQuestion?.type === "codingTask" ? (
                  <CodeEditorSection
                    task={currentQuestion}
                    interviewData={interviewData}
                    goToNext={goToNext}
                    showSkipButton={showSkipButton}
                    handleSkip={handleSkip}
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    setAnswerSaved={setAnswerSaved}
                    isSpeaking={isSpeaking}
                    onInterviewEnd={handleInterviewTimeout}
                    // totalTimeInSeconds={interviewData?.totalTimeInSeconds}
                    totalTimeInSeconds={interviewTimeLeft}
                    setInterviewTimeLeft={setInterviewTimeLeft}
                  />
                ) : (
                  <RecordAnswerSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                    isRecording={isRecording}
                    setIsRecording={setIsRecording}
                    setStartRecording={setStartRecording}
                    setStopRecording={setStopRecording}
                    setAnswerSaved={setAnswerSaved}
                    goToNext={goToNext}
                    showSkipButton={showSkipButton}
                    handleSkip={handleSkip}
                    isSpeaking={isSpeaking}
                    onInterviewEnd={handleInterviewTimeout}
                    totalTimeInSeconds={interviewData?.totalTimeInSeconds}
                    setInterviewTimeLeft={setInterviewTimeLeft}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center animate-fade-in-up">
              <div className="bg-white border border-gray-200 p-10 text-center rounded-xl shadow-xl w-full max-w-xl">
                <h2 className="text-3xl font-bold theme-text mb-4">
                  🎉 Interview Completed!
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  You’ve successfully completed your mock interview.
                  <br />
                  Click the button below to view your feedback.
                </p>
                <Button
                  onClick={handleEndInterview}
                  className="theme-colors hover:bg-purple-700 text-white px-8 py-3 rounded-xl shadow-md font-semibold transition-transform duration-200 hover:scale-105"
                >
                  View Feedback
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default withAuth(StartInterview, ["admin", "user"]);
