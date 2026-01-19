import { db } from "@/utils/db";
import { ContactForm } from "@/utils/schema";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import moment from "moment";
import axios from "axios";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const universityName = formData.get("universityName");
    const name = formData.get("name");
    const email = formData.get("email");
    const issueType = formData.get("issueType");
    const subject = formData.get("subject");
    const message = formData.get("message");
    const file = formData.get("attachment");

    let attachmentUrl = null;

    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}_${file.name.replace(/[\s()]+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "contactForm");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filepath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filepath, buffer);
      attachmentUrl = `/uploads/contactForm/${filename}`;
    }

    const submissionData = {
      universityName,
      name,
      email,
      issueType,
      subject,
      message,
      attachmentUrl,
      createdAt: moment().toDate(),
    };

    // 1. Insert the new values into the database
    await db.insert(ContactForm).values(submissionData);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const subjectName = `New Contact from ${universityName}`;
    const data = {
      submissionData: {
        ...submissionData,
        attachmentUrl: attachmentUrl ? `${baseUrl}${attachmentUrl}` : null,
      },
      type: "Contact Form",
      subject: subjectName,
    };
    // --- START: Call Another API ---
    // 2. After successful insertion, call the other API
    try {
      const anotherApiUrl = `${baseUrl}/api/email`;

      const response = await axios.post(anotherApiUrl, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Successfully called external API:", response.data);
    } catch (apiError) {
      console.error("Failed to call the external API:", apiError);
    }

    return NextResponse.json({ message: "Feedback submitted successfully" }, { status: 201 });
  } catch (err) {
    console.error("Error in feedback submission:", err);
    const message = err?.issues?.[0]?.message || err.message;
    return NextResponse.json({ message }, { status: 400 });
  }
}