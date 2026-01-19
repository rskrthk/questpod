//delete

import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyTokenWithToken } from "@/utils/jwt";

/**
 * POST /api/user/status
 * Body (JSON or multipart):
 *   { "id": <number|string>, "status": "active" | "inactive" | ... }
 * Updates only the status column for the specified user.
 */
export async function POST(req) {
  /* 1. Authorize ----------------------------------------------------------- */
  const authUser = verifyTokenWithToken(req);
  if (!authUser || authUser.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  /* 2. Parse body ---------------------------------------------------------- */
  let id;
  let status;

  try {
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      id = body.id;
      status = body.status;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      id = formData.get("id");
      status = formData.get("status");
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 415 }
      );
    }

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }
    if (typeof status !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid status" },
        { status: 400 }
      );
    }

    /* 3. Update only the status column ------------------------------------- */
    await db.update(User).set({ status }).where(eq(User.id, id));

    return NextResponse.json({
      message: `User ${id} status updated to "${status}".`,
    });
  } catch (err) {
    console.error("status‑update error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}