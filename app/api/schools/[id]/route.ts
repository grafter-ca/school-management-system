import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { uploadSingleFileCloud } from "@/middleware/uploadSingleCloud";
import { v4 as uuidv4 } from "uuid";

export const config = { api: { bodyParser: false } };

// ================================
// GET /api/schools/:id
// ================================
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { rows } = await pool.query(
    `SELECT * FROM "School" WHERE school_id = $1`,
    [id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

// ================================
// PUT /api/schools/:id
// Supports text fields + file uploads
// ================================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Check if request is formData (file upload)
    let formData;
    try {
      formData = await req.formData();
    } catch {
      formData = null;
    }

    // ---------------------------------------
    // CASE 1: JSON update (simple PUT)
    // ---------------------------------------
    if (!formData) {
      const updates = await req.json();
      const fields = Object.keys(updates);
      const values = Object.values(updates);

      if (fields.length === 0)
        return NextResponse.json({ message: "No fields to update" });

      const setString = fields
        .map((f, i) => `"${f}" = $${i + 1}`)
        .join(", ");

      const { rows } = await pool.query(
        `UPDATE "School" SET ${setString} WHERE school_id = $${fields.length + 1} RETURNING *`,
        [...values, id]
      );

      if (!rows.length)
        return NextResponse.json({ error: "School not found" }, { status: 404 });

      return NextResponse.json(rows[0]);
    }

    // ---------------------------------------
    // CASE 2: form-data update (with files)
    // ---------------------------------------

    const allowedFields = [
      "school_name",
      "school_email",
      "school_phone",
      "school_type",
      "district",
      "province",
      "number_of_students",
      "number_of_teachers",
      "subscription_year",
      "level",
      "cell",
      "sector",
      "village",
      "registration_date",
      "headmaster_name",
      "headmaster_email",
      "headmaster_phone",
    ];

    const textUpdates: any = {};

    for (const f of allowedFields) {
      const v = formData.get(f);
      if (v !== null && v !== undefined && v !== "") textUpdates[f] = v;
    }

    // Update TEXT FIELDS
    if (Object.keys(textUpdates).length > 0) {
      const fields = Object.keys(textUpdates);
      const values = Object.values(textUpdates);

      const setString = fields
        .map((f, i) => `"${f}" = $${i + 1}`)
        .join(", ");

      await pool.query(
        `UPDATE "School" SET ${setString} WHERE school_id = $${fields.length + 1}`,
        [...values, id]
      );
    }

    // Update FILES
    const fileFields = [
      { key: "registration_certificate", type: "registration_certificate" },
      { key: "payment_proof", type: "payment_proof" },
      { key: "invoice", type: "invoice" },
      { key: "other_documents", type: "other_documents" },
    ];

    const updatedDocuments: any[] = [];

    for (const fileField of fileFields) {
      const file = formData.get(fileField.key) as Blob | null;
      if (!file) continue;

      // Upload new file
      const uploaded = await uploadSingleFileCloud(file);

      // Check if that document type exists for this school
      const existing = await pool.query(
        `SELECT * FROM "Document" WHERE school_id = $1 AND type = $2`,
        [id, fileField.type]
      );

      if (existing.rows.length > 0) {
        // Update existing document
        const updated = await pool.query(
          `UPDATE "Document"
           SET file = $1
           WHERE school_id = $2 AND type = $3
           RETURNING *`,
          [uploaded.url, id, fileField.type]
        );
        updatedDocuments.push(updated.rows[0]);
      } else {
        // Create new document
        const inserted = await pool.query(
          `INSERT INTO "Document" (document_id, school_id, type, file)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [uuidv4(), id, fileField.type, uploaded.url]
        );
        updatedDocuments.push(inserted.rows[0]);
      }
    }

    return NextResponse.json({
      message: "School updated successfully",
      updated_fields: textUpdates,
      updated_documents: updatedDocuments,
    });
  } catch (err: any) {
    console.error("ERROR UPDATING SCHOOL:", err);
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
  const { id } = await context.params;

  await pool.query(`DELETE FROM "Document" WHERE school_id = $1`, [id]);

  const { rows } = await pool.query(
    `DELETE FROM "School" WHERE school_id = $1 RETURNING *`,
    [id]
  );

  if (rows.length === 0)
    return NextResponse.json({ error: "School not found" }, { status: 404 });

  return NextResponse.json({ message: "School deleted successfully" });
}
