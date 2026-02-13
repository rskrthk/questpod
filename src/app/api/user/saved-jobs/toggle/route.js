import { db } from "@/utils/db";
import { SavedJob } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(req) {
  const user = verifyTokenWithToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { jobId } = await req.json();

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    const existingSavedJob = await db
      .select()
      .from(SavedJob)
      .where(and(eq(SavedJob.jobId, parseInt(jobId)), eq(SavedJob.userId, parseInt(user.id))))
      .limit(1);

    if (existingSavedJob.length > 0) {
      // If already saved, unsave it
      await db
        .delete(SavedJob)
        .where(eq(SavedJob.id, existingSavedJob[0].id));
      return NextResponse.json({ saved: false });
    } else {
      // If not saved, save it
      await db.insert(SavedJob).values({
        jobId: parseInt(jobId),
        userId: parseInt(user.id),
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Toggle saved job error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
