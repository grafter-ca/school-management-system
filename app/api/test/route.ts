import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    return NextResponse.json({ message: "DB connected!", time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "DB connection failed" }, { status: 500 });
  }
}
