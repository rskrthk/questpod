import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const user = verifyTokenWithToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const profile = await db
      .select()
      .from(User)
      .where(eq(User.id, user.id));

    if (profile.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Destructure to separate heavy 'resume' field and 'password'
    const { password, resume, ...safeProfile } = profile[0];

    // If resume exists (either as path or data URI), provide a view URL
    if (resume) {
      // We always point to the view-file endpoint with userId
      // The view-file endpoint will handle fetching the content from DB
      safeProfile.resume = `/api/view-file?userId=${safeProfile.id}`;
      safeProfile.resumeName = safeProfile.resumeName || "Resume";
    }

    return NextResponse.json(safeProfile);
  } catch (error) {
    console.error("Profile view error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
