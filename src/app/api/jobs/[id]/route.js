import { db } from "@/utils/db";
import { Job } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const [job] = await db
      .select()
      .from(Job)
      .where(and(eq(Job.id, id), eq(Job.status, "Active")))
      .limit(1);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
