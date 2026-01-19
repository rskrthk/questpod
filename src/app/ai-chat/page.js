"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiMic, FiMicOff, FiSend, FiFile, FiUser, FiMessageCircle, FiVolume2, FiVolumeX, FiPlay, FiPause } from 'react-icons/fi';
import withAuth from '@/middleware/withAuth';
import Layout from '@/components/Layout/Layout';

function AIChatPage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
  const [interviewProgress, setInterviewProgress] = useState({ current: 0, total: 10 });
  const [interviewComplete, setInterviewComplete] = useState(false);
  
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Text-to-speech functions
  const speakText = (text, messageId) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    // Stop any current speech
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Set voice to a female voice if available
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('susan') ||
      voice.name.toLowerCase().includes('samantha')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      stopSpeaking();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is PDF or DOCX
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx');
    
    if (!isPdf && !isDocx) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    setResumeFile(file);
    setIsLoading(true);

    try {
      // Parse the resume file
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('/api/resume-parse', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setResumeText(result.data.extractedText);
        setIsLoading(false);
        setChatStarted(true);
        
        // Create a dynamic initial message based on actual resume content
        const parsedData = result.data.parsedData;
        let personalizedContent = '';
        
        // Build personalized content based on what's available in the resume
        const contentParts = [];
        
        if (parsedData.name && parsedData.name !== 'Name not found') {
          contentParts.push(`Hello ${parsedData.name}!`);
        } else {
          contentParts.push('Hello!');
        }
        
        if (parsedData.skills && parsedData.skills.length > 0) {
          const skillsList = parsedData.skills.slice(0, 5).join(', '); // Limit to first 5 skills
          contentParts.push(`I can see you have experience with ${skillsList}.`);
        }
        
        if (parsedData.experience && parsedData.experience.length > 0) {
          const latestExp = parsedData.experience[0];
          if (latestExp.position && latestExp.company) {
            contentParts.push(`I notice you've worked as ${latestExp.position} at ${latestExp.company}.`);
          }
        }
        
        if (parsedData.education && parsedData.education.length > 0) {
          const education = parsedData.education[0];
          if (education.degree) {
            contentParts.push(`I see you have a ${education.degree}.`);
          }
        }
        
        // Generate a specific opening question based on resume content
        let openingQuestion = "Can you tell me about yourself and your background?";
        
        if (parsedData.skills && parsedData.skills.length > 0) {
          const primarySkill = parsedData.skills[0];
          openingQuestion = `I'd like to start by learning more about your experience with ${primarySkill}. Can you tell me about a specific project where you used this technology?`;
        } else if (parsedData.experience && parsedData.experience.length > 0) {
          const latestExp = parsedData.experience[0];
          if (latestExp.position) {
            openingQuestion = `I'd like to hear more about your role as ${latestExp.position}. What were your main responsibilities and achievements in this position?`;
          }
        }
        
        personalizedContent = contentParts.join(' ');
        
        const initialMessage = {
          id: 1,
          type: 'bot',
          content: `${personalizedContent} I'm ready to conduct an interview based on your actual resume content. You can speak to me using the microphone button. Let's begin: ${openingQuestion}`,
          timestamp: new Date()
        };
        
        setMessages([initialMessage]);
        
        // Speak the initial message
        if (voiceEnabled) {
          setTimeout(() => {
            speakText(initialMessage.content, initialMessage.id);
          }, 1000); // Delay to ensure UI is ready
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
      setIsLoading(false);
      alert('Error parsing resume. Please try again.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudioMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioMessage = async (audioBlob) => {
    setIsLoading(true);
    
    try {
      // First, transcribe the audio
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      const transcriptionResponse = await fetch('/api/ai-chat', {
        method: 'PUT',
        body: formData,
      });

      const transcriptionResult = await transcriptionResponse.json();

      if (!transcriptionResult.success) {
        throw new Error(transcriptionResult.error);
      }

      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: transcriptionResult.transcription,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const chatResponse = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: transcriptionResult.transcription,
          resumeData: resumeText,
          conversationHistory: messages
        }),
      });

      const chatResult = await chatResponse.json();

      if (chatResult.success) {
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: chatResult.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        
        // Update interview progress
        const userMessages = messages.filter(msg => msg.type === 'user').length + 1;
        setInterviewProgress({ current: Math.min(userMessages, 10), total: 10 });
        
        // Check if interview is complete
        if (userMessages >= 10 || chatResult.response.includes('interview summary') || chatResult.response.includes('Overall Performance Score')) {
          setInterviewComplete(true);
        }
        
        // Automatically speak the AI response
        if (voiceEnabled) {
          setTimeout(() => {
            speakText(chatResult.response, botResponse.id);
          }, 500); // Small delay to ensure message is rendered
        }
      } else {
        throw new Error(chatResult.error);
      }

      setIsLoading(false);

    } catch (error) {
      console.error('Error processing audio:', error);
      setIsLoading(false);
      alert('Error processing audio. Please try again.');
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-8">
        <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">AI Chat Assistant</h1>
          <p className="text-lg text-gray-600">
            Upload your resume and start a natural conversation with our AI assistant
          </p>
        </motion.div>

        {!chatStarted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="mb-6">
              <FiUpload className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Upload Your Resume
              </h2>
              <p className="text-gray-600">
                Upload your resume to start an AI-powered conversation
              </p>
            </div>

            <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx"
                className="hidden"
              />
              
              {resumeFile ? (
                <div className="flex items-center justify-center gap-3 text-green-600">
                  <FiFile className="w-6 h-6" />
                  <span className="font-medium">{resumeFile.name}</span>
                </div>
              ) : (
                <div>
                  <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">
                    Drag and drop your resume here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Supported formats: PDF, DOCX
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Choose File
                  </button>
                </div>
              )}
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-3 text-purple-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span>Processing your resume...</span>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
            {/* Chat Header */}
            <div className="bg-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiMessageCircle className="w-6 h-6" />
                  <div>
                    <h2 className="font-semibold">AI Technical Interview</h2>
                    <div className="flex items-center gap-2">
                      <p className="text-purple-200 text-sm">
                        {interviewComplete ? 'Interview Complete!' : `Question ${interviewProgress.current}/${interviewProgress.total}`}
                      </p>
                      {!interviewComplete && (
                        <div className="bg-purple-500 rounded-full h-2 w-16">
                          <div 
                            className="bg-white rounded-full h-2 transition-all duration-300"
                            style={{ width: `${(interviewProgress.current / interviewProgress.total) * 100}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="p-2 rounded-full bg-purple-500 hover:bg-purple-400 transition-colors"
                      title="Stop speaking"
                    >
                      <FiPause className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={toggleVoice}
                    className={`p-2 rounded-full transition-colors ${
                      voiceEnabled 
                        ? 'bg-purple-500 hover:bg-purple-400' 
                        : 'bg-gray-500 hover:bg-gray-400'
                    }`}
                    title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                  >
                    {voiceEnabled ? <FiVolume2 className="w-4 h-4" /> : <FiVolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-sm lg:max-w-2xl ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {message.type === 'user' ? <FiUser className="w-4 h-4" /> : <FiMessageCircle className="w-4 h-4" />}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.type === 'bot' && (message.content.includes('**') || message.content.includes('Next Question')) ? (
                          // Enhanced formatting for structured interview responses
                          <div className="text-sm space-y-2">
                            {message.content.split('\n').map((line, index) => {
                               if (line.includes('Next Question:')) {
                                return (
                                  <p key={index} className="text-gray-700">{line.replace('Next Question:', '').trim()}</p>
                                );
                              } else if (line.includes('**Overall Performance Score:**') || line.includes('**Strengths Identified:**') || line.includes('**Areas for Improvement:**')) {
                                return (
                                  <div key={index} className="bg-green-50 border-l-4 border-green-400 p-2 rounded">
                                    <p className="font-semibold text-green-800 text-xs">{line.replace(/\*\*/g, '').trim()}</p>
                                  </div>
                                );
                              } else if (line.trim() && !line.includes('**')) {
                                return <p key={index} className="text-gray-700">{line}</p>;
                              }
                              return null;
                            })}
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                        <div className={`flex items-center justify-between mt-1 ${
                          message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                        }`}>
                          <p className="text-xs">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                          {message.type === 'bot' && voiceEnabled && (
                            <button
                              onClick={() => {
                                if (currentSpeakingId === message.id) {
                                  stopSpeaking();
                                } else {
                                  speakText(message.content, message.id);
                                }
                              }}
                              className={`ml-2 p-1 rounded-full transition-colors ${
                                currentSpeakingId === message.id
                                  ? 'bg-purple-200 text-purple-600 hover:bg-purple-300'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                              title={currentSpeakingId === message.id ? 'Stop speaking' : 'Play message'}
                            >
                              {currentSpeakingId === message.id ? (
                                <FiPause className="w-3 h-3" />
                              ) : (
                                <FiPlay className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                      <FiMessageCircle className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Input */}
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleMicClick}
                  disabled={isLoading}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isRecording ? <FiMicOff className="w-6 h-6" /> : <FiMic className="w-6 h-6" />}
                </button>
                <p className="text-sm text-gray-600">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start voice recording'}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(AIChatPage, ["admin", "user"]);