import { db } from "@/utils/db";
import { ContactForm } from "@/utils/schema";
import { NextResponse } from "next/server";
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
      const mimeType = file.type || 'application/octet-stream';
      const base64 = buffer.toString('base64');
      attachmentUrl = `data:${mimeType};base64,${base64}`;
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
        // If attachmentUrl is a Data URI, pass it directly. If it was a path (legacy), prefix it.
        attachmentUrl: attachmentUrl && attachmentUrl.startsWith("data:") 
          ? attachmentUrl 
          : (attachmentUrl ? `${baseUrl}${attachmentUrl}` : null),
        attachmentName: file && file.name ? file.name : "attachment"
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