import { db } from "@/utils/db";
import { Application } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(req) {
  const user = verifyTokenWithToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { jobId, answers } = body;

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    // Check if already applied
    const existing = await db
      .select()
      .from(Application)
      .where(and(eq(Application.jobId, parseInt(jobId)), eq(Application.userId, parseInt(user.id))))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "Already applied" }, { status: 400 });
    }

    await db.insert(Application).values({
      jobId: parseInt(jobId),
      userId: parseInt(user.id),
      answers: JSON.stringify(answers),
      status: "Resume Sent to Company",
    });

    return NextResponse.json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
