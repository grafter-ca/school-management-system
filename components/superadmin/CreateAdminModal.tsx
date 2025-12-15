'use client';

import { useState } from 'react';
import { User } from '@/types';
import { X, Shield, Mail, Phone, ToggleLeft } from 'lucide-react';

interface CreateAdminModalProps {
  onClose: () => void;
  onSubmit: (adminData: Omit<User, 'id' | 'createdDate' | 'createdBy'>) => void;
}

export function CreateAdminModal({ onClose, onSubmit }: CreateAdminModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'admin' as 'admin',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8" />
            <div>
              <h2 className="text-white mb-1">Create System Administrator</h2>
              <p className="text-purple-100">Add a new system administrator</p>
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
          {/* Information Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-800">
              🔐 System Administrators have full access to manage schools and users. An email will be sent to set up their password.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-gray-700 mb-2">
              <Shield className="inline w-4 h-4 mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Enter full name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fullName && (
              <p className="text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="admin@example.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+250788123456"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Role (Fixed as Admin) */}
          <div>
            <label className="block text-gray-700 mb-2">
              <Shield className="inline w-4 h-4 mr-2" />
              Role
            </label>
            <div className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-gray-700">
              System Administrator
            </div>
            <p className="text-gray-600 mt-1">
              Full access to manage schools, activate schools, and create users
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700 mb-2">
              <ToggleLeft className="inline w-4 h-4 mr-2" />
              Status *
            </label>
            <select aria-label='activate'
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Warning Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              ⚠️ System Administrators have elevated privileges. Only create accounts for trusted personnel.
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
              className="px-6 py-3 bg-linear-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Create Administrator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
