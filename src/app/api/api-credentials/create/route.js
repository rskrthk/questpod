// app/api/api-credentials/create/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { apiCredentials } from "@/utils/schema";
import { eq } from "drizzle-orm";          // only needed if you prefer the query‑then‑update path
import { verifyTokenWithToken } from "@/utils/jwt";

export async function POST(request) {

    const authUser = verifyTokenWithToken(request);
    if (!authUser || authUser.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    try {
        const body = await request.json();
        const { apiKey, primaryKey='', secondaryKey='', button='' } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "apiKey is required" }, { status: 400 });
        }

        /* ---------- OPTION 1 : Single statement UPSERT (recommended) ---------- *
         * Works if api_credentials.api_key has a UNIQUE index or constraint       */
        const [row] = await db
            .insert(apiCredentials)
            .values({
                apiKey,
                primaryKey,
                secondaryKey,
                button,
                status: "Active",
            })
            .onConflictDoUpdate({
                target: apiCredentials.apiKey,           // conflict column
                set: {
                    primaryKey,
                    secondaryKey,
                    button,
                    status: "Active",
                    updatedAt: new Date(),
                },
            })
            .returning();                              // ← returns the row after insert/update

        return NextResponse.json(
            {
                success: true,
                action: row?.id ? "upserted" : "created",
                data: row,
            },
            { status: 201 },
        );

        /* ---------- OPTION 2 : Query‑then‑update path ------------------------- *
         * Uncomment if you prefer two separate queries instead of onConflict.     *
         *
         * const [existing] = await db
         *   .select()
         *   .from(apiCredentials)
         *   .where(eq(apiCredentials.apiKey, apiKey));
         *
         * let result, action;
         * if (existing) {
         *   [result] = await db
         *     .update(apiCredentials)
         *     .set({
         *       primaryKey,
         *       secondaryKey,
         *       button,
         *       status: status ?? existing.status,
         *       updatedAt: new Date(),
         *     })
         *     .where(eq(apiCredentials.id, existing.id))
         *     .returning();
         *   action = "updated";
         * } else {
         *   [result] = await db
         *     .insert(apiCredentials)
         *     .values({
         *       apiKey,
         *       primaryKey,
         *       secondaryKey,
         *       button,
         *       status: status ?? "Active",
         *     })
         *     .returning();
         *   action = "created";
         * }
         * return NextResponse.json({ success: true, action, data: result }, { status: 201 });
         */
    } catch (error) {
        console.error("API credentials upsert error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}