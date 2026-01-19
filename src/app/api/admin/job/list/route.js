import { db } from "@/utils/db";
import { Job } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET(req) {
  // Debug logging
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  console.log("Job List API - Request Headers:", {
    auth: authHeader ? `${authHeader.substring(0, 15)}...` : "Missing",
  });

  const user = verifyTokenWithToken(req);

  if (!user) {
    console.log("Job List API: No user found in token or invalid token");
    return NextResponse.json({ error: "Unauthorized: Invalid or missing token" }, { status: 403 });
  }

  if (user.role !== "admin") {
    console.log(`Job List API: User role mismatch. Expected 'admin', got '${user.role}'`);
    return NextResponse.json({ error: "Unauthorized: Admin role required" }, { status: 403 });
  }

  try {
    const jobs = await db
      .select()
      .from(Job)
      .orderBy(desc(Job.createdAt));

    return NextResponse.json({ jobs });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
