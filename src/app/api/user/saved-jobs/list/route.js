import { db } from "@/utils/db";
import { SavedJob } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req) {
  const user = verifyTokenWithToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const savedJobs = await db
      .select({
        jobId: SavedJob.jobId,
      })
      .from(SavedJob)
      .where(eq(SavedJob.userId, parseInt(user.id)));

    return NextResponse.json({ savedJobs });
  } catch (error) {
    console.error("Fetch saved jobs error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
