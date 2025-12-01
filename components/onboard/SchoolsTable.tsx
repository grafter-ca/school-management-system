'use client';

import { Edit } from 'lucide-react';
import { School } from '@/types';

interface SchoolsTableProps {
  schools: School[];
  onEdit: (school: School) => void;
  onViewSchool: (school: School) => void;
  userRole?: 'onboarding' | 'compliance';
}

export function SchoolsTable({ schools, onEdit, onViewSchool, userRole = 'onboarding' }: SchoolsTableProps) {
  const canEdit = (school: School) => {
    if (userRole === 'compliance') return false;
    return school.status === 'Draft' || school.status === 'Rejected';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-gray-900">All Schools Submitted</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">School ID</th>
              <th className="px-6 py-3 text-left text-gray-700">School Name</th>
              <th className="px-6 py-3 text-left text-gray-700">Level</th>
              <th className="px-6 py-3 text-left text-gray-700">District</th>
              <th className="px-6 py-3 text-left text-gray-700">Students</th>
              <th className="px-6 py-3 text-left text-gray-700">Registration Date</th>
              <th className="px-6 py-3 text-left text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-900">{school.id}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewSchool(school)}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {school.schoolName}
                  </button>
                </td>
                <td className="px-6 py-4 text-gray-600">{school.level}</td>
                <td className="px-6 py-4 text-gray-600">{school.district}</td>
                <td className="px-6 py-4 text-gray-600">{school.numberOfStudents}</td>
                <td className="px-6 py-4 text-gray-600">{school.registrationDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full ${
                      school.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : school.status === 'Pending Approval'
                        ? 'bg-yellow-100 text-yellow-800'
                        : school.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {school.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onEdit(school)}
                    disabled={!canEdit(school)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {schools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No schools submitted yet.</p>
        </div>
      )}
    </div>
  );
}
