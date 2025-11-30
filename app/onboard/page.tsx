
'use client';

import Dashboard from '@/components/onboard/Dashboard';

export default function OnboardPage() {
  const handleLogout = () => {
    console.log('User logged out');
    // You can integrate your actual logout logic here
    // e.g., clearing cookies, redirecting, calling an API, etc.
  };

  return <Dashboard onLogout={handleLogout} />;
}
