"use client";

import React, { useEffect, useState, useRef } from "react";
import { Volume2 } from "lucide-react";
import useGeminiServerSpeechToText from "@/lib/useGeminiServerSpeechToText";

const QuestionsSection = ({
  mockInterviewQuestion = [],
  activeQuestionIndex = 0,
  isSpeaking,
  isRecording,
  setIsSpeaking,
  startStopRecording,
  showGifInstead = true,
  gifSrc = "/gifVideo/Big.mp4",
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState({});
  const [voices, setVoices] = useState([]);
  const [heeraVoice, setHeeraVoice] = useState(null);
  const voicesLoadedRef = useRef(false);
  const spokenRef = useRef(false);

  const { results, startSpeechToText, stopSpeechToText, error } =
    useGeminiServerSpeechToText({ autoStart: false });

  const loadVoices = () => {
    const allVoices = window.speechSynthesis.getVoices();
    if (allVoices.length === 0) return;
    voicesLoadedRef.current = true;
    setVoices(allVoices);
    const heera = allVoices.find((v) =>
      v.name.toLowerCase().includes("microsoft heera")
    );
    setHeeraVoice(
      heera || allVoices.find((v) => v.lang.toLowerCase().includes("en-in")) || null
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  useEffect(() => {
    if (activeQuestionIndex > 0) {
      setAnswers((prev) => ({
        ...prev,
        [activeQuestionIndex]: userAnswer,
      }));
    }
    setUserAnswer("");
  }, [activeQuestionIndex]);

  useEffect(() => {
    if (!results.length) return;
    const newTranscript = results.map((r) => r.transcript).join(" ");
    setUserAnswer((prev) =>
      prev.includes(newTranscript) ? prev : prev + " " + newTranscript
    );
  }, [results]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const [currentQuestions, setCurrentQuestion] = useState("");

  useEffect(() => {
    const question = mockInterviewQuestion[activeQuestionIndex]?.question || "";
    spokenRef.current = false;
    if (question) {
      setCurrentQuestion(question);
      setUserAnswer("");
      if (heeraVoice && !spokenRef.current) {
        spokenRef.current = true;
        speakQuestion(question);
      }
    }
  }, [activeQuestionIndex, heeraVoice]);

  const speakQuestion = (text) => {
    if (!text || !window.speechSynthesis || spokenRef.current) return;
    spokenRef.current = true;

    if (!heeraVoice) {
      loadVoices();
      setTimeout(() => speakQuestion(text), 300);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = heeraVoice;
    utterance.lang = "en-IN";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Start recording user answer after question is spoken
      startSpeechToText();
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    mockInterviewQuestion.length > 0 && (
      <div className="w-full h-[70vh] rounded-2xl bg-white/5 backdrop-blur-xl p-2 flex flex-col items-center justify-center animate-fade-in-up">
        {showGifInstead && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            {/* Video Player */}
            <div className="relative w-full h-[100%] overflow-hidden rounded-xl border border-white/10 shadow-xl">
              <video
                src={gifSrc}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover rounded-xl"
              />
              {(isRecording || isSpeaking) && (
                <>
                  {isRecording && (
                    <div className="absolute top-4 left-4 px-4 py-1.5 text-xs bg-yellow-600 text-white font-semibold rounded-full shadow animate-pulse">
                      Listening...
                    </div>
                  )}
                  {isSpeaking && (
                    <div className="absolute bottom-4 right-4 px-4 py-1.5 text-xs bg-green-600 text-white font-semibold rounded-full shadow animate-pulse">
                      Speaking
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Question Box */}
            <div className="w-full max-w-3xl bg-gradient-to-br from-[#cbb8f6]/20 to-[#733aed]/10 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl space-y-2">
              <div className="flex items-center justify-center gap-2 text-black text-sm font-medium">
                <Volume2 className="w-4 h-4" />
                <span>Question</span>
              </div>
              <p className="text-gray-600 text-center text-base font-semibold tracking-wide leading-relaxed">
                {currentQuestions}
              </p>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default QuestionsSection;
