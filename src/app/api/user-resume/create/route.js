// app/api/user-resume-string/create/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { userResumeString } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { and, eq } from "drizzle-orm";

export async function POST(request) {
  try {
    const user = await verifyTokenWithToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const email = user.email;

    const body = await request.json();
    const { resumeJsonString, careerLevel } = body;
    if (!resumeJsonString || !careerLevel) {
      return NextResponse.json(
        { error: "Missing resumeJsonString or careerLevel" },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select()
      .from(userResumeString)
      .where(and(
        eq(userResumeString.createdBy, email),
        eq(userResumeString.careerLevel, careerLevel)
      ))
      .limit(1);

    let result;

    if (existing) {
      [result] = await db
        .update(userResumeString)
        .set({
          resumeJsonString,
          updatedAt: new Date(),
        })
        .where(eq(userResumeString.id, existing.id))
        .returning();
    } else {

      [result] = await db
        .insert(userResumeString)
        .values({
          resumeJsonString,
          createdBy: email,
          careerLevel,
          status: "Active", // optional, depending on schema default
        })
        .returning();
    }

    return NextResponse.json(
      { message: existing ? "Resume updated" : "Resume stored", data: result },
      { status: existing ? 200 : 201 }
    );
  } catch (err) {
    console.error("Resume create error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}