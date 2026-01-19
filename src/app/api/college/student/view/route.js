import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyTokenWithToken } from "@/utils/jwt";

export async function GET(req, { params }) {
  try {
    // ✅ Verify college token
    const user = verifyTokenWithToken(req);
    if (!user || user.role !== "college") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const id = Number(params.id);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
    }

    // ✅ Query student by ID
    const [student] = await db
      .select()
      .from(User)
      .where(eq(User.id, id))
      .limit(1);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // ✅ Ensure student belongs to the college
    if (student.collegeId !== user.id || student.role !== "student") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
