'use client';

import { useState } from 'react';
import { X, FileText, Download } from 'lucide-react';
import { School } from '@/types';

interface ViewSchoolModalProps {
  school: School;
  onClose: () => void;
  onRequestApproval?: (schoolId: string) => void;
  userRole: 'onboarding' | 'compliance';
}

export function ViewSchoolModal({ school, onClose, onRequestApproval, userRole }: ViewSchoolModalProps) {
  const [agreed, setAgreed] = useState(false);

 const handleRequestApproval = async () => {
  if (!agreed || !onRequestApproval) return;

  try {
    const schoolId = school.school_id || school.id;

    const res = await fetch('/api/schools/request-approval', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ schoolId }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Failed to request approval:', error);
      return;
    }

    // Trigger callback to parent component
    onRequestApproval(schoolId);
    onClose();
  } catch (err) {
    console.error('Error requesting approval:', err);
  }
};


  const canRequestApproval = userRole === 'onboarding' && (school.status === 'DRAFT' || school.status === 'REJECTED');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                <InfoField label="School ID" value={school.school_id || school.id} />
                <InfoField label="School Name" value={school.school_name} />
                <InfoField label="Email" value={school.school_email} />
                <InfoField label="Phone Number" value={school.school_phone} />
                <InfoField label="School Type" value={school.school_type} />
                <InfoField label="Level" value={school.level} />
                <InfoField label="Number of Students" value={school.number_of_students?.toString() ?? '0'} />
                <InfoField label="Number of Teachers" value={school.number_of_teachers?.toString() ?? '0'} />
                <InfoField label="Subscription" value={school.subscription} />
                <InfoField label="Subscription Year" value={school.subscription_year ?? 'N/A'} />
                <InfoField label="Province" value={school.province} />
                <InfoField label="District" value={school.district ?? 'N/A'} />
                <InfoField label="Sector" value={school.sector} />
                <InfoField label="Cell" value={school.cell} />
                <InfoField label="Village" value={school.village} />
                <InfoField label="Registration Date" value={school.registration_date} />
              </div>
            </div>

            {/* Part 2: Headmaster Information */}
            <div>
              <h3 className="text-gray-900 mb-4 pb-2 border-b-2 border-green-500">Part 2: Headmaster Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Full Name" value={school.headmaster_name} />
                <InfoField label="Email" value={school.headmaster_email} />
                <InfoField label="Phone Number" value={school.headmaster_phone} />
              </div>
            </div>

            {/* Part 3: Documents */}
            <div>
              <h3 className="text-gray-900 mb-4 pb-2 border-b-2 border-purple-500">Part 3: Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentField label="School Registration Certificate" file={school.registration_certificate} />
                <DocumentField label="Payment Proof" file={school.payment_proof} />
                <DocumentField label="Invoice" file={school.invoice} />
                <DocumentField label="Other Documents" file={school.other_documents} />
              </div>
            </div>

            {/* Status Information */}
            <div>
              <h3 className="text-gray-900 mb-4 pb-2 border-b-2 border-orange-500">Status Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Status" value={school.status} />
                <InfoField label="Created At" value={school.created_at ? new Date(school.created_at).toLocaleDateString() : 'N/A'} />
                {(school.rejection_reason || school.reject_message) && (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Rejection Reason</label>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{school.rejection_reason || school.reject_message}</p>
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
            {school.status === 'PENDING' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  This school is currently pending approval from the Compliance Officer.
                </p>
              </div>
            )}

            {/* Approved Message */}
            {school.status === 'APPROVED' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  ✓ This school has been approved.
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
  file?: File | string | null;
}

function DocumentField({ label, file }: DocumentFieldProps) {
  // Check if file is a URL (string) or File object
  const isURL = typeof file === 'string';
  const fileName = isURL ? file?.split('/').pop() || 'Document' : (file as File)?.name;
  const fileSize = !isURL && file ? ((file as File).size / 1024).toFixed(2) + ' KB' : '';

  return (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      {file ? (
        <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900 text-sm">{fileName}</p>
              {fileSize && <p className="text-gray-500 text-xs">{fileSize}</p>}
            </div>
          </div>
          {isURL && (
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
          <p className="text-gray-500">No file uploaded</p>
        </div>
      )}
    </div>
  );
}