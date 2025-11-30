// app/api/users/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();

  try {
    const payload: any = verifyToken(token);
    const hashed = await hashPassword(newPassword);

    await pool.query(`UPDATE "User" SET password=$1, updated_at=NOW() WHERE id=$2`, [hashed, payload.id]);
    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
