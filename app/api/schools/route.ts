// POST /api/schools
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Helper to auto-generate school ID
const generateSchoolId = async () => {
  const { rows } = await pool.query(`SELECT COUNT(*) AS count FROM "School"`);
  const nextId = Number(rows[0].count) + 1;
  return `SCH-${nextId.toString().padStart(4, "0")}`;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = `SELECT * FROM "School"`;
  const values: any[] = [];

  if (status) {
    query += ` WHERE status = $1`;
    values.push(status);
  }

  const { rows } = await pool.query(query, values);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { name, address, phone } = await request.json();
  const schoolId = await generateSchoolId();

  const { rows } = await pool.query(
    `INSERT INTO "School" (school_id, name, address, phone) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [schoolId, name, address, phone]
  );
  return NextResponse.json(rows[0]);
}
