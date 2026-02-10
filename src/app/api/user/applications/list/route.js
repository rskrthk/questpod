import { db } from "@/utils/db";
import { Application } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req) {
  const user = verifyTokenWithToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const applications = await db
      .select({
        jobId: Application.jobId,
        status: Application.status,
      })
      .from(Application)
      .where(eq(Application.userId, parseInt(user.id)));

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Fetch user applications error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
