"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/lib/button";
import { Trash2, PlayCircle, MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteInterview } from "@/redux/slices/interviewDeleteSlice";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { UserAnswer } from "@/utils/schema";

export default function InterviewItemCard({ interview, refetch }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [hasFeedback, setHasFeedback] = useState(false);

  useEffect(() => {
    async function checkFeedback() {
      try {
        const result = await db
          .select()
          .from(UserAnswer)
          .where(eq(UserAnswer.mockIdRef, interview.mockId))
          .limit(1);
        setHasFeedback(result.length > 0);
      } catch (error) {
        console.error("Failed to check feedback:", error);
      }
    }
    checkFeedback();
  }, [interview.mockId]);

  const handleDelete = () => {
    toast((t) => (
      <div className="p-4">
        <p className="text-sm font-medium mb-2">
          Are you sure you want to delete this interview?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await dispatch(deleteInterview(interview.mockId)).unwrap();
                toast.success("Interview deleted successfully");
                refetch(); // ✅ Call refetch instead of router.refresh()
              } catch (err) {
                toast.error("Failed to delete the interview.");
              }
            }}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-sm bg-gray-200 px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="group relative bg-white border rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col justify-between h-full">
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-2 bg-red-100 rounded-full text-red-600"
        title="Delete Interview"
      >
        <Trash2 size={16} />
      </button>

      <div>
        <h3 className="font-semibold text-lg truncate">{interview.jobPosition}</h3>
        <p className="text-sm text-gray-500">{interview.jobExperience} yrs</p>
        <p className="text-xs text-gray-400">Created: {interview.createdAt}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/interview/${interview.mockId}/feedback`)}
        >
          <MessageSquareText size={16} />
          Feedback
        </Button>

        {!hasFeedback && (
          <Button
            size="sm"
            onClick={() => router.push(`/interview/${interview.mockId}`)}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white"
          >
            <PlayCircle size={16} />
            Start
          </Button>
        )}
      </div>
    </div>
  );
}
