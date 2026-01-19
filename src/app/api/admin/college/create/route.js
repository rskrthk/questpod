import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { NextResponse } from "next/server";
import { verifyTokenWithToken } from "@/utils/jwt";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export async function POST(req) {
  const user = verifyTokenWithToken(req);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const contentType = req.headers.get("content-type") || "";

  try {
    let name,
      email,
      mobNo,
      password,
      logoUrl,
      address,
      userName,
      role,
      collegeId;

    if (contentType.includes("multipart/form-data")) {
      // ✅ Handle multipart form with file upload
      const formData = await req.formData();

      name = formData.get("name");
      email = formData.get("email");
      mobNo = formData.get("mobNo");
      password = formData.get("password");
      address = formData.get("address");
      userName = formData.get("userName");
      role = formData.get("role") || "college";
      collegeId = formData.get("collegeId");

      const file = formData.get("file");
      if (file && typeof file !== "string") {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${uuidv4()}_${file.name}`;
        const uploadPath = path.join(
          process.cwd(),
          "public",
          "uploads",
          fileName
        );
        await fs.writeFile(uploadPath, buffer);
        logoUrl = `/uploads/${fileName}`;
      }
    } else if (contentType.includes("application/json")) {
      // ✅ Handle plain JSON body
      const body = await req.json();
      name = body.name;
      email = body.email;
      mobNo = body.mobNo;
      password = body.password;
      logoUrl = body.logo;
      address = body.address;
      userName = body.userName;
      role = body.role || "college";
      collegeId = body.collegeId;
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 415 }
      );
    }

    // ✅ Basic validation
    if (!name || !email || !mobNo || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(User).values({
      name,
      email,
      mobNo: BigInt(mobNo),
      password: hashedPassword,
      logo: logoUrl,
      address,
      userName,
      role,
      collegeId,
      adminId: user.id.toString(),
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    return NextResponse.json({
      message: `${role} college created successfully.`,
    });
  } catch (err) {
    console.error("Error creating college:", err);
    return NextResponse.json(
      { error: "Error creating college", details: err.message },
      { status: 500 }
    );
  }
}
