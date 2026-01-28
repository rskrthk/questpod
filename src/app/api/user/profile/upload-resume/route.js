import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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

    // Convert file to Base64 Data URI for DB storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'application/octet-stream';
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;
    
    const originalName = file.name;

    await db
      .update(User)
      .set({
        resume: dataUri,
        resumeName: originalName,
      })
      .where(eq(User.id, user.id));

    return NextResponse.json({ 
      message: "Resume uploaded successfully", 
      resume: `/api/view-file?userId=${user.id}`,
      resumeName: originalName 
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
