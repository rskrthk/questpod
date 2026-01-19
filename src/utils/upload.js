//utils/upload.js
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveFile(file) {
  // create uploads folder the first time
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop() ?? "";
  const hash = crypto.randomBytes(16).toString("hex");
  const fileName = `${hash}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  await fs.writeFile(filePath, buffer);
  return `/uploads/${fileName}`; 
}