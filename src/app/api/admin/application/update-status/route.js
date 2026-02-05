import { db } from "@/utils/db";
import { Application } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const user = verifyTokenWithToken(req);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ error: "Application ID and Status are required" }, { status: 400 });
    }

    await db
      .update(Application)
      .set({ status, updatedAt: new Date() })
      .where(eq(Application.id, parseInt(applicationId)));

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
