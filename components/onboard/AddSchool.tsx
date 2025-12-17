'use client'
import { useState, useEffect } from 'react';
import { Upload, X, FileText, ArrowLeft, GraduationCap, Plus } from 'lucide-react';
import { School } from '@/types/index';
import AddSchoolForm from './AddSchoolForm';

export default function AddSchool() {
  const [schools, setSchools] = useState<School[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  // Handle FormData submission
  const handleAddSchool = async (formData: FormData) => {
    try {
      // Convert FormData to School object
      const schoolData: School = {
        id: Date.now().toString(),
        school_id: formData.get('school_id') as string,
        school_name: formData.get('school_name') as string,
        school_email: formData.get('school_email') as string,
        school_phone: formData.get('school_phone') as string,
        school_type: formData.get('school_type') as string,
        level: formData.get('level') as string,
        number_of_students: parseInt(formData.get('number_of_students') as string) || 0,
        number_of_teachers: parseInt(formData.get('number_of_teachers') as string) || 0,
        subscription: formData.get('subscription') as string,
        subscription_year: formData.get('subscription_year') as string,
        province: formData.get('province') as string,
        district: formData.get('district') as string,
        sector: formData.get('sector') as string,
        cell: formData.get('cell') as string,
        village: formData.get('village') as string,
        headmaster_name: formData.get('headmaster_name') as string,
        headmaster_email: formData.get('headmaster_email') as string,
        headmaster_phone: formData.get('headmaster_phone') as string,
        registration_certificate: formData.get('registration_certificate') as File | null,
        payment_proof: formData.get('payment_proof') as File | null,
        invoice: formData.get('invoice') as File | null,
        other_documents: formData.get('other_documents') as File | null,
        registration_date: new Date().toISOString(),
        status: 'DRAFT' as const
      };

      setSchools([...schools, schoolData]);
      setShowForm(false);
      setEditingSchool(null);
    } catch (error) {
      console.error('Error adding school:', error);
    }
  };

  const handleEditSchool = async (formData: FormData) => {
    if (!editingSchool) return;

    try {
      // Convert FormData to updated School object
      const updatedSchool: School = {
        ...editingSchool,
        school_id: formData.get('school_id') as string,
        school_name: formData.get('school_name') as string,
        school_email: formData.get('school_email') as string,
        school_phone: formData.get('school_phone') as string,
        school_type: formData.get('school_type') as string,
        level: formData.get('level') as string,
        number_of_students: parseInt(formData.get('number_of_students') as string) || 0,
        number_of_teachers: parseInt(formData.get('number_of_teachers') as string) || 0,
        subscription: formData.get('subscription') as string,
        subscription_year: formData.get('subscription_year') as string,
        province: formData.get('province') as string,
        district: formData.get('district') as string,
        sector: formData.get('sector') as string,
        cell: formData.get('cell') as string,
        village: formData.get('village') as string,
        headmaster_name: formData.get('headmaster_name') as string,
        headmaster_email: formData.get('headmaster_email') as string,
        headmaster_phone: formData.get('headmaster_phone') as string,
        // Only update files if new ones are provided
        registration_certificate: formData.get('registration_certificate') as File || editingSchool.registration_certificate,
        payment_proof: formData.get('payment_proof') as File || editingSchool.payment_proof,
        invoice: formData.get('invoice') as File || editingSchool.invoice,
        other_documents: formData.get('other_documents') as File || editingSchool.other_documents,
        isActive: editingSchool.isActive,
        activation_date: editingSchool.activation_date
      };

      setSchools(schools.map(s => s.id === editingSchool.id ? updatedSchool : s));
      setShowForm(false);
      setEditingSchool(null);
    } catch (error) {
      console.error('Error editing school:', error);
    }
  };

  const handleEdit = (school: School) => {
    setEditingSchool(school);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSchool(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {!showForm ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">School Management</h1>
                <p className="text-gray-600">Manage school registrations and information</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Add New School</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map(school => (
                <div key={school.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{school.school_name}</h3>
                        <span className="text-sm text-gray-500">{school.school_type}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {school.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📧 {school.school_email}</p>
                    <p>📍 {school.district}, {school.province}</p>
                    <p>👥 {school.number_of_students} students</p>
                  </div>
                  <button
                    onClick={() => handleEdit(school)}
                    className="w-full py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Edit School
                  </button>
                </div>
              ))}
            </div>

            {schools.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Schools Yet</h3>
                <p className="text-gray-600 mb-6">Get started by adding your first school</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Your First School</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <AddSchoolForm
            school={editingSchool}
            onSubmit={editingSchool ? handleEditSchool : handleAddSchool}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}