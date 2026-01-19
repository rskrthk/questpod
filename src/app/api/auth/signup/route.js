import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/validators/authSchema";
import { NextResponse } from "next/server";
import moment from "moment";

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedBody = signupSchema.parse(body);
    const {
      name,
      email,
      mobNo,
      password,
      userName,
      role,
    } = validatedBody;

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(User).values({
      name,
      email,
      mobNo: parseInt(mobNo),
      password: hashedPassword,
      role,
      createdAt: moment().format("DD-MM-YYYY"),
      status: "Active",
    });
    const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

    return NextResponse.json(
      { message: `${capitalizedRole} registered successfully.` },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in signup:", err);
    const message = err?.issues?.[0]?.message || err.message;
    return NextResponse.json({ message }, { status: 400 });
  }
}
