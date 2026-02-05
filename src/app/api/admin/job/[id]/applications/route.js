import { db } from "@/utils/db";
import { Application, User } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET(req, { params }) {
  const user = verifyTokenWithToken(req);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params; // jobId

  try {
    const applications = await db
      .select({
        id: Application.id,
        userId: Application.userId,
        status: Application.status,
        answers: Application.answers,
        createdAt: Application.createdAt,
        user: {
          name: User.name,
          email: User.email,
          resume: User.resume,
          mobNo: User.mobNo
        }
      })
      .from(Application)
      .leftJoin(User, eq(Application.userId, User.id))
      .where(eq(Application.jobId, parseInt(id)))
      .orderBy(desc(Application.createdAt));

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Fetch applications error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
