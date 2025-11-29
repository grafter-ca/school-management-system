'use client';

import { useState } from 'react';
import Navbar from '@/components/onboard/Navbar';
import SchoolsTable from '@/components/onboard/SchoolsTable';
import AddSchoolForm from '@/components/onboard/AddSchoolForm';
import { SchoolTableProps } from '@/types';

// In a real Next.js project, this would be in: /components/Dashboard.tsx or /app/dashboard/page.tsx

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [schools, setSchools] = useState<SchoolTableProps[]>([
    {
      id: 'AUTO-001',
      schoolName: 'ABC School',
      schoolEmail: 'info@abcschool.edu',
      schoolPhone: '+1234567890',
      schoolAddress: '123 Education Street, Knowledge City',
      type: 'Primary',
      district: 'Central District',
      province: 'Province A',
      numberOfStudents: 500,
      numberOfTeachers: 30,
      subscriptionYear: 2025,
      registrationCertificate: null,
      schoolLicense: null,
      otherDocuments: null,
      invoice: null,
      status: 'Pending Approval',
    },
    {
      id: 'AUTO-002',
      schoolName: 'XYZ School',
      schoolEmail: 'contact@xyzschool.edu',
      schoolPhone: '+1234567891',
      schoolAddress: '456 Learning Avenue, Education Town',
      type: 'Secondary',
      district: 'North District',
      province: 'Province B',
      numberOfStudents: 750,
      numberOfTeachers: 45,
      subscriptionYear: 2025,
      registrationCertificate: null,
      schoolLicense: null,
      otherDocuments: null,
      invoice: null,
      status: 'Approved',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolTableProps | null>(null);

  const handleAddSchool = (school: Omit<SchoolTableProps, 'id' | 'status'>) => {
    const newSchool: SchoolTableProps = {
      ...school,
      id: `AUTO-${String(schools.length + 1).padStart(3, '0')}`,
      status: 'Pending Approval',
    };
    setSchools([...schools, newSchool]);
    setShowAddForm(false);
  };

  const handleEditSchool = (school: SchoolTableProps) => {
    setEditingSchool(school);
    setShowAddForm(true);
  };

  const handleUpdateSchool = (updatedSchool: Omit<SchoolTableProps, 'id' | 'status'>) => {
    if (editingSchool) {
      setSchools(
        schools.map((s) =>
          s.id === editingSchool.id
            ? { ...updatedSchool, id: editingSchool.id, status: editingSchool.status }
            : s
        )
      );
      setEditingSchool(null);
      setShowAddForm(false);
    }
  };

  const handleRequestApproval = (schoolId: string) => {
    setSchools(
      schools.map((s) =>
        s.id === schoolId ? { ...s, status: 'Pending Approval' } : s
      )
    );
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingSchool(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showAddForm ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Schools Management</h1>
                <p className="text-gray-600">Manage all school submissions and subscriptions</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Add New School
              </button>
            </div>
            
            <SchoolsTable
              schools={schools}
              onEdit={handleEditSchool}
              onRequestApproval={handleRequestApproval}
            />
          </>
        ) : (
          <AddSchoolForm
            school={editingSchool}
            onSubmit={editingSchool ? handleUpdateSchool : handleAddSchool}
            onCancel={handleCancelForm}
          />
        )}
      </main>
    </div>
  );
}