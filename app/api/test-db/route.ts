import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(`SELECT * FROM "School" ORDER BY created_at DESC`);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}

