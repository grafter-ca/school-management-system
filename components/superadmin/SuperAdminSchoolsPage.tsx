'use client';

import { useState } from 'react';
import { School } from '@/types';
import { Download, Eye, Search, Filter, Lock } from 'lucide-react';
import { AdminViewSchoolModal } from '../admin/AdminViewSchoolModal';

export function SuperAdminSchoolsPage() {
  const [schools] = useState<School[]>([
    {
      id: 'SCH-P-2025-1001',
      school_name: 'ABC School',
      school_email: 'info@abcschool.edu',
      school_phone: '+250788123456',
      school_type: 'string',
      level: 'Primary',
      number_of_students: 500,
      subscription: 'Standard',
      province: 'Kigali City',
      district: 'Gasabo',
      sector: 'Bumbogo',
      cell: 'Gifata',
      village: 'Kajevuba',
      headmaster_name: 'John Doe',
      headmaster_email: 'john.doe@abcschool.edu',
      headmaster_phone: '+250788111222',
      registration_certificate: null,
      payment_proof: null,
      registration_date: '2025-01-15',
      status: 'APPROVED',
      isActive: false,
      activation_date: '2025-09-12'
    },
    {
      id: 'SCH-S-2025-2045',
      school_name: 'XYZ School',
      school_email: 'contact@xyzschool.edu',
      school_phone: '+250788654321',
      school_type: 'string',
      level: 'Secondary',
      number_of_students: 750,
      subscription: 'Premium',
      province: 'Eastern Province',
      district: 'Kayonza',
      sector: 'Gahini',
      cell: 'Kahi',
      village: 'Gahini',
      headmaster_name: 'Jane Smith',
      headmaster_email: 'jane.smith@xyzschool.edu',
      headmaster_phone: '+250788333444',
      registration_certificate: null,
      payment_proof: null,
      registration_date: '2025-01-20',
      status: 'APPROVED',
      isActive: true,
      activation_date: '2025-01-22',
    },
    {
      id: 'SCH-N-2025-3567',
      school_name: 'Little Stars Nursery',
      school_email: 'info@littlestars.edu',
      school_phone: '+250788987654',
      school_type: 'string',
      level: 'Nursery',
      number_of_students: 120,
      subscription: 'Basic',
      province: 'Southern Province',
      district: 'Huye',
      sector: 'Ngoma',
      cell: 'Cyarwa',
      village: 'Matyazo',
      headmaster_name: 'Marie Uwase',
      headmaster_email: 'marie@littlestars.edu',
      headmaster_phone: '+250788555666',
      registration_certificate: null,
      payment_proof: null,
      registration_date: '2025-01-18',
      status: 'APPROVED',
      isActive: true,
      activation_date: '2025-01-19',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);

  // Filter schools
  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !filterLevel || school.level === filterLevel;
    const matchesStatus = !filterStatus || 
      (filterStatus === 'Active' ? school.isActive : !school.isActive);
    
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleDownloadExcel = () => {
    // Create CSV content
    const headers = ['School ID', 'School Name', 'Level', 'District', 'Headmaster Name', 'Headmaster Phone', 'Status'];
    const rows = filteredSchools.map(school => [
      school.id,
      school.school_name,
      school.level,
      school.district,
      school.headmaster_name,
      school.headmaster_phone,
      school.isActive ? 'Active' : 'Inactive'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schools_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterLevel('');
    setFilterStatus('');
  };

  const hasActiveFilters = searchTerm || filterLevel || filterStatus;

  return (
    <div className="p-6 space-y-6">
      {/* Read-Only Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-purple-800">
          <Lock className="w-5 h-5" />
          <p>
            You are viewing this page in <strong>read-only mode</strong>. Super Admins cannot activate schools or make modifications.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">Schools Management</h2>
          <p className="text-gray-600">View all registered schools</p>
        </div>
        <button
          onClick={handleDownloadExcel}
          className="flex items-center space-x-2 bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5" />
          <span>Download Excel</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by school name or ID..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-6 py-3 border rounded-lg transition-colors ${
              showFilters ? 'bg-purple-50 border-purple-500 text-purple-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                {[searchTerm, filterLevel, filterStatus].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Filter by Level</label>
                <select aria-label='select level'
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">All Levels</option>
                  <option value="Nursery">Nursery</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="TVET">TVET</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Filter by Status</label>
                <select aria-label='activate'
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="mt-4 text-gray-600">
            Showing {filteredSchools.length} of {schools.length} school{schools.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">School ID</th>
                <th className="px-6 py-3 text-left text-gray-700">School Name</th>
                <th className="px-6 py-3 text-left text-gray-700">Level</th>
                <th className="px-6 py-3 text-left text-gray-700">District</th>
                <th className="px-6 py-3 text-left text-gray-700">Headmaster Name</th>
                <th className="px-6 py-3 text-left text-gray-700">Headmaster Phone</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{school.id}</td>
                  <td className="px-6 py-4 text-gray-900">{school.school_name}</td>
                  <td className="px-6 py-4 text-gray-600">{school.level}</td>
                  <td className="px-6 py-4 text-gray-600">{school.district}</td>
                  <td className="px-6 py-4 text-gray-600">{school.headmaster_name}</td>
                  <td className="px-6 py-4 text-gray-600">{school.headmaster_phone}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full ${
                        school.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {school.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setViewingSchool(school)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No schools found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewingSchool && (
        <AdminViewSchoolModal
          school={viewingSchool}
          onClose={() => setViewingSchool(null)}
        />
      )}
    </div>
  );
}
