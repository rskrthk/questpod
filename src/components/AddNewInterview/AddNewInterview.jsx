"use client";

import React, { useState } from "react";
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
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { MockInterview } from "@/utils/schema";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddNewInterview = () => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    jobPosition: Yup.string().required("Job Role is required"),
    jobDesc: Yup.string().required("Job Description is required"),
    jobExperience: Yup.number()
      .typeError("Years of Experience must be a number")
      .min(0, "Years of Experience must be at least 0")
      .required("Years of Experience is required"),
    createdBy: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    const { jobPosition, jobDesc, jobExperience, createdBy } = values;

    const questionCount = parseInt(
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || "5",
      10
    );
    const totalTimeInSeconds =
      parseInt(process.env.NEXT_PUBLIC_INTERVIEW_TIME || "10", 10) * 60;
    const totalTimeInMinutes = totalTimeInSeconds / 60;

    const inputPrompt = `
Randomness Token: ${makeRandomToken()}
Job Position: ${jobPosition}
Job Description: ${jobDesc}
Years of Experience: ${jobExperience}

Generate ${questionCount} interview questions with answers.
- Ensure each question is unique and avoids common boilerplate.
- Vary scenarios, depth, and phrasing; keep domain relevance to the role.
- Distribute ${totalTimeInSeconds} seconds (${totalTimeInMinutes} minutes) reasonably across asking and answering.

Return ONLY valid JSON:
{
  "questions": [
    { "question": "string", "answer": "string", "timeToAskInSeconds": number, "timeToAnswerInSeconds": number }
  ],
  "totalTimeInSeconds": number
}`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const rawResponse = result.response.text().trim();
      const jsonStart = rawResponse.indexOf("{");
      const jsonEnd = rawResponse.lastIndexOf("}");
      const jsonString = rawResponse.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);

      if (!Array.isArray(parsed.questions)) throw new Error("Invalid format");
      let questions = parsed.questions;

      const topicsKey = [jobPosition || "general"];
      const existingTexts = getExistingTextsForTopics(topicsKey, 50);
      questions = filterDuplicatesForTopics(topicsKey, questions, q => q.question);

      const deficit = Math.max(0, questionCount - questions.length);
      if (deficit > 0) {
        const regenPrompt = `
Randomness Token: ${makeRandomToken()}
Role: ${jobPosition}
Previously Asked (avoid any overlap): ${JSON.stringify(existingTexts)}
Generate ${deficit} additional unique interview questions.
Return ONLY JSON { "questions": [ { "question": "string", "answer": "string", "timeToAskInSeconds": number, "timeToAnswerInSeconds": number } ] }`;
        const regenRes = await chatSession.sendMessage(regenPrompt);
        const regenRaw = regenRes.response.text().trim();
        const jsStart = regenRaw.indexOf("{");
        const jsEnd = regenRaw.lastIndexOf("}");
        if (jsStart !== -1 && jsEnd !== -1) {
          try {
            const regenObj = JSON.parse(regenRaw.slice(jsStart, jsEnd + 1));
            const regenQs = Array.isArray(regenObj.questions) ? regenObj.questions : [];
            const uniqueRegens = filterDuplicatesForTopics(topicsKey, regenQs, q => q.question);
            questions = questions.concat(uniqueRegens).slice(0, questionCount);
          } catch {}
        }
      }

      addToBank(topicsKey, questions, q => q.question);

      const totalTime =
        parsed.totalTimeInSeconds ||
        questions.reduce(
          (sum, q) =>
            sum + (q.timeToAskInSeconds || 0) + (q.timeToAnswerInSeconds || 0),
          0
        );

      const dbResponse = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(questions),
          jobPosition,
          jobDesc,
          jobExperience,
          createdBy,
          createdAt: moment().format("DD-MM-YYYY"),
          totalTimeInSeconds: totalTime,
        })
        .returning({ mockId: MockInterview.mockId });

      if (dbResponse?.[0]?.mockId) {
        setOpenDialog(false);
        resetForm();
        router.push(`/interview/${dbResponse[0].mockId}`);
      } else {
        console.error("DB insert failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Trigger Button */}
      <div
        className="p-10 border rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg hover:scale-105 cursor-pointer transition"
        onClick={() => setOpenDialog(true)}
      >
        + Add New Interview
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Create New Interview
            </DialogTitle>
            <DialogDescription asChild>
              <Formik
                initialValues={{
                  jobPosition: "",
                  jobDesc: "",
                  jobExperience: "",
                  createdBy: "", // This replaces your Clerk email
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="mt-6 space-y-5">
                    <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 space-y-4">
                      <div>
                        <label className="block mb-1 font-medium">
                          Job Role / Position
                        </label>
                        <Field
                          name="jobPosition"
                          as={Input}
                          disabled={isLoading}
                        />
                        <ErrorMessage
                          name="jobPosition"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-medium">
                          Job Description / Tech Stack
                        </label>
                        <Field
                          name="jobDesc"
                          as={Textarea}
                          disabled={isLoading}
                        />
                        <ErrorMessage
                          name="jobDesc"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-medium">
                          Years of Experience
                        </label>
                        <Field
                          name="jobExperience"
                          type="number"
                          as={Input}
                          disabled={isLoading}
                        />
                        <ErrorMessage
                          name="jobExperience"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-medium">
                          Your Email
                        </label>
                        <Field
                          name="createdBy"
                          type="email"
                          as={Input}
                          disabled={isLoading}
                        />
                        <ErrorMessage
                          name="createdBy"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => setOpenDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                      >
                        {isLoading ? (
                          <>
                            <LoaderCircle className="animate-spin mr-2" />{" "}
                            Generating...
                          </>
                        ) : (
                          "Start Interview"
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
