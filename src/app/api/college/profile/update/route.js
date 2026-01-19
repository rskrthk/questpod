import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filepath, buffer);

    const logoUrl = `/uploads/${filename}`;

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
