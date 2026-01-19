import { db } from "@/utils/db";
import { verifyTokenWithToken } from "@/utils/jwt";
import { MockInterview, UserAnswer, Stack } from "@/utils/schema";
import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  const user = verifyTokenWithToken(request);

  if (!user || user.role !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { mockId } = body;

  if (!mockId) {
    return NextResponse.json({ error: "mockId is required" }, { status: 400 });
  }

  try {
    // 1️⃣ Fetch mock interview to ensure ownership
    const mock = await db
      .select()
      .from(MockInterview)
      .where(and(eq(MockInterview.mockId, mockId), eq(MockInterview.createdBy, user.email)))
      .then(res => res[0]);

    if (!mock) {
      return NextResponse.json({ error: "Mock interview not found or unauthorized" }, { status: 404 });
    }

    const stackNames = mock.stack;
    const freqMap = stackNames?.reduce((acc, stack) => {
      acc[stack] = (acc[stack] || 0) + 1;
      return acc;
    }, {});

    // 3️⃣ Handle stack updates or deletions
    if (freqMap && Object.keys(freqMap).length > 0) {
      const existingStacks = await db
        .select()
        .from(Stack)
        .where(inArray(Stack.stackName, Object.keys(freqMap)));

      for (const existing of existingStacks) {
        const decrement = freqMap[existing.stackName] || 0;
        const newCount = existing.count - decrement;

        if (newCount > 0) {
          await db
            .update(Stack)
            .set({ count: newCount })
            .where(eq(Stack.stackName, existing.stackName));
        } else {
          await db
            .delete(Stack)
            .where(eq(Stack.stackName, existing.stackName));
        }
      }
    }

    // 4️⃣ Delete from UserAnswer and MockInterview
    await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, mockId));
    await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));

    return NextResponse.json({ message: "Interview and stack references deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview and stacks:", error);
    return NextResponse.json({ error: "Failed to delete interview" }, { status: 500 });
  }
}
