import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/emailVerification";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password,sms_role="ONBOARDING"} = await req.json();

    // 1️⃣ Check if user already exists
    const existingUser = await pool.query(
      `SELECT 1 FROM "User" WHERE email = $1 LIMIT 1`,
      [email]
    );

    if ((existingUser.rowCount ?? 0) > 0) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 409 }
      );
    }

    // 2️⃣ Hash password
    const hashed = await hashPassword(password);

    // 3️⃣ Create user
    const result = await pool.query(
      `INSERT INTO "User"(name, email, password, sms_role, is_verified)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, sms_role, is_verified`,
      [name, email, hashed,sms_role, false]
    );

    const user = result.rows[0];

    // 4️⃣ Send verification email
    await sendVerificationEmail(user.name, user.email, user.id);
    // 5️⃣ Generate JWT
    const token = signToken({ id: user.id, email: user.email });

    return NextResponse.json(
      { message: "Verification Link Sent!", user, token },
      { status: 201 }
    );

  } catch (error: any) {
    // 🔐 Handle unique constraint race condition
    if (error.code === "23505") {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
