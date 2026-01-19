// app/api/user-resume-string/view/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { userResumeString } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { and, desc, eq } from "drizzle-orm";

export async function GET(request) {
  try {
    // 🔐 Verify & decode JWT
    const user = verifyTokenWithToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const email = user.email;

    // ✅ Extract careerLevel from query params
    const { searchParams } = new URL(request.url);
    const careerLevel = searchParams.get("careerLevel") || "Fresher";

    // 📥 Query: newest row for this user
    const [latest] = await db
      .select()
      .from(userResumeString)
      .where(
        and(
          eq(userResumeString.createdBy, email),
          eq(userResumeString.careerLevel, careerLevel)
        )
      )
      .orderBy(desc(userResumeString.updatedAt))
      .limit(1);

    if (!latest) {
      return NextResponse.json({ error: "No record found" }, { status: 404 });
    }

    return NextResponse.json({ data: latest }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
