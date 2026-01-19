// app/api/user-resume/list/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { userResume } from "@/utils/schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await db.select().from(userResume);
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("GET /api/user-resume/list -", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}