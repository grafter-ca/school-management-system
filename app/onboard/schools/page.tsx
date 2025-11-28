'use client'
import { useState, useEffect } from 'react';
import { Upload, X, FileText, ArrowLeft, GraduationCap, Plus } from 'lucide-react';
import { SchoolProps } from '@/types';


export default function App() {
  const [schools, setSchools] = useState<SchoolProps[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolProps | null>(null);

  const handleAddSchool = (schoolData: Omit<SchoolProps, 'id' | 'status'>) => {
    const newSchool: SchoolProps = {
      ...schoolData,
      id: Date.now().toString(),
      status: 'Pending'
    };
    setSchools([...schools, newSchool]);
    setShowForm(false);
    setEditingSchool(null);
  };

  const handleEditSchool = (schoolData: Omit<SchoolProps, 'id' | 'status'>) => {
    if (editingSchool) {
      setSchools(schools.map(s => 
        s.id === editingSchool.id 
          ? { ...schoolData, id: s.id, status: s.status }
          : s
      ));
      setShowForm(false);
      setEditingSchool(null);
    }
  };

  const handleEdit = (school: SchoolProps) => {
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
                        <h3 className="font-semibold text-gray-900">{school.schoolName}</h3>
                        <span className="text-sm text-gray-500">{school.type}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {school.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📧 {school.schoolEmail}</p>
                    <p>📍 {school.district}, {school.province}</p>
                    <p>👥 {school.numberOfStudents} students</p>
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

interface AddSchoolFormProps {
  school?: SchoolProps | null;
  onSubmit: (school: Omit<SchoolProps, 'id' | 'status'>) => void;
  onCancel: () => void;
}

function AddSchoolForm({ school, onSubmit, onCancel }: AddSchoolFormProps) {
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolEmail: '',
    schoolPhone: '',
    schoolAddress: '',
    type: 'Primary',
    district: '',
    province: '',
    numberOfStudents: 0,
    numberOfTeachers: 0,
    subscriptionYear: currentYear,
    registrationCertificate: null as File | null,
    schoolLicense: null as File | null,
    otherDocuments: null as File | null,
    invoice: null as File | null,
  });

  useEffect(() => {
    if (school) {
      setFormData({
        schoolName: school.schoolName,
        schoolEmail: school.schoolEmail,
        schoolPhone: school.schoolPhone,
        schoolAddress: school.schoolAddress,
        type: school.type,
        district: school.district,
        province: school.province,
        numberOfStudents: school.numberOfStudents,
        numberOfTeachers: school.numberOfTeachers,
        subscriptionYear: school.subscriptionYear,
        registrationCertificate: school.registrationCertificate,
        schoolLicense: school.schoolLicense,
        otherDocuments: school.otherDocuments,
        invoice: school.invoice,
      });
    }
  }, [school]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
          aria-label='cancer'
            onClick={onCancel}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {school ? 'Edit School' : 'Add New School'}
          </h2>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name *
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter school name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Email *
                </label>
                <input
                  type="email"
                  value={formData.schoolEmail}
                  onChange={(e) => handleInputChange('schoolEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="school@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Phone *
                </label>
                <input
                  type="tel"
                  value={formData.schoolPhone}
                  onChange={(e) => handleInputChange('schoolPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select aria-label='select school'
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="TVET">TVET</option>
                  <option value="Combined">Combined</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Address *
                </label>
                <textarea
                  value={formData.schoolAddress}
                  onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter complete school address"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter district"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province *
                </label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter province"
                />
              </div>
            </div>
          </div>

          {/* School Statistics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">School Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Students *
                </label>
                <input
                  type="number"
                  value={formData.numberOfStudents}
                  onChange={(e) => handleInputChange('numberOfStudents', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Teachers *
                </label>
                <input
                  type="number"
                  value={formData.numberOfTeachers}
                  onChange={(e) => handleInputChange('numberOfTeachers', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Year *
                </label>
                <input
                  type="number"
                  value={formData.subscriptionYear}
                  onChange={(e) => handleInputChange('subscriptionYear', parseInt(e.target.value) || currentYear)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder={currentYear.toString()}
                  min="2020"
                  max="2100"
                />
              </div>
            </div>
          </div>

          {/* Legal Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                label="School Registration Certificate"
                file={formData.registrationCertificate}
                onChange={(file) => handleFileChange('registrationCertificate', file)}
              />
              <FileUpload
                label="School License"
                file={formData.schoolLicense}
                onChange={(file) => handleFileChange('schoolLicense', file)}
              />
              <FileUpload
                label="Other Legal Documents"
                file={formData.otherDocuments}
                onChange={(file) => handleFileChange('otherDocuments', file)}
              />
            </div>
          </div>

          {/* Invoice Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                label="Subscription Invoice"
                file={formData.invoice}
                onChange={(file) => handleFileChange('invoice', file)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              {school ? 'Update School' : 'Add School'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FileUploadProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}

function FileUpload({ label, file, onChange }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onChange(selectedFile);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {file ? (
        <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <button 
          aria-label='remove'
            type="button"
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">Click to upload PDF</p>
          <p className="text-xs text-gray-400">or drag and drop</p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}