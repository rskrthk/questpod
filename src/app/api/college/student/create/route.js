import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { NextResponse } from "next/server";
import { verifyTokenWithToken } from "@/utils/jwt";
import bcrypt from "bcryptjs"; // make sure it's imported
import moment from "moment";

export async function POST(req) {
  const user = verifyTokenWithToken(req);

  // ✅ Only college role can create students
  if (!user || user.role !== "college") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();

  try {
    const students = await Promise.all(
      body.students?.map(async (student) => ({
        name: student.name,
        email: student.email,
        mobNo: BigInt(student.mobNo),
        password: await bcrypt.hash(student.password, 10), // ✅ hash individually
        role: "student",
        address: student.address,
        logo: student.logo,
        collegeId: user.id,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      }))
    );

    await db.insert(User).values(students);
    return NextResponse.json({ message: "Students created successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
