import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { uploadSingleFileCloud, UploadedFile } from "@/middleware/uploadSingleCloud";
import { v4 as uuidv4 } from "uuid";

export const config = { api: { bodyParser: false } };

// ================================
// GET /api/schools/:id
// ================================
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { rows } = await pool.query(
      `SELECT * FROM "School" WHERE school_id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err: any) {
    console.error("GET Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ================================
// PUT /api/schools/:id
// Supports FormData with file uploads
// ================================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Check if school exists
    const existingSchool = await pool.query(
      `SELECT * FROM "School" WHERE school_id = $1`,
      [id]
    );

    if (existingSchool.rows.length === 0) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const formData = await req.formData();

    // Extract text fields
    const fields = {
      school_name: formData.get("school_name") as string,
      school_email: formData.get("school_email") as string,
      school_phone: formData.get("school_phone") as string,
      school_type: formData.get("school_type") as string,
      district: formData.get("district") as string,
      province: formData.get("province") as string,
      number_of_students: formData.get("number_of_students") as string,
      number_of_teachers: formData.get("number_of_teachers") as string,
      subscription: formData.get("subscription") as string,
      subscription_year: formData.get("subscription_year") as string,
      level: formData.get("level") as string,
      cell: formData.get("cell") as string,
      sector: formData.get("sector") as string,
      village: formData.get("village") as string,
      registration_date: formData.get("registration_date") as string,
      headmaster_name: formData.get("headmaster_name") as string,
      headmaster_email: formData.get("headmaster_email") as string,
      headmaster_phone: formData.get("headmaster_phone") as string,
      reject_message: formData.get("reject_message") as string || null,
    };

    // Update school text fields
    await pool.query(
      `UPDATE "School" SET
        school_name = $1,
        school_email = $2,
        school_phone = $3,
        school_type = $4,
        district = $5,
        province = $6,
        number_of_students = $7,
        number_of_teachers = $8,
        subscription = $9,
        subscription_year = $10,
        level = $11,
        cell = $12,
        sector = $13,
        village = $14,
        registration_date = $15,
        headmaster_name = $16,
        headmaster_email = $17,
        headmaster_phone = $18,
        reject_message = $19
      WHERE school_id = $20`,
      [
        fields.school_name,
        fields.school_email,
        fields.school_phone,
        fields.school_type,
        fields.district,
        fields.province,
        fields.number_of_students,
        fields.number_of_teachers,
        fields.subscription,
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
        id,
      ]
    );

    // Handle file uploads and update Document table
    const fileFields = [
      { key: "registration_certificate", type: "registration_certificate" },
      { key: "payment_proof", type: "payment_proof" },
      { key: "invoice", type: "invoice" },
      { key: "other_documents", type: "other_documents" },
    ];

    const updatedDocuments: any[] = [];

    for (const fileField of fileFields) {
      const file = formData.get(fileField.key) as Blob | null;
      
      // Skip if no file or if file is empty
      if (!file || file.size === 0) continue;

      // Upload new file to Cloudinary
      const uploaded: UploadedFile = await uploadSingleFileCloud(file);

      // Check if document already exists for this school
      const existing = await pool.query(
        `SELECT * FROM "Document" WHERE school_id = $1 AND type = $2`,
        [id, fileField.type]
      );

      if (existing.rows.length > 0) {
        // Update existing document
        const updated = await pool.query(
          `UPDATE "Document"
           SET file = $1, updated_at = NOW()
           WHERE school_id = $2 AND type = $3
           RETURNING *`,
          [uploaded.url, id, fileField.type]
        );
        updatedDocuments.push(updated.rows[0]);
      } else {
        // Insert new document
        const inserted = await pool.query(
          `INSERT INTO "Document" (document_id, school_id, type, file, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())
           RETURNING *`,
          [uuidv4(), id, fileField.type, uploaded.url]
        );
        updatedDocuments.push(inserted.rows[0]);
      }
    }

    // Fetch and return updated school
    const { rows } = await pool.query(
      `SELECT * FROM "School" WHERE school_id = $1`,
      [id]
    );

    return NextResponse.json({
      message: "School updated successfully",
      school: rows[0],
      updated_documents: updatedDocuments,
    });
  } catch (err: any) {
    console.error("PUT Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ================================
// DELETE /api/schools/:id
// ================================
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Delete associated documents first
    await pool.query(`DELETE FROM "Document" WHERE school_id = $1`, [id]);

    // Delete the school
    const { rows } = await pool.query(
      `DELETE FROM "School" WHERE school_id = $1 RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "School deleted successfully",
      deleted_school: rows[0]
    });
  } catch (err: any) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}