import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendApprovalRequest } from "@/lib/resend";


// request approval 
///PUT METHOS
//
export async function PUT(req: Request) {
  try {
    const { schoolId } = await req.json();
    if (!schoolId) {
      return NextResponse.json({ error: "schoolId is required" }, { status: 400 });
    }

    // Update DB status
    const { rows } = await pool.query(
      `UPDATE schools SET status = 'PENDING' WHERE school_id = $1 RETURNING *`,
      [schoolId]
    );
    const school = rows[0];
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    // Send email via Resend
    const complianceEmail = process.env.COMPLIENCE_EMAIL || "caleb.designer1@gmail.com";
    try {
      await sendApprovalRequest(complianceEmail, school.name, school.school_id);
    } catch (err) {
      console.error("Failed to send approval email:", err);
      // optionally continue even if email fails
    }

    return NextResponse.json({ message: "Approval request sent", school });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
