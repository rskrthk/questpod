import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const user = verifyTokenWithToken(req); 

  if (!user || user.role !== "college") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("logo");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Invalid or missing file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'application/octet-stream';
    const base64 = buffer.toString('base64');
    const logoUrl = `data:${mimeType};base64,${base64}`;

    await db
      .update(User)
      .set({ logo: logoUrl })
      .where(eq(User.id, user.id));

    return NextResponse.json({ message: "Logo uploaded successfully", logo: logoUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
  }
}
