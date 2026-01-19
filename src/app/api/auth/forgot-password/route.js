import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/validators/authSchema"; 
import { sendResetEmail } from "@/utils/sendResetEmail";

export async function POST(request) {
  try {
    const body = await request.json();

    //  Validate input
    const { email } = forgotPasswordSchema.parse(body);

    // 1. Check if user exists
    const result = await db.select().from(User).where(eq(User.email, email)).limit(1);
    if (result.length === 0) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }

    const user = result[0];

    // 2. Generate random password (8–12 characters, alphanumeric)
    const newPassword = crypto.randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update user password in DB
    await db
      .update(User)
      .set({ password: hashedPassword })
      .where(eq(User.id, user.id));

    // 5. Send the new password to the user's email
    await sendResetEmail(email, newPassword);

    return NextResponse.json({ message: "New password sent to your email" });
  } catch (err) {
    const message = err?.issues?.[0]?.message || err.message;
    return NextResponse.json({ message }, { status: 400 });
  }
}
