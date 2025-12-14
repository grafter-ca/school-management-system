import { Resend } from "resend";

// Safe initialization
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Sends an approval request email
 */
export async function sendApprovalRequest(
  schoolName: string,
  schoolId: string
) {
  // If no API key, skip email but do NOT crash
  if (!resend) {
    console.warn("⚠ RESEND_API_KEY missing — email NOT sent.");
    return {
      success: false,
      message: "Email skipped due to missing API key.",
    };
  }

  // If user has verified a custom domain → use it
  const verifiedSender = process.env.RESEND_FROM_EMAIL || "sandbox@resend.dev";

  try {
    const data = await resend.emails.send({
      from: verifiedSender,
      to,
      subject: `Approval Request for ${schoolName}`,
      html: `
        <h2>New School Registration Pending Approval</h2>

        <p>A new school has submitted a registration request.</p>

        <p><b>School Name:</b> ${schoolName}</p>
        <p><b>School ID:</b> ${schoolId}</p>

        <p>Please log in to review the submission:</p>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/compliance"
          style="
            display: inline-block;
            padding: 10px 16px;
            background-color: #0066ff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Open Compliance Dashboard
        </a>

        <br/><br/>
        <p>If you did not expect this email, please ignore it.</p>
      `,
    });

    console.log("📧 Email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return { success: false, error };
  }
}
