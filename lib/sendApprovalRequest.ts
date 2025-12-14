import { Resend } from "resend";

// Safe initialization: does NOT break build if the API key is missing
const apiKey = process.env.RESEND_API_KEY;

// If no API key, we avoid calling Resend()
const resend = apiKey ? new Resend(apiKey) : null;

export async function sendApprovalRequest(
  schoolName: string,
  schoolId: string
) {
  // If there is NO Resend key → skip email but do not crash the app
  if (!resend) {
    console.warn("⚠ RESEND_API_KEY is missing — email NOT sent, but build continues.");
    return {
      success: false,
      message: "Email skipped (no API key provided)."
    };
  }

  // Send email via Resend
    const complianceEmail = process.env.COMPLIENCE_EMAIL || "caleb.designer1@gmail.com";

  try {
    const data = await resend.emails.send({
      from: "sandbox@resend.dev",
      to:complianceEmail,
      subject: `Approval Request: ${schoolName}`,
      html: `
        <h2>New School Registration Pending Approval</h2>
        <p><b>School Name:</b> ${schoolName}</p>
        <p><b>School ID:</b> ${schoolId}</p>
        <p>Please login to the system to approve or reject this submission.</p>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/compliance" 
          style="
            display: inline-block;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          ">
          Go to Compliance Dashboard
        </a>
      `,
    });

    console.log("Email sent via Resend:", data);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
