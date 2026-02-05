import { db } from "@/utils/db";
import { Application } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function GET(req) {
  const user = verifyTokenWithToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    const application = await db
      .select()
      .from(Application)
      .where(and(eq(Application.jobId, parseInt(jobId)), eq(Application.userId, parseInt(user.id))))
      .limit(1);

    if (application.length === 0) {
      return NextResponse.json({ applied: false });
    }

    return NextResponse.json({ applied: true, status: application[0].status });
  } catch (error) {
    console.error("Application status error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
