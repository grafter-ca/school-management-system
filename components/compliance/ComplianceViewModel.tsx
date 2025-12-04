'use client';

import { useState } from 'react';
import { X, FileText, CheckCircle, XCircle } from 'lucide-react';
import { School } from '@/types';

interface ComplianceViewModalProps {
  school: School;
  onClose: () => void;
  onApprove: (schoolId: string) => void;
  onReject: (schoolId: string, reason: string) => void;
}

export function ComplianceViewModal({ school, onClose, onApprove, onReject }: ComplianceViewModalProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    onApprove(school.id);
    onClose();
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(school.id, rejectionReason);
      onClose();
    }
  };

  const isPending = school.status === 'PENDING';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between z-10">
          <h2 className="text-gray-900">School Information - Compliance Review</h2>
          <button aria-label='cancel'
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
                <InfoField label="School Name" value={school.school_name} />
                <InfoField label="Email" value={school.school_email} />
                <InfoField label="Phone Number" value={school.school_phone} />
                <InfoField label="Level" value={school.level} />
                <InfoField label="Number of Students" value={school.number_of_students?.toString() ?? '0'} />
                <InfoField label="Subscription" value={school.subscription} />
                <InfoField label="Region" value={school.province} />
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
              </div>
            </div>

            {/* Status Information */}
            <div>
              <h3 className="text-gray-900 mb-4 pb-2 border-b-2 border-orange-500">Status Information</h3>
              <div className="grid grid-cols-1 gap-6">
                <InfoField label="Status" value={school.status} />
                {school.rejection_reason && (
                  <div>
                    <label className="block text-gray-700 mb-2">Previous Rejection Reason</label>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{school.rejection_reason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Approval/Rejection Section - Only for PENDINGs */}
            {isPending && !showRejectForm && (
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            )}

            {/* Rejection Form */}
            {showRejectForm && (
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <label className="block text-gray-900 mb-2">Rejection Reason *</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    placeholder="Please provide a detailed reason for rejection..."
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason('');
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectionReason.trim()}
                    className="px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}

            {/* Already Processed Message */}
            {(school.status === 'APPROVED' || school.status === 'REJECTED') && (
              <div className={`${school.status === 'APPROVED' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
                <p className={school.status === 'APPROVED' ? 'text-green-800' : 'text-red-800'}>
                  This school has been {school.status.toLowerCase()}.
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
  file: string | File | null | undefined;
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
            {/* // to be changed */}
            <p className="text-gray-900">{label}</p>
            <p className="text-gray-500">{(label)}</p>
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
