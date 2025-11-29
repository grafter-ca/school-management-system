import { SchoolTableProps } from '@/types';
import { Edit, Eye, Send } from 'lucide-react';

interface SchoolsTableProps {
  schools: SchoolTableProps[];
  onEdit: (school: SchoolTableProps) => void;
  onRequestApproval: (schoolId: string) => void;
}

export default function SchoolsTable({ schools = [], onEdit, onRequestApproval }: SchoolsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">All Schools Submitted</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">School ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">School Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">District</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Students</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subscription Year</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{school.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{school.schoolName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{school.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{school.district}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{school.numberOfStudents}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{school.subscriptionYear}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      school.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : school.status === 'Pending Approval'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {school.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {school.status === 'Approved' ? (
                      <button
                        onClick={() => onEdit(school)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit(school)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRequestApproval(school.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Request Approval"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </>
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
          <p className="text-gray-500">No schools submitted yet.</p>
        </div>
      )}
    </div>
  );
}