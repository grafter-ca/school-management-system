// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const result = await pool.query(
    `SELECT id, name, email, sms_role, is_verified FROM "User" WHERE id=$1`,
    [id]
  );

  if (!result.rows[0])
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(result.rows[0]);
}
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const updates: Record<string, any> = await req.json();

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  // Dynamically build SET clause
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((f, i) => `"${f}"=$${i + 1}`).join(", ");

  // Add updated_at automatically
  const query = `
    UPDATE "User"
    SET ${setClause}, updated_at=NOW()
    WHERE id=$${fields.length + 1}
    RETURNING *;
  `;
  values.push(id);

  try {
    const result = await pool.query(query, values);
    if (!result.rows[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await pool.query(`DELETE FROM "User" WHERE id=$1`, [id]);
  return NextResponse.json({ message: "User deleted" });
}
