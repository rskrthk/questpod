import { db } from "@/utils/db";
import { verifyTokenWithToken } from "@/utils/jwt";
import { Stack } from "@/utils/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request) {
  const user = await verifyTokenWithToken(request);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const stacks = await db.select().from(Stack).orderBy(desc(Stack.count));

    return NextResponse.json({ stacks });
  } catch (error) {
    console.error("Error fetching stacks:", error);
    return NextResponse.json(
      { error: "Failed to fetch stacks" },
      { status: 500 }
    );
  }
}
