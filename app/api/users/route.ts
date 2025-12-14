// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query(`SELECT id, name, email, sms_role, is_verified FROM "User" ORDER BY created_at DESC`);
  return NextResponse.json(result.rows);
}

export async function LOGOUT() {
  
}