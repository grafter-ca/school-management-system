// app/api/users/reset-password-request/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const result = await pool.query(`SELECT * FROM "User" WHERE email=$1`, [email]);
  const user = result.rows[0];

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const token = signToken({ id: user.id }, "15m"); // 15 mins
  await sendResetPasswordEmail(email, token);

  return NextResponse.json({ message: "Password reset email sent" });
}
