"use client"

import Dashboard from "@/components/onboard/Dashboard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OnboardPage() {
  const route = useRouter();
  const handleLogout = () => {
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;

    // Show toast
    toast("You have been successfully logged out.");

    // Redirect to login page
    route.push('/login')
  };

  return <Dashboard onLogout={handleLogout} />;
}
