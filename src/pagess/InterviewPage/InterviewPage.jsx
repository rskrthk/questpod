"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import {
  Lightbulb,
  WebcamIcon,
  Briefcase,
  Code,
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
} from "lucide-react";
import { Button } from "@/lib/button";
import { eq } from "drizzle-orm";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import FullScreenLoader from "@/lib/FullScreenLoader";
import withAuth from "@/middleware/withAuth";

const Interview = () => {
  const [interviewData, setInterviewData] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  const webcamRef = useRef(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params?.slug) {
      getInterviewDetails(params.slug);
      setupMedia();
    }

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [params?.slug]);

  const getInterviewDetails = async (slug) => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, slug));
      setInterviewData(result[0]);
    } catch (err) {
      console.error("Error fetching interview details", err);
    }
  };

  const setupMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      setMicEnabled(true);
      setCamEnabled(true);
    } catch (err) {
      console.error("Permission denied or no media devices:", err);
      setMicEnabled(false);
      setCamEnabled(false);
    }
  };

  const toggleMic = useCallback(() => {
    if (!mediaStream) return;
    const audioTracks = mediaStream.getAudioTracks();
    if (audioTracks.length === 0) return;
    const newMicState = !micEnabled;
    audioTracks.forEach((track) => (track.enabled = newMicState));
    setMicEnabled(newMicState);
  }, [mediaStream, micEnabled]);

  const toggleCam = useCallback(() => {
    if (!mediaStream) return;
    const videoTracks = mediaStream.getVideoTracks();
    if (videoTracks.length === 0) return;
    const newCamState = !camEnabled;
    videoTracks.forEach((track) => (track.enabled = newCamState));
    setCamEnabled(newCamState);
  }, [mediaStream, camEnabled]);

  const handleStartInterview = () => {
    setIsNavigating(true);
    router.push(`/interview/${params.slug}/start`);
  };

  if (!interviewData || isNavigating) {
    return (
      <FullScreenLoader message="Launching your interview environment..." />
    );
  }

  return (
    <Layout>
      <section className="min-h-screen bg-gradient-to-br from-white to-gray-100 px-4 py-20 sm:py-24 text-gray-900">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Launch Your <span className="theme-text">Mock Interview</span>
          </h1>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">
            Ensure your camera and mic are active before starting.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-6">
          {mediaStream ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-black">
              <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={{ facingMode: "user" }}
                mirrored
                className="w-full h-full object-cover"
              />
              {!camEnabled && (
                <div className="absolute inset-0 bg-black flex items-center justify-center text-white font-semibold text-lg z-10">
                  Camera Off
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3 sm:gap-4 backdrop-blur-md bg-white/10 px-2 sm:px-4 py-2 rounded-full shadow-lg">
                <button
                  onClick={toggleMic}
                  className={`rounded-full p-2.5 transition-transform hover:scale-105 ${
                    micEnabled ? "theme-colors" : "bg-red-600"
                  } text-white shadow-md`}
                >
                  {micEnabled ? <Mic /> : <MicOff />}
                </button>
                <button
                  onClick={toggleCam}
                  className={`rounded-full p-2.5 transition-transform hover:scale-105 ${
                    camEnabled ? "theme-colors" : "bg-red-600"
                  } text-white shadow-md`}
                >
                  {camEnabled ? <Video /> : <VideoOff />}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 bg-gray-50 p-6">
              <WebcamIcon className="w-14 h-14 mb-4" />
              <p className="mb-2 text-sm">Camera & Mic access not available.</p>
              <Button variant="outline" onClick={setupMedia}>
                Enable Devices
              </Button>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <InfoCard
            icon={<Briefcase className="w-5 h-5 text-purple-500" />}
            label="Job Role"
            value={interviewData.jobPosition}
          />
          <InfoCard
            icon={<Code className="w-5 h-5 text-blue-500" />}
            label="Tech Stack"
            value={interviewData.jobDesc}
          />
          <InfoCard
            icon={<Users className="w-5 h-5 text-green-500" />}
            label="Experience"
            value={`${interviewData.jobExperience} Years`}
          />
        </div>

        {mediaStream && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleStartInterview}
              className="theme-colors hover:from-purple-700 hover:to-fuchsia-600 text-white px-6 py-3 rounded-xl shadow-md font-semibold transition-all hover:scale-105"
            >
              Start Interview
            </button>
          </div>
        )}

        <div className="flex items-start gap-3 bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-200 max-w-2xl mx-auto">
          <Lightbulb className="w-5 h-5 mt-1 text-yellow-600" />
          <p className="text-sm leading-relaxed break-words">
            {process.env.NEXT_PUBLIC_INFORMATION ||
              "Stay calm, speak clearly, and give your best shot!"}
          </p>
        </div>
      </section>
    </Layout>
  );
};


const InfoCard = ({ icon, label, value }) => {
  const [showModal, setShowModal] = useState(false);
  const shouldShowToggle = value?.length > 100;

  return (
    <>
      {/* Info Card */}
      <div className="bg-white rounded-md border border-gray-200 px-3 py-2 shadow-sm flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-4 h-4 flex items-center justify-center text-gray-500">
              {icon}
            </div>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
              {label}
            </p>
          </div>

          <div className="text-[13px] font-semibold text-gray-800 leading-snug break-words max-h-[72px] overflow-hidden">
            {value || "N/A"}
          </div>
        </div>

        {shouldShowToggle && (
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 text-xs mt-2 hover:underline self-start"
          >
            View More
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-5 max-w-4xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-2.5 right-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>

            {/* Content */}
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{label}</h3>
            <div className="text-sm text-gray-800 whitespace-pre-wrap max-h-[50vh] overflow-y-auto">
              {value}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(Interview, ["admin", "user"]);
