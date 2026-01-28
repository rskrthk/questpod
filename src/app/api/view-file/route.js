import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");

  if (!filePath) {
    return new NextResponse("File path required", { status: 400 });
  }

  // Security check: ensure path starts with /uploads/ or uploads/ and doesn't contain ..
  // Also normalize slashes for check
  const normalizedPath = filePath.replace(/\\/g, "/");
  if ((!normalizedPath.startsWith("/uploads/") && !normalizedPath.startsWith("uploads/")) || normalizedPath.includes("..")) {
    return new NextResponse("Invalid file path", { status: 403 });
  }

  // Remove leading slash if present to join correctly
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
