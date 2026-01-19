"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { MockInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import { db } from "@/utils/db";
import InterviewItemCard from "./InterviewItemCard";
import { Loader2 } from "lucide-react";

const InterviewList = () => {
  const { user } = useSelector((state) => state.auth);
  const [interviewList, setInterviewList] = useState([]);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const finalEmail = user?.email || storedEmail;
    if (finalEmail) setEmail(finalEmail);
  }, [user]);

  const fetchInterviews = useCallback(async (email) => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, email))
        .orderBy(desc(MockInterview.id));
      setInterviewList(result);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (email) fetchInterviews(email);
  }, [email, fetchInterviews]);

  const refetch = () => {
    if (email) fetchInterviews(email);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 border border-gray-200 rounded-xl bg-white shadow-sm animate-pulse">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-purple-300 blur-xl opacity-30 animate-ping absolute" />
          <div className="w-20 h-20 rounded-full bg-purple-500/80 animate-spin border-4 border-white z-10 relative flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        </div>
        <div className="text-center px-4">
          <p className="text-gray-700 font-semibold text-lg">
            Loading your interviews...
          </p>
          <p className="text-sm text-gray-500">
            Please wait while we fetch your mock sessions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Mock Interviews
        </h2>
        <p className="text-sm text-gray-500">
          {interviewList.length} session{interviewList.length !== 1 && "s"}
        </p>
      </div>

      {interviewList.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 bg-gray-50 rounded-xl">
          No mock interviews found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {interviewList.map((interview) => (
            <InterviewItemCard key={interview.id} interview={interview}  refetch={refetch}  />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;
