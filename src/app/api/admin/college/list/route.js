import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm"; // ✅ FIX: Import eq and and

export async function GET(req) {
  const user = verifyTokenWithToken(req);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const colleges = await db
      .select()
      .from(User)
      .where(
        and(
          eq(User.adminId, user.id),
          eq(User.role, "college") // ✅ Optional: Ensure only college users are fetched
        )
      )
      .orderBy(desc(User.createdAt));

    return NextResponse.json({ colleges });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
