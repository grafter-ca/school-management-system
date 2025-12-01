
'use client';

import ComplianceDashboard from '@/components/compliance/ComplianceDashboard';

export default function OnboardPage() {
  const handleLogout = () => {
    console.log('User logged out');
    // You can integrate your actual logout logic here
    // e.g., clearing cookies, redirecting, calling an API, etc.
  };

  return <ComplianceDashboard onLogout={handleLogout} />;
}
