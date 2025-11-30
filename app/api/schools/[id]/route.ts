import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { rows } = await pool.query(`SELECT * FROM "School" WHERE id = $1`, [
    id,
  ]);

  if (rows.length === 0) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

// PUT /api/schools/:id → update school
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const updates = await request.json();

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    return NextResponse.json({ message: "No fields to update" });
  }

  const setString = fields.map((f, idx) => `"${f}" = $${idx + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE "School" SET ${setString} WHERE id = $${
      fields.length + 1
    } RETURNING *`,
    [...values, id]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

// DELETE /api/schools/:id → delete school
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const result = await pool.query(
    `DELETE FROM "School" WHERE id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "School deleted successfully" });
}
