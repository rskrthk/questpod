import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/validators/authSchema";
import { generateToken } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedBody = loginSchema.parse(body);
    
    const { email, password } = validatedBody;

    const result = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);

    const user = result[0];

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const capitalizedRole = user.role
      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
      : "User";

    return NextResponse.json(
      {
        token,
        message: `${capitalizedRole} logged in successfully.`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          logo: user.logo,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err?.issues?.[0]?.message || err.message;
    return NextResponse.json({ message }, { status: 400 });
  }
}
