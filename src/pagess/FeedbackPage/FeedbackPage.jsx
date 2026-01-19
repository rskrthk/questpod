"use client";

import Layout from "@/components/Layout/Layout";
import BlobCursor from "@/lib/BlobCursor";
import { Button } from "@/lib/button";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { eq } from "drizzle-orm";
import {
  ChevronsUpDown,
  Star,
  Award,
  Sparkles,
  Clipboard,
  Code2,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FullScreenLoader from "@/lib/FullScreenLoader";
import { toast } from "react-hot-toast";
import withAuth from "@/middleware/withAuth";

const Feedback = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) getFeedback();
  }, [slug]);

  const getFeedback = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, slug))
        .orderBy(UserAnswer.id);

      setFeedbackList(result);

      const ratings = result
        .map((item) => parseFloat(item.rating))
        .filter((val) => !isNaN(val));

      const avg =
        ratings.length > 0
          ? (
              ratings.reduce((acc, val) => acc + val, 0) / ratings.length
            ).toFixed(1)
          : null;

      setAverageRating(avg);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
    setLoading(false);
  };

  const handleGoToDashboard = () => {
    setIsNavigating(true);
    router.replace("/login-dashboard");
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Copy failed");
    }
  };

  const formatAnswer = (answer) => {
    return answer?.trim() ? answer : ""; // Display "Skipped" if the user left it blank
  };

  if (loading || isNavigating) {
    return <FullScreenLoader />;
  }

  return (
    <Layout>
      {/* <BlobCursor /> */}

      <section className=" relative min-h-screen flex items-center justify-center overflow-hidden bg-white text-black">
        <div className="relative z-10 w-full max-w-4xl px-4 mt-16 md:px-6 py-10">
          {feedbackList.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-600">
                No Interview Record Found
              </h2>
              <Button
                onClick={handleGoToDashboard}
                disabled={isNavigating}
                className="button-theme-gradient"
              >
                {isNavigating ? "Loading..." : "Go to Dashboard"}
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-10 px-4">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-green-600 flex justify-center items-center gap-2 mb-2">
                  <Award className="w-7 h-7" />
                  Congratulations!
                </h2>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-neutral-800 mb-3">
                  Here is your interview feedback
                </h3>

                {averageRating && (
                  <p className="text-lg font-medium text-yellow-600 mt-2 flex justify-center items-center gap-2">
                    <Star className="w-5 h-5" />
                    Overall Rating:
                    <span className="text-black font-bold">
                      {averageRating} / 10
                    </span>
                  </p>
                )}

                <p className="text-sm md:text-base text-gray-600 mt-3 max-w-xl mx-auto leading-relaxed">
                  <Sparkles className="inline w-4 h-4 mr-1 theme-text" />
                  Below are the questions, your answers, correct answers, and
                  feedback.
                </p>
              </div>

              <div className="space-y-6">
                {feedbackList.map((feedback, index) => {

                  return (
                    <Collapsible
                      key={index}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <CollapsibleTrigger className="w-full flex justify-between items-center px-5 py-4 bg-gray-100 text-black hover:bg-gray-200 transition">
                        <div className="flex gap-2 items-center">
                          
                          <span className="text-left font-medium line-clamp-2">
                            {feedback.question}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-4 h-5 w-5 text-black opacity-60" />
                      </CollapsibleTrigger>

                      <CollapsibleContent className="bg-gray-50 text-sm text-black px-5 py-4 space-y-3">
                      
                        <div className="bg-blue-50 px-4 py-2 rounded-md border border-blue-200 relative">
                          <strong>Your Answer:</strong>{" "}
                          <pre className="whitespace-pre-wrap break-words text-sm mt-1 text-blue-900">
                            {formatAnswer(feedback.userAns)}
                          </pre>
                          <button
                            onClick={() => copyToClipboard(feedback.userAns)}
                            className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 text-xs"
                          >
                            <Clipboard className="w-4 h-4 inline" />
                          </button>
                        </div>

                        <div className="bg-green-50 px-4 py-2 rounded-md border border-green-200">
                          <strong>Correct Answer:</strong>{" "}
                          <pre className="whitespace-pre-wrap break-words text-sm mt-1 text-green-900">
                            {formatAnswer(feedback.correctAns)}
                          </pre>
                        </div>

                        {/* Google reference link for this question */}
                        <div className="bg-gray-100 px-4 py-2 rounded-md border border-gray-200">
                          <strong>Reference:</strong>
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(feedback.question || "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Google results for this question
                          </a>
                        </div>

                        <div className="bg-purple-50 px-4 py-2 rounded-md border border-purple-200">
                          <strong>Feedback:</strong>{" "}
                          <pre className="whitespace-pre-wrap break-words text-sm mt-1 text-purple-900">
                            {formatAnswer(feedback.feedback)}
                          </pre>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>

              <div className="text-center mt-10">
                <Button
                  onClick={handleGoToDashboard}
                  disabled={isNavigating}
                  className="button-theme-gradient"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default withAuth(Feedback, ["admin", "user"]);

