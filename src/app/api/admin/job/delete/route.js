import { db } from "@/utils/db";
import { Job } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function DELETE(req) {
  const user = verifyTokenWithToken(req);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    await db
      .delete(Job)
      .where(eq(Job.id, id));

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
