import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");
  const userId = searchParams.get("userId");

  // MODE 1: Fetch from Database via userId
  if (userId) {
    try {
      const users = await db
        .select({
          resume: User.resume,
          resumeName: User.resumeName
        })
        .from(User)
        .where(eq(User.id, parseInt(userId)));

      if (users.length === 0 || !users[0].resume) {
        return new NextResponse("File not found", { status: 404 });
      }

      const { resume, resumeName } = users[0];

      // Check if it's a Data URI
      if (resume.startsWith("data:")) {
        const matches = resume.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return new NextResponse("Invalid file data", { status: 500 });
        }

        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const filename = resumeName || "resume";

        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `inline; filename="${filename}"`,
          },
        });
      }
      
      // If it's a path string stored in DB (legacy/local), fall through to file logic
      // But we need to handle it as if 'path' param was passed
      // For safety, let's just support Data URI from DB for now on Vercel.
      // If it's a path, it will fail on Vercel anyway.
      return new NextResponse("File stored as path not supported in this mode", { status: 400 });

    } catch (error) {
      console.error("Error serving file from DB:", error);
      return new NextResponse("Error serving file", { status: 500 });
    }
  }

  // MODE 2: Fetch from File System (Legacy / Local Dev)
  if (!filePath) {
    return new NextResponse("File path or userId required", { status: 400 });
  }

  // Security check: ensure path starts with /uploads/ or uploads/ and doesn't contain ..
  const normalizedPath = filePath.replace(/\\/g, "/");
  if ((!normalizedPath.startsWith("/uploads/") && !normalizedPath.startsWith("uploads/")) || normalizedPath.includes("..")) {
    return new NextResponse("Invalid file path", { status: 403 });
  }

  // Remove leading slash if present
  let relativePath = filePath;
  if (relativePath.startsWith("/")) {
    relativePath = relativePath.substring(1);
  }

  const fullPath = path.join(process.cwd(), "public", relativePath);

  try {
    if (!fs.existsSync(fullPath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    
    // Simple mime type mapping
    let contentType = "application/octet-stream";
    if (ext === ".pdf") contentType = "application/pdf";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".doc") contentType = "application/msword";
    else if (ext === ".docx") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (ext === ".txt") contentType = "text/plain";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${path.basename(fullPath)}"`,
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Error serving file", { status: 500 });
  }
}
