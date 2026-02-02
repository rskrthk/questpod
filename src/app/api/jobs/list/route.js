import { db } from "@/utils/db";
import { Job } from "@/utils/schema";
import { NextResponse } from "next/server";
import { desc, eq, and, or, gt, isNull } from "drizzle-orm";

export async function GET() {
  try {
    const jobs = await db
      .select()
      .from(Job)
      .where(
        and(
          eq(Job.status, "Active"),
          or(isNull(Job.expireIn), gt(Job.expireIn, new Date()))
        )
      )
      .orderBy(desc(Job.createdAt));

    return NextResponse.json({ jobs });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
