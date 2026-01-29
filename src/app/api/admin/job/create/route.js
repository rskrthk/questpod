import { db } from "@/utils/db";
import { Job } from "@/utils/schema";
import { verifyTokenWithToken } from "@/utils/jwt";
import { NextResponse } from "next/server";

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

    const title = getValue("title");
    const company = getValue("company");
    const location = getValue("location");
    const type = getValue("type");
    const description = getValue("description");
    const requirements = getValue("requirements");
    const salary = getValue("salary");
    const applicationLink = getValue("applicationLink");
    const noticePeriod = getValue("noticePeriod");
    const skills = getValue("skills");
    const experience = getValue("experience");
    const expireIn = getValue("expireIn");

    let companyIcon = null;
    const file = formData.get("companyIcon");

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type || 'application/octet-stream';
      const base64 = buffer.toString('base64');
      companyIcon = `data:${mimeType};base64,${base64}`;
    } else if (typeof file === 'string' && file.length > 0) {
      companyIcon = file;
    }

    const [job] = await db
      .insert(Job)
      .values({
        title,
        company,
        location,
        type,
        description,
        requirements,
        salary,
        applicationLink,
        noticePeriod,
        skills,
        experience,
        expireIn: expireIn ? new Date(expireIn) : null,
        companyIcon,
        adminId: user.id,
      })
      .returning();

    return NextResponse.json({ job });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
