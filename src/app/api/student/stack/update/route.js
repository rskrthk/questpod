import { db } from "@/utils/db";
import { verifyTokenWithToken } from "@/utils/jwt";
import { Stack } from "@/utils/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {

    // const user = await verifyTokenWithToken(request);

    // if (!user || user.role !== "student") {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    // }

    const body = await request.json();
    const { stackNames } = body;

    if (!Array.isArray(stackNames) || stackNames.length === 0) {
        return NextResponse.json({ error: "stackNames must be a non-empty array" }, { status: 400 });
    }

    // Count frequency of each stackName in input
    const freqMap = {};
    for (const name of stackNames) {
        freqMap[name] = (freqMap[name] || 0) + 1;
    }

    try {
        // Get existing stack entries from DB
        const existingStacks = await db
            .select()
            .from(Stack)
            .where(inArray(Stack.stackName, Object.keys(freqMap)));

        const existingMap = Object.fromEntries(
            existingStacks.map(stack => [stack.stackName, stack])
        );

        // Update existing stack counts
        for (const [name, count] of Object.entries(freqMap)) {
            if (existingMap[name]) {
                await db
                    .update(Stack)
                    .set({ count: existingMap[name].count + count })
                    .where(eq(Stack.stackName, name));
            } else {
                await db.insert(Stack).values({ stackName: name, count });
            }
        }

        return NextResponse.json({ message: "Stacks processed successfully" });
    } catch (error) {
        console.error("Error in processing stacks:", error);
        return NextResponse.json({ error: "Failed to process stacks" }, { status: 500 });
    }
}
