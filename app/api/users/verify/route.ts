import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token missing" }, { status: 400 });

  try {
    // Verify token
    const payload: any = verifyToken(token);

    // Update user to verified
    const result = await pool.query(
      `UPDATE "User" SET is_verified = true, updated_at = NOW()
       WHERE id = $1 RETURNING id, name, email, sms_role, is_verified`,
      [payload.id]
    );

    if (!result.rows[0]) {
      // If user not found, redirect to login anyway
      return NextResponse.redirect("/login");
    }

    // Redirect to login after successful verification
    return NextResponse.redirect("/login");
    
  } catch (error) {
    console.error("Verification error:", error);
    // Redirect to login even if token is invalid/expired
    return NextResponse.redirect("/login");
  }
}
