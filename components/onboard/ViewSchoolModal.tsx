'use client';

import { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { School } from '@/types';

interface ViewSchoolModalProps {
  school: School;
  onClose: () => void;
  onRequestApproval?: (schoolId: string) => void;
  userRole: 'onboarding' | 'compliance';
}

export function ViewSchoolModal({ school, onClose, onRequestApproval, userRole }: ViewSchoolModalProps) {
  const [agreed, setAgreed] = useState(false);

  const handleRequestApproval = () => {
    if (agreed && onRequestApproval) {
      onRequestApproval(school.id);
      onClose();
    }
  };

  const canRequestApproval = userRole === 'onboarding' && (school.status === 'Draft' || school.status === 'Rejected');

  return (
    <div className="fixed inset-0 bg-white bg-transparent-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between z-10">
          <h2 className="text-gray-900">School Information</h2>
          <button aria-label='close'
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-8">
            {/* Part 1: School Information */}
            <div>
              <h3 className="text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">Part 1: School Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="School Name" value={school.schoolName} />
                <InfoField label="Email" value={school.schoolEmail} />
                <InfoField label="Phone Number" value={school.schoolPhone} />
                <InfoField label="Level" value={school.level} />
                <InfoField label="Number of Students" value={school.numberOfStudents?.toString() ?? '0'} />
                <InfoField label="Subscription" value={school.subscription} />
                <InfoField label="Region" value={school.region} />
                <InfoField label="District" value={school.district ?? 'N/A'} />
                <InfoField label="Sector" value={school.sector} />
                <InfoField label="Cell" value={school.cell} />
                <InfoField label="Village" value={school.village} />
                <InfoField label="Registration Date" value={school.registrationDate} />
              </div>
            </div>

            {/* Part 2: Headmaster Information */}
            <div>
              <h3 className="text-gray-900 mb-4 pb-2 border-b-2 border-green-500">Part 2: Headmaster Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Full Name" value={school.headmasterName} />
                <InfoField label="Email" value={school.headmasterEmail} />
                <InfoField label="Phone Number" value={school.headmasterPhone} />
              </div>
            </div>

            {/* Part 3: Documents */}
            <div>
              <h3 className="text-gray-900 mb-4 pb-2 border-b-2 border-purple-500">Part 3: Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentField label="School Registration Certificate" file={school.registrationCertificate} />
                <DocumentField label="Payment Proof" file={school.paymentProof} />
              </div>
            </div>

            {/* Status Information */}
            <div>
              <h3 className="text-gray-900 mb-4 pb-2 border-b-2 border-orange-500">Status Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Status" value={school.status} />
                {school.rejectionReason && (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Rejection Reason</label>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{school.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Approval Section - Only for Onboarding Officer */}
            {canRequestApproval && (
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer mt-0.5"
                    />
                    <span className="ml-3 text-gray-900">
                      I confirm that I have verified all the school information and documents are correct and complete. I understand that this school will be sent to the Compliance Officer for final approval.
                    </span>
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleRequestApproval}
                    disabled={!agreed}
                    className="px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Request Approval
                  </button>
                </div>
              </div>
            )}

            {/* Pending Approval Message */}
            {school.status === 'Pending Approval' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  This school is currently pending approval from the Compliance Officer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoFieldProps {
  label: string;
  value: string;
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-900">{value}</p>
      </div>
    </div>
  );
}

interface DocumentFieldProps {
  label: string;
  file: File | null;
}

function DocumentField({ label, file }: DocumentFieldProps) {
  return (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      {file ? (
        <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-900">{file.name}</p>
            <p className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
          <p className="text-gray-500">No file uploaded</p>
        </div>
      )}
    </div>
  );
}
