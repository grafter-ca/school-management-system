import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalRequest(to: string, schoolName: string, schoolId: string) {
  try {
    const data = await resend.emails.send({
      from: "no-reply@school-system.com",
      to,
      subject: `Approval Request: ${schoolName}`,
      html: `
        <h2>New School Registration Pending Approval</h2>
        <p><b>School Name:</b> ${schoolName}</p>
        <p><b>School ID:</b> ${schoolId}</p>
        <p>Please login to the system to approve or reject this submission.</p>

        <a href="http://localhost:3000/dashboard/compliance" style="
          display: inline-block;
          padding: 10px 15px;>
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            ">Go to Compliance Dashboard</a>
            
      `,
    });
    console.log("Email sent via Resend:", data);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
