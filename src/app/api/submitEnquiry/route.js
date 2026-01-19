// app/api/enquiry/route.js
import { db } from "@/utils/db";
import { Enquiry } from "@/utils/schema";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      universityName,
      position,
      email,
      contactNumber,
      plan,
      message,
    } = body;

    // ✅ Trim inputs (optional but safer)
    const trimmedData = {
      universityName: universityName?.trim(),
      position: position?.trim(),
      email: email?.trim(),
      contactNumber: contactNumber?.trim(),
      plan: plan?.trim(),
      message: message?.trim(),
    };

    const {
      universityName: u,
      position: p,
      email: e,
      contactNumber: c,
      plan: pl,
      message: m,
    } = trimmedData;

    if (!u || !p || !e || !c || !pl || !m) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // ✅ Optional: Add email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // ✅ Insert into database
    await db.insert(Enquiry).values({
      universityName: u,
      position: p,
      email: e,
      contactNumber: c,
      plan: pl,
      message: m,
    });

    // ✅ Prepare data for external API (email trigger)
    const subject = `New Enquiry from ${u}`;
    const data = {
      submissionData: {
        universityName: u,
        position: p,
        email: e,
        contactNumber: c,
        plan: pl,
        message: m,
      },
      type: "Enquiry Form",
      subject,
    };

    // ✅ Call external API
    try {
      const anotherApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/email`;
      const response = await axios.post(anotherApiUrl, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Successfully called external API:", response.data);
    } catch (apiError) {
      console.error("Failed to call the external API:", apiError.message);
    }

    return NextResponse.json({ message: "Enquiry submitted successfully" }, { status: 201 });
  } catch (err) {
    console.error("Error submitting enquiry:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}