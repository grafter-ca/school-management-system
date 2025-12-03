import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "School ID is required" },
        { status: 400 }
      );
    }

    // -----------------------------------
    // 1. Fetch school details
    // -----------------------------------
    const { rows } = await pool.query(
      `SELECT * FROM "School" WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    const school = rows[0];

    // -----------------------------------
    // 2. REQUIRED fields for compliance
    // -----------------------------------
    const requiredFields = [
      "schoolname",
      "email",
      "phone",
      "level",
      "sector",
      "district",
      "province",
      "schoollogo",
      "document_license",
      "document_schoolpermit",
      "document_headteacherid",
    ];

    const missingFields = requiredFields.filter(
      (field) => !school[field] || school[field] === ""
    );

    // -----------------------------------
    // 3. If missing fields → reject
    // -----------------------------------
    if (missingFields.length > 0) {
      const message =
        "Missing required fields: " + missingFields.join(", ");

      await pool.query(
        `UPDATE "School" 
         SET status = $1, rejectMessage = $2 
         WHERE id = $3`,
        ["Rejected", message, id]
      );

      return NextResponse.json({
        status: "Rejected",
        reason: message,
      });
    }
    // -----------------------------------
    // 4. Approve school
    // -----------------------------------
    await pool.query(
      `UPDATE "School" 
       SET status = 'Approved', rejectMessage = NULL 
       WHERE id = $1`,
      [id]
    );

    return NextResponse.json({
      status: "Approved",
      message: "School successfully approved by compliance team",
    });

  } catch (error) {
    console.error("Compliance Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
