import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface Updates {
  [key: string]: any;
}

// PATCH /api/schools/:id
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const updates: Updates = await request.json();

  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setString = fields.map((f, idx) => `"${f}" = $${idx + 1}`).join(", ");

  const { rows } = await pool.query(
    `UPDATE "School" SET ${setString} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return NextResponse.json(rows[0]);
}

// DELETE /api/schools/:id
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  await pool.query(`DELETE FROM "School" WHERE id = $1`, [id]);
  return NextResponse.json({ message: "School deleted successfully" });
}
