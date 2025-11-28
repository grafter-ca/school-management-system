// app/api/documents/route.ts
import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  const { rows } = await pool.query(`SELECT * FROM "Document"`);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  // Expected JSON: { schoolId, type, filePath }
  const { schoolId, type, filePath } = await request.json();

  const { rows } = await pool.query(
    `INSERT INTO "Document" (school_id, type, file_path) VALUES ($1, $2, $3) RETURNING *`,
    [schoolId, type, filePath]
  );
  return NextResponse.json(rows[0]);
}

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  const updates = await request.json();

  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setString = fields.map((f, idx) => `"${f}" = $${idx + 1}`).join(", ");

  const { rows } = await pool.query(
    `UPDATE "Document" SET ${setString} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );
  return NextResponse.json(rows[0]);
}

// DELETE /api/documents/:id
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  await pool.query(`DELETE FROM "Document" WHERE id = $1`, [id]);
  return NextResponse.json({ message: "Document deleted successfully" });
}
