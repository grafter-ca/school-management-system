// lib/email.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (to: string, token: string) => {
  await resend.emails.send({
    from: "sandbox@resend.dev",
    to,
    subject: "Reset Your Password",
    html: `<p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}">here</a> to reset your password.</p>`,
  });
};
