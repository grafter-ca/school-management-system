'use client';

import { School } from '@/types';
import { X, MapPin, User, Phone, Mail, Calendar, FileText, CheckCircle } from 'lucide-react';

interface AdminViewSchoolModalProps {
  school: School;
  onClose: () => void;
}

export function AdminViewSchoolModal({ school, onClose }: AdminViewSchoolModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-white mb-1">{school.school_name}</h2>
            <p className="text-blue-100">School ID: {school.id}</p>
          </div>
          <button aria-label='close'
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center space-x-4">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full ${
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
            {school.isActive && (
              <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>Active</span>
              </span>
            )}
          </div>

          {/* School Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-gray-900 mb-4">School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="text-gray-900">{school.school_email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="text-gray-900">{school.school_phone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-600">Level</p>
                  <p className="text-gray-900">{school.level}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-600">Number of Students</p>
                  <p className="text-gray-900">{school.number_of_students}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-600">Subscription Plan</p>
                  <p className="text-gray-900">{school.subscription}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-600">Registration Date</p>
                  <p className="text-gray-900">{new Date(school.registration_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-gray-900 mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Region</p>
                <p className="text-gray-900">{school.province}</p>
              </div>
              <div>
                <p className="text-gray-600">District</p>
                <p className="text-gray-900">{school.district}</p>
              </div>
              <div>
                <p className="text-gray-600">Sector</p>
                <p className="text-gray-900">{school.sector}</p>
              </div>
              <div>
                <p className="text-gray-600">Cell</p>
                <p className="text-gray-900">{school.cell}</p>
              </div>
              <div>
                <p className="text-gray-600">Village</p>
                <p className="text-gray-900">{school.village}</p>
              </div>
            </div>
          </div>

          {/* Headmaster Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Headmaster Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="text-gray-900">{school.headmaster_name}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="text-gray-900">{school.headmaster_email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="text-gray-900">{school.headmaster_phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activation Information */}
          {school.isActive && school.activation_date && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-gray-900 mb-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Activation Information</span>
              </h3>
              <div>
                <p className="text-gray-600">Activation Date</p>
                <p className="text-gray-900">{new Date(school.activation_date).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {school.status === 'REJECTED' && school.rejection_reason && (
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="text-gray-900 mb-2">Rejection Reason</h3>
              <p className="text-gray-700">{school.rejection_reason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
