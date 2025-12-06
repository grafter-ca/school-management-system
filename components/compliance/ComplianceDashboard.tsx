'use client';

import { useEffect, useState } from 'react';
import  Navbar  from '@/components/compliance/Navbar';
import { SchoolsTable } from '@/components/onboard/SchoolsTable';
import { ComplianceViewModal } from '@/components/compliance/ComplianceViewModel';
import { School } from '@/types';

interface ComplianceDashboardProps {
  onLogout: () => void;
}

export default function ComplianceDashboard({ onLogout }: ComplianceDashboardProps) {
 
  const [schools, setSchools] = useState<School[]>([]);

  const [viewingSchool, setViewingSchool] = useState<School | null>(null);

  const fetchPendingSchools = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/schools?status=PENDING`);
      const data = await res.json();
      setSchools(data);
    } catch (error) {
      console.error("Error fetching pending schools:", error);
    }
  };

  useEffect(() => {
    fetchPendingSchools();
  }, []);

  const handleApprove = async(schoolId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/schools/${schoolId}/status`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({status: "APPROVED"}),
    });
    fetchPendingSchools();
  };

  const handleReject = async (schoolId: string, reason: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/schools/${schoolId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED", rejectionReason: reason }),
    });
    fetchPendingSchools();
  };

  const handleViewSchool = (school: School) => {
    setViewingSchool(school);
  };

  const pendingCount = schools.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Compliance Review</h1>
          <p className="text-gray-600">Review and approve school submissions</p>
          {pendingCount > 0 && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <span className="mr-2">⚠️</span>
              {pendingCount} school{pendingCount > 1 ? 's' : ''} pending approval
            </div>
          )}
        </div>
        
        <SchoolsTable
          schools={schools}
          onEdit={() => {}} // Compliance officer cannot edit
          onViewSchool={handleViewSchool}
          userRole="compliance"
        />
      </main>

      {viewingSchool && (
        <ComplianceViewModal
          school={viewingSchool}
          onClose={() => setViewingSchool(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}