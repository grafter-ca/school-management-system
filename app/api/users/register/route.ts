import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/emailVerification";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  // Hash password
  const hashed = await hashPassword(password);

  // Create user with onboarding role and is_verified = false
  const result = await pool.query(
    `INSERT INTO "User"(name, email, password, sms_role, is_verified)
     VALUES($1, $2, $3, $4, $5)
     RETURNING id, name, email, sms_role, is_verified`,
    [name, email, hashed, "ONBOARDING", false]
  );

  const user = result.rows[0];

  // Send verification email
  await sendVerificationEmail(user.name, user.email, user.id);

  // Optional: generate JWT for initial session
  const token = signToken({ id: user.id, email: user.email });

  return NextResponse.json({ user, token });
}
