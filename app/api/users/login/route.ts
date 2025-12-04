// app/api/users/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { comparePassword } from "@/lib/auth";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Get user by email
  const result = await pool.query(`SELECT * FROM "User" WHERE email=$1`, [email]);
  const user = result.rows[0];

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Check if user is verified
  ////
  //// un commet to make it possible
  ///
//   if (!user.is_verified) {
//     return NextResponse.json(
//       { error: "Account not verified. Please check your email." },
//       { status: 403 }
//     );
//   }

  // Check password
  const match = await comparePassword(password, user.password);
  if (!match) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Generate token
  const token = signToken({ id: user.id, email: user.email });

  // Create response and set cookie
  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      sms_role: user.sms_role,
      token:token,
    },
    token
  });

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: "lax",
  });

  return response;
}
