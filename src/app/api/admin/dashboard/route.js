// app/api/dashboard/route.js
import { db } from "@/utils/db";
import { MockInterview, Stack, User, UserAnswer } from "@/utils/schema";
import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyTokenWithToken } from "@/utils/jwt";

export const runtime = "nodejs";

export async function GET(request) {
  /* ── 1. auth guard ───────────────────────────────────────────────────── */
  const user = verifyTokenWithToken(request);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    /* ── 2. counts (defaults to 0) ─────────────────────────────────────── */
    const [{ colleges = 0 } = {}] = await db
      .select({ colleges: sql`COUNT(*)::int` })
      .from(User)
      .where(eq(User.role, "college"));

    const [{ students = 0 } = {}] = await db
      .select({ students: sql`COUNT(*)::int` })
      .from(User)
      .where(eq(User.role, "student"));

    const [{ interviews = 0 } = {}] = await db
      .select({ interviews: sql`COUNT(*)::int` })
      .from(MockInterview);

    const [{ completedInterviews = 0 } = {}] = await db
      .select({
        completedInterviews: sql`COUNT(DISTINCT ${UserAnswer.mockIdRef})::int`,
      })
      .from(UserAnswer);

    const stacks = await db.select().from(Stack).orderBy(desc(Stack.count));

    /* ── 3. response ───────────────────────────────────────────────────── */
    return NextResponse.json({
      colleges,
      students,
      interviews,
      completedInterviews,
      stacks,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
