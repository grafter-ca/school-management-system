'use client';

import { useState } from 'react';
import  Navbar  from '@/components/onboard/Navbar';
import { SchoolsTable } from '@/components/onboard/SchoolsTable';
import { ComplianceViewModal } from '@/components/compliance/ComplianceViewModel';
import { School } from '@/types';

interface ComplianceDashboardProps {
  onLogout: () => void;
}

export default function ComplianceDashboard({ onLogout }: ComplianceDashboardProps) {
  // In a real app, this would come from a shared data source
  const [schools, setSchools] = useState<School[]>([
    {
      id: 'SCH-P-2025-1001',
      schoolName: 'ABC School',
      schoolEmail: 'info@abcschool.edu',
      type: 'Public',
      schoolPhone: '+250788123456',
      level: 'Primary',
      numberOfStudents: 500,
      subscription: 'Standard',
      region: 'Kigali City',
      district: 'Gasabo',
      sector: 'Bumbogo',
      cell: 'Gifata',
      village: 'Kajevuba',
      headmasterName: 'John Doe',
      headmasterEmail: 'john.doe@abcschool.edu',
      headmasterPhone: '+250788111222',
      registrationCertificate: null,
      paymentProof: null,
      registrationDate: '2025-01-15',
      status: 'Pending Approval',
    },
    {
      id: 'SCH-S-2025-2045',
      schoolName: 'XYZ School',
      schoolEmail: 'contact@xyzschool.edu',
      type: 'Public',
      schoolPhone: '+250788654321',
      level: 'Secondary',
      numberOfStudents: 750,
      subscription: 'Premium',
      region: 'Eastern Province',
      district: 'Kayonza',
      sector: 'Gahini',
      cell: 'Kahi',
      village: 'Gahini',
      headmasterName: 'Jane Smith',
      headmasterEmail: 'jane.smith@xyzschool.edu',
      headmasterPhone: '+250788333444',
      registrationCertificate: null,
      paymentProof: null,
      registrationDate: '2025-01-20',
      status: 'Approved',
    },
    {
      id: 'SCH-N-2025-3567',
      schoolName: 'Little Stars Nursery',
      schoolEmail: 'info@littlestars.edu',
      type: 'Public',
      schoolPhone: '+250788987654',
      level: 'Nursery',
      numberOfStudents: 120,
      subscription: 'Basic',
      region: 'Southern Province',
      district: 'Huye',
      sector: 'Ngoma',
      cell: 'Cyarwa',
      village: 'Matyazo',
      headmasterName: 'Marie Uwase',
      headmasterEmail: 'marie@littlestars.edu',
      headmasterPhone: '+250788555666',
      registrationCertificate: null,
      paymentProof: null,
      registrationDate: '2025-01-18',
      status: 'Pending Approval',
    },
  ]);

  const [viewingSchool, setViewingSchool] = useState<School | null>(null);

  const handleApprove = (schoolId: string) => {
    setSchools(
      schools.map((s) =>
        s.id === schoolId ? { ...s, status: 'Approved' as const, rejectionReason: undefined } : s
      )
    );
  };

  const handleReject = (schoolId: string, reason: string) => {
    setSchools(
      schools.map((s) =>
        s.id === schoolId ? { ...s, status: 'Rejected' as const, rejectionReason: reason } : s
      )
    );
  };

  const handleViewSchool = (school: School) => {
    setViewingSchool(school);
  };

  const pendingCount = schools.filter(s => s.status === 'Pending Approval').length;

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