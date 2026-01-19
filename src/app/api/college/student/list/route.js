import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { NextResponse } from "next/server";
import { verifyTokenWithToken } from "@/utils/jwt";
import { and, desc, eq } from "drizzle-orm"; // ✅ IMPORT `eq` and `and`

// ✅ List students of the logged-in college
export async function GET(req) {
  const user = verifyTokenWithToken(req);

  if (!user || user.role !== "college") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const students = await db
      .select()
      .from(User)
      .where(
        and(
          eq(User.collegeId, user.id),
          eq(User.role, "student") // ✅ Ensure only students are listed
        )
      )
      .orderBy(desc(User.createdAt));

    return NextResponse.json({ students });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
