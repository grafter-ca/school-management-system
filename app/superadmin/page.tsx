
'use client';

import { SuperAdminDashboard } from "@/components/superadmin/SuperAdminDashboard";

export default function OnboardPage() {
  const handleLogout = () => {
    console.log('User logged out');
    // You can integrate your actual logout logic here
    // e.g., clearing cookies, redirecting, calling an API, etc.
  };

  return <SuperAdminDashboard onLogout={handleLogout} />;
}