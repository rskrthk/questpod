import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyTokenWithToken } from "@/utils/jwt";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const user = verifyTokenWithToken(req);

  if (!user || user.role !== "college") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json(); // expecting { students: [...] }

  try {
    const updates = body.students.map(async (student) => {
      // Only hash password if it's provided
      const hashedPassword = student.password
        ? await bcrypt.hash(student.password, 10)
        : "";

      const updateData = {
        name: student.name,
        email: student.email,
        address: student.address,
        logo: student.logo,
        status: student.status,
      };

      if (student.mobNo) {
        updateData.mobNo = BigInt(student.mobNo);
      }

      if (hashedPassword) {
        updateData.password = hashedPassword;
      }

      await db
        .update(User)
        .set(updateData)
        .where(
          and(
            eq(User.id, student.id),
            eq(User.role, "student"),
            eq(User.collegeId, user.id)
          )
        );
    });

    await Promise.all(updates);

    return NextResponse.json({ message: "Students updated successfully" });
  } catch (error) {
    console.error("Error updating students:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
