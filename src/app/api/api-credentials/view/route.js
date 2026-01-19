// app/api/api-credentials/view/route.js
//after encrypring key
import { NextResponse } from "next/server";
import { Buffer } from "buffer";              // ✅ works in both Edge & Node runtimes
import { db } from "@/utils/db";
import { apiCredentials } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { verifyTokenWithToken } from "@/utils/jwt";

export async function GET(request) {
  /* ─── 1. Auth guard ───────────────────────────────────────── */
  const authUser = verifyTokenWithToken(request);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    /* ─── 2. Fetch the latest active record ─────────────────── */
    const [record] = await db
      .select()
      .from(apiCredentials)
      .where(eq(apiCredentials.status, "Active"))
      .orderBy(desc(apiCredentials.updatedAt)) // newest → oldest
      .limit(1);

    if (!record) {
      return NextResponse.json({ success: true, data: null });
    }

    /* ─── 3. Don’t leak the raw key ─────────────────────────── */
    const { apiKey, ...safeFields } = record;
    const encodedApiKey = Buffer.from(apiKey).toString("base64");

    return NextResponse.json({
      success: true,
      apiKey: encodedApiKey, // base‑64 only
      data: safeFields,      // everything else
    });
  } catch (err) {
    console.error("View API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}