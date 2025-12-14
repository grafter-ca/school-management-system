// /app/api/schools/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import {
  uploadSingleFileCloud,
  UploadedFile,
} from "@/middleware/uploadSingleCloud";
// Disable Next.js body parser for FormData
export const config = { api: { bodyParser: false } };

// -----------------------------
// GET ALL SCHOOLS (with optional status filter)
// -----------------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = `SELECT * FROM "School"`;
    const params: any[] = [];

    // Filter by status if provided
    if (status) {
      query += ` WHERE status = $1`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const { rows } = await pool.query(query, params);
    
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("GET Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
// -----------------------------
// CREATE SCHOOL + UPLOAD FILES
// -----------------------------
export async function POST(req: NextRequest) {

  try {
    const formData = await req.formData();

 function generateSchoolID(Level: string) {
  // Take the first letter of the school level and make it uppercase
  const levelLetter = Level.charAt(0).toUpperCase();

  // Generate 4 random digits
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 1000-9999

  // Combine to create school ID
  const schoolID = `SCH-${levelLetter}${randomDigits}`;

  return schoolID;
}



    // Extract all the text fields
    const fields = {
      school_name: formData.get("school_name") as string,
      school_email: formData.get("school_email") as string,
      school_phone: formData.get("school_phone") as string,
      school_type: formData.get("school_type") as string,
      district: formData.get("district") as string,
      province: formData.get("province") as string,
      number_of_students: formData.get("number_of_students") as string,
      number_of_teachers: formData.get("number_of_teachers") as string,
      subscription_year: formData.get("subscription_year") as string,
      level: formData.get("level") as string,
      cell: formData.get("cell") as string,
      sector: formData.get("sector") as string,
      village: formData.get("village") as string,
      registration_date: formData.get("registration_date") as string,
      headmaster_name: formData.get("headmaster_name") as string,
      headmaster_email: formData.get("headmaster_email") as string,
      headmaster_phone: formData.get("headmaster_phone") as string,
      reject_message: formData.get("reject_message") as string,
    };

    // schoool id
      const school_id = generateSchoolID(fields.level);

    // check if school already exists
    const existingSchool = await pool.query(
      `SELECT * FROM "School" WHERE school_email = $1`,
      [fields.school_email]
    );

    if (existingSchool.rows.length > 0) {
      return NextResponse.json(
        { error: "A school with this email already exists." },
        { status: 400 }
      );
    }

    // Uploadable file fields
    const fileUploads: any = {
      registration_certificate: null,
      payment_proof: null,
      invoice: null,
      other_documents: null,
    };

    // Upload each file to Cloudinary
    for (const key of Object.keys(fileUploads)) {
      const fileBlob = formData.get(key) as Blob | null;

      if (fileBlob) {
        const uploaded: UploadedFile = await uploadSingleFileCloud(fileBlob);
        fileUploads[key] = uploaded.url;
      }
    }

    // Insert school + file URLs directly into School table
    const { rows } = await pool.query(
      `INSERT INTO "School" (
        school_id, school_name, school_email, school_phone, school_type,
        district, province, number_of_students, number_of_teachers,
        subscription_year, level, cell, sector, village, registration_date,
        headmaster_name, headmaster_email, headmaster_phone,
        registration_certificate, payment_proof, invoice, other_documents, reject_message
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
        $19,$20,$21,$22,$23
      )
      RETURNING *`,
      [
        school_id,
        fields.school_name,
        fields.school_email,
        fields.school_phone,
        fields.school_type,
        fields.district,
        fields.province,
        fields.number_of_students,
        fields.number_of_teachers,
        fields.subscription_year,
        fields.level,
        fields.cell,
        fields.sector,
        fields.village,
        fields.registration_date,
        fields.headmaster_name,
        fields.headmaster_email,
        fields.headmaster_phone,
        fields.reject_message,
        fileUploads.registration_certificate,
        fileUploads.payment_proof,
        fileUploads.invoice,
        fileUploads.other_documents,
        fields.reject_message,
      ]
    );

    return NextResponse.json(rows[0]);
  } catch (err: any) {
    console.error("POST Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}