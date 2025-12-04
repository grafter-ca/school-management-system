import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { status, rejectionReason } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be PENDING, APPROVED, or REJECTED" },
        { status: 400 }
      );
    }

    // Check if school exists
    const existingSchool = await pool.query(
      `SELECT * FROM "School" WHERE school_id = $1`,
      [id]
    );

    if (existingSchool.rows.length === 0) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    // Update school status
    let query;
    let params;

    if (status === 'REJECTED' && rejectionReason) {
      query = `UPDATE "School" 
               SET status = $1, reject_message = $2, updated_at = NOW() 
               WHERE school_id = $3 
               RETURNING *`;
      params = [status, rejectionReason, id];
    } else if (status === 'APPROVED') {
      query = `UPDATE "School" 
               SET status = $1, reject_message = NULL, updated_at = NOW() 
               WHERE school_id = $2 
               RETURNING *`;
      params = [status, id];
    } else {
      query = `UPDATE "School" 
               SET status = $1, updated_at = NOW() 
               WHERE school_id = $2 
               RETURNING *`;
      params = [status, id];
    }

    const { rows } = await pool.query(query, params);

    return NextResponse.json({
      message: `School ${status.toLowerCase()} successfully`,
      school: rows[0],
    });
  } catch (err: any) {
    console.error("PATCH /api/schools/[id]/status Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}