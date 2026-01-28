import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { saveFile } from "@/utils/upload";

export async function POST(req) {
  const user = verifyTokenWithToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("resume");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filePath = await saveFile(file);
    const originalName = file.name;

    await db
      .update(User)
      .set({
        resume: filePath,
        resumeName: originalName,
      })
      .where(eq(User.id, user.id));

    return NextResponse.json({ 
      message: "Resume uploaded successfully", 
      resume: filePath,
      resumeName: originalName 
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
