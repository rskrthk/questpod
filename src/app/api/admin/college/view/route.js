import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const user = verifyTokenWithToken(req);

  // ✅ Allow only admins to view college details
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await req.json();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid college ID" }, { status: 400 });
    }

    const result = await db.select().from(User).where(eq(User.id, Number(id))).limit(1);

    if (!result.length) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // ✅ Optional: Ensure it's actually a college
    if (result[0].role !== "college") {
      return NextResponse.json({ error: "User is not a college" }, { status: 400 });
    }

    return NextResponse.json({ college: result[0] });

  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
