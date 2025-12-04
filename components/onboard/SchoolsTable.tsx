'use client';

import { Edit, Eye, Trash2 } from 'lucide-react';
import { School } from '@/types';

interface SchoolsTableProps {
  schools: School[];
  onEdit: (school: School) => void;
  onViewSchool: (school: School) => void;
  onDelete?: (school: School) => void;
  userRole?: 'onboarding' | 'compliance';
}

export function SchoolsTable({ schools, onEdit, onViewSchool, onDelete, userRole = 'onboarding' }: SchoolsTableProps) {
  const canEdit = (school: School) => {
    if (userRole === 'compliance') return false;
    // Fixed: Changed 'REQUEST' to 'Draft' to match the status type
    return school.status === 'DRAFT' || school.status === 'REJECTED';
  };

  const canDelete = (school: School) => {
    if (userRole === 'compliance') return false;
    return school.status === 'DRAFT' || school.status === 'REJECTED';
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">School ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">School Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">District</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Students</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Registration Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {school.school_id || school.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onViewSchool(school)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {school.school_name}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {school.level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {school.district || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {school.number_of_students || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {school.registration_date ? new Date(school.registration_date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      school.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : school.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : school.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {school.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    {/* View Button */}
                    <button
                      onClick={() => onViewSchool(school)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit(school)}
                      disabled={!canEdit(school)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      title={canEdit(school) ? "Edit School" : "Cannot edit - Status must be Draft or REJECTED"}
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Delete Button (Optional) */}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(school)}
                        disabled={!canDelete(school)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        title={canDelete(school) ? "Delete School" : "Cannot delete - Status must be Draft or REJECTED"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {schools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No schools submitted yet.</p>
          <p className="text-gray-400 text-sm mt-2">Click "Add New School" to get started.</p>
        </div>
      )}
    </div>
  );
}