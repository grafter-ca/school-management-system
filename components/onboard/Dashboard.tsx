'use client';

import { useState } from 'react';
import  Navbar  from './Navbar';
import { SchoolsTable } from './SchoolsTable';
import  AddSchoolForm  from './AddSchoolForm';
import { ViewSchoolModal } from '@/components/onboard/ViewSchoolModal';
import { School } from '@/types';
import { generateSchoolId } from '@/utils/schoolId';
import { Search, Filter } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [schools, setSchools] = useState<School[]>([
    {
      id: 'SCH-P-2025-1001',
      schoolName: 'ABC School',
      type: 'Public',
      schoolEmail: 'info@abcschool.edu',
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
      status: 'Draft',
    },
    {
      id: 'SCH-S-2025-2045',
      schoolName: 'XYZ School',
      type: 'Public',
      schoolEmail: 'contact@xyzschool.edu',
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
      type: 'Public',
      schoolEmail: 'info@littlestars.edu',
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
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);
  
  // Filter and Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const handleAddSchool = (school: Omit<School, 'id' | 'status' | 'registrationDate'>) => {
    const registrationYear = new Date().getFullYear();
    const existingIds = schools.map(s => s.id);
    const schoolId = generateSchoolId(school.level, registrationYear, existingIds);
    
    const newSchool: School = {
      ...school,
      id: schoolId,
      status: 'Draft',
      registrationDate: new Date().toISOString().split('T')[0],
    };
    setSchools([...schools, newSchool]);
    setShowAddForm(false);
  };

  const handleEditSchool = (school: School) => {
    const canEdit = school.status === 'Draft' || school.status === 'Rejected';
    if (canEdit) {
      setEditingSchool(school);
      setShowAddForm(true);
    }
  };

  const handleUpdateSchool = (updatedSchool: Omit<School, 'id' | 'status' | 'registrationDate'>) => {
    if (editingSchool) {
      setSchools(
        schools.map((s) =>
          s.id === editingSchool.id
            ? { 
                ...updatedSchool, 
                id: editingSchool.id, 
                status: 'Draft',
                registrationDate: editingSchool.registrationDate
              }
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
        s.id === schoolId ? { ...s, status: 'Pending Approval' as const } : s
      )
    );
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingSchool(null);
  };

  const handleViewSchool = (school: School) => {
    setViewingSchool(school);
  };

  // Filter and Search logic
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !filterLevel || school.level === filterLevel;
    const matchesStatus = !filterStatus || school.status === filterStatus;
    
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterLevel('');
    setFilterStatus('');
  };

  const hasActiveFilters = searchTerm || filterLevel || filterStatus;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showAddForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-gray-900 mb-2">Schools Management</h1>
                <p className="text-gray-600">Manage all school submissions and subscriptions</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Add New School
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by school name..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Filter Toggle Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-6 py-3 border rounded-lg transition-colors ${
                    showFilters ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {[searchTerm, filterLevel, filterStatus].filter(Boolean).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Filter by Level</label>
                      <select aria-label='filter'
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                      <select aria-label='status'
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Pending Approval">Pending Approval</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
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

              {/* Results Count */}
              {hasActiveFilters && (
                <div className="mt-4 text-gray-600">
                  Showing {filteredSchools.length} of {schools.length} school{schools.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            <SchoolsTable
              schools={filteredSchools}
              onEdit={handleEditSchool}
              onViewSchool={handleViewSchool}
              userRole="onboarding"
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

      {viewingSchool && (
        <ViewSchoolModal
          school={viewingSchool}
          onClose={() => setViewingSchool(null)}
          onRequestApproval={handleRequestApproval}
          userRole="onboarding"
        />
      )}
    </div>
  );
}
