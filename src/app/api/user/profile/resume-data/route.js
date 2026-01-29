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
            .select({
                resume: User.resume,
                resumeName: User.resumeName,
            })
            .from(User)
            .where(eq(User.id, user.id));

        if (profile.length === 0) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const { resume, resumeName } = profile[0];

        if (!resume) {
            return NextResponse.json({ error: "No resume uploaded" }, { status: 404 });
        }

        return NextResponse.json({
            resumeData: resume, // This is the data URI
            resumeName: resumeName || "resume.pdf",
        });
    } catch (error) {
        console.error("Error fetching resume data:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
