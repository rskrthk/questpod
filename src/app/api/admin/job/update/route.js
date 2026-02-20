import { db } from "@/utils/db";
import { Job } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const user = verifyTokenWithToken(req);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();

    const getValue = (key) => {
      const val = formData.get(key);
      return val === "undefined" || val === "null" ? null : val;
    }

    const id = getValue("id");
    const title = getValue("title");
    const company = getValue("company");
    const location = getValue("location");
    const type = getValue("type");
    const description = getValue("description");
    const requirements = getValue("requirements");
    const salary = getValue("salary");
    const applicationLink = getValue("applicationLink");
    const status = getValue("status");
    const noticePeriod = getValue("noticePeriod");
    const skills = getValue("skills");
    const experience = getValue("experience");
    const expireIn = getValue("expireIn");
    const customQuestions = getValue("customQuestions");
    const hiringProcess = getValue("hiringProcess");

    let companyIcon = undefined;
    const file = formData.get("companyIcon");

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type || 'application/octet-stream';
      const base64 = buffer.toString('base64');
      companyIcon = `data:${mimeType};base64,${base64}`;
    } else if (typeof file === 'string' && file.length > 0) {
      // If string, it means we are keeping existing URL or updating with new URL
      companyIcon = file;
    }

    // Only include companyIcon in update set if it's defined
    const updateData = {
      title,
      company,
      location,
      type,
      description,
      requirements,
      salary,
      applicationLink,
      status,
      noticePeriod,
      skills,
      experience,
      expireIn: expireIn ? new Date(expireIn) : null,
      customQuestions,
      hiringProcess,
      updatedAt: new Date(),
    };

    if (companyIcon !== undefined) {
      updateData.companyIcon = companyIcon;
    }

    const [job] = await db
      .update(Job)
      .set(updateData)
      .where(eq(Job.id, id))
      .returning();

    return NextResponse.json({ job });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
