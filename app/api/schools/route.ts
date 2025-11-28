// POST /api/schools
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Helper to auto-generate school ID
const generateSchoolId = async () => {
  const { rows } = await pool.query(`SELECT COUNT(*) AS count FROM "School"`);
  const nextId = Number(rows[0].count) + 1;
  return `SCH-${nextId.toString().padStart(4, "0")}`;
};

///
///Get
//////

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
////
// create new school
///
// POST
/////
export async function POST(request: Request) {
  const {
    school_name,
    school_email,
    school_phone,
    school_address,
    school_type,
    district,
    province,
    number_of_students,
    number_of_teachers,
    subscription_year,
    registration_certificate,
    school_license,
    other_documents,
    invoice
  } = await request.json();

  const schoolId = await generateSchoolId();

  const { rows } = await pool.query(
    `INSERT INTO "School" (
      school_id, school_name, school_email, school_phone, school_address,
      school_type, district, province, number_of_students, number_of_teachers,
      subscription_year, registration_certificate, school_license, other_documents,
      invoice
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
    ) RETURNING *`,
    [
      schoolId,
      school_name,
      school_email,
      school_phone,
      school_address,
      school_type,
      district,
      province,
      number_of_students,
      number_of_teachers,
      subscription_year,
      registration_certificate,
      school_license,
      other_documents,
      invoice
    ]
  );

  return NextResponse.json(rows[0]);
}

