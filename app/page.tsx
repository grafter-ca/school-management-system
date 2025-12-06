'use client';

import LoginForm from '@/components/login';
import { toast } from "sonner";

export default function LoginPage() {
  console.log("API URL", process.env.NEXT_PUBLIC_APP_URL);

  const handleForgotPassword = async () => {
    toast("Forgot password clicked. Feature coming soon!");
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    console.log('Logging in:', email, password);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok && !data.error) {
        toast(`Login successful! Welcome back, ${data.user.name}.`);

        // Redirect based on sms_role
        if (data.user.sms_role === "ONBOARDING") {
          window.location.href = "/onboard";
        } else if (data.user.sms_role === "COMPLIANCE") {
          window.location.href = "/compliance";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        toast(`Login failed: ${data.error || "Invalid email or password"}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      toast("Network error. Please try again later.");
    }
  };

  return (
    <LoginForm
    />
  );
}
