import { db } from "@/utils/db";
import { User } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyTokenWithToken } from "@/utils/jwt";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import moment from "moment";

export async function POST(req) {
    const user = verifyTokenWithToken(req);

    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    let id, name, email, mobNo, password, address, userName, role, collegeId, status, logoUrl;

    const contentType = req.headers.get("content-type") || "";

    try {
        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();

            id = formData.get("id");
            name = formData.get("name");
            email = formData.get("email");
            mobNo = formData.get("mobNo");
            password = formData.get("password");
            address = formData.get("address");
            userName = formData.get("userName");
            role = formData.get("role") || "college";
            collegeId = formData.get("collegeId");
            status = formData.get("status");
            logoUrl = formData.get("logo");

            const file = formData.get("file");
            if (file && typeof file !== "string") {
                const buffer = Buffer.from(await file.arrayBuffer());
                const mimeType = file.type || 'application/octet-stream';
                const base64 = buffer.toString('base64');
                logoUrl = `data:${mimeType};base64,${base64}`;
            }
        } else {
            const body = await req.json();
            id = body.id;
            name = body.name;
            email = body.email;
            mobNo = body.mobNo;
            password = body.password;
            address = body.address;
            userName = body.userName;
            role = body.role || "college";
            collegeId = body.collegeId;
            status = body.status;
            logoUrl = body.logo;
        }

        if (!id) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        // Build the update object dynamically
        const updateData = {
            name,
            email,
            address,
            userName,
            role,
            collegeId,
            ...(status),
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss")
        };

        if (logoUrl) {
            updateData.logo = logoUrl;
        }

        if (mobNo) {
            try {
                updateData.mobNo = BigInt(mobNo);
            } catch {
                return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
            }
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await db.update(User).set(updateData).where(eq(User.id, id));

        return NextResponse.json({ message: `${role} updated successfully.` });
    } catch (err) {
        console.error("Update user error:", err);
        return NextResponse.json(
            { error: "Error updating user", details: err.message },
            { status: 500 }
        );
    }
}
