'use client';

import { useState } from 'react';
import { School } from '@/types';
import { X, CheckCircle, Calendar, CreditCard, Users, Building } from 'lucide-react';

interface ActivateSchoolModalProps {
  school: School;
  onClose: () => void;
  onActivate: (activationData: ActivationData) => void;
}

interface ActivationData {
  activationDate: string;
  licenseType: string;
  maxUsers: number;
  expiryDate: string;
  notes: string;
}

export function ActivateSchoolModal({ school, onClose, onActivate }: ActivateSchoolModalProps) {
  const [formData, setFormData] = useState<ActivationData>({
    activationDate: new Date().toISOString().split('T')[0],
    licenseType: 'Standard',
    maxUsers: 50,
    expiryDate: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onActivate(formData);
  };

  const handleChange = (field: keyof ActivationData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8" />
            <div>
              <h2 className="text-white mb-1">Activate School</h2>
              <p className="text-green-100">{school.school_name}</p>
            </div>
          </div>
          <button aria-label='close'
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* School Information Summary */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="text-gray-900 mb-3">School Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">School ID</p>
                <p className="text-gray-900">{school.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Level</p>
                <p className="text-gray-900">{school.level}</p>
              </div>
              <div>
                <p className="text-gray-600">Students</p>
                <p className="text-gray-900">{school.number_of_students}</p>
              </div>
              <div>
                <p className="text-gray-600">Current Plan</p>
                <p className="text-gray-900">{school.subscription}</p>
              </div>
            </div>
          </div>

          {/* Activation Details */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Activation Details</h3>

            {/* Activation Date */}
            <div>
              <label className="block text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Activation Date
              </label>
              <input aria-label='input date'
                type="date"
                value={formData.activationDate}
                onChange={(e) => handleChange('activationDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* License Type */}
            <div>
              <label className="block text-gray-700 mb-2">
                <CreditCard className="inline w-4 h-4 mr-2" />
                License Type
              </label>
              <select aria-label='select level'
                value={formData.licenseType}
                onChange={(e) => handleChange('licenseType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              >
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            {/* Max Users */}
            <div>
              <label className="block text-gray-700 mb-2">
                <Users className="inline w-4 h-4 mr-2" />
                Maximum Users
              </label>
              <input aria-label='insert number of users'
                type="number"
                value={formData.maxUsers}
                onChange={(e) => handleChange('maxUsers', parseInt(e.target.value))}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              />
              <p className="text-gray-600 mt-1">Number of users allowed to access the system</p>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                License Expiry Date
              </label>
              <input aria-label='handle change'
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
                min={formData.activationDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 mb-2">
                <Building className="inline w-4 h-4 mr-2" />
                Activation Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                placeholder="Add any notes or special instructions for this activation..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              ⚠️ Once activated, the school will have full access to the system based on the license type selected.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              Activate School
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
