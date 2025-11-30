// lib/emailVerification.ts
import { resend } from "./resend.config"; 
import { signToken } from "./jwt";

const VERIFICATION_EXPIRY = "1d";

export async function sendVerificationEmail(name: string, email: string, userId: string) {
  try {
    // Generate verification token
    const token = signToken({ id: userId }, VERIFICATION_EXPIRY);

    // Verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/users/verify?token=${token}`;

    // Send email via Resend
    const data = await resend.emails.send({
      from: "callebhabyar55@gmail.com",
      to: email,
      subject: "Verify Your Account",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationUrl}" style="
          display:inline-block;
          padding:10px 15px;
          background-color:#4CAF50;
          color:white;
          text-decoration:none;
          border-radius:5px;
        ">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    console.log("Verification email sent:", data);
    return data;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}
