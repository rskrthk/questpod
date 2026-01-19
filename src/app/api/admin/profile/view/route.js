// app/api/profile/route.js

import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const user = verifyTokenWithToken(req);

  if (!user || user.role !== "admin") {
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

    // Optionally exclude password
    const { password, ...safeProfile } = profile[0];

    return NextResponse.json(safeProfile);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
