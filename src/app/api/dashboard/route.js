import { db } from "@/utils/db";
import { User, MockInterview, UserAnswer } from "@/utils/schema";
import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    const email = decoded.email;

    const [userCountData, interviewCountData, answerCountData] =
      await Promise.all([
        db.select({ count: count() }).from(User).where(eq(User.email, email)),
        db
          .select({ count: count() })
          .from(MockInterview)
          .where(eq(MockInterview.createdBy, email)),
        db
          .select({ count: count() })
          .from(UserAnswer)
          .where(eq(UserAnswer.userEmail, email)),
      ]);
    return NextResponse.json({
      userCount: userCountData[0]?.count || 0,
      interviewCount: interviewCountData[0]?.count || 0,
      answerCount: answerCountData[0]?.count || 0,
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
