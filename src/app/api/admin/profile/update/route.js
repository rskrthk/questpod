import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const user = verifyTokenWithToken(req); 

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("logo");
    const name = formData.get("name");
    const email = formData.get("email");
    const mobNo = formData.get("mobNo");

    const updateData = {};

    if (name) updateData.name = String(name);
    if (email) updateData.email = String(email);
    if (mobNo) updateData.mobNo = mobNo;

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type || 'application/octet-stream';
      const base64 = buffer.toString('base64');
      updateData.logo = `data:${mimeType};base64,${base64}`;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await db.update(User).set(updateData).where(eq(User.id, user.id));

    return NextResponse.json({ message: "User updated successfully", ...updateData });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}