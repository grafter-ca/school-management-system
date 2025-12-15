'use client';

import { useState } from 'react';
import { User } from '@/types';
import { UserPlus, Eye, Mail, Lock, Shield } from 'lucide-react';
import { CreateAdminModal } from './CreateAdminModal';

export function SuperAdminUsersPage() {
  const [users] = useState<User[]>([
    {
      id: 'USR-001',
      fullName: 'John Kamali',
      email: 'john.kamali@school.edu',
      phone: '+250788111222',
      role: 'onboarding',
      status: 'Active',
      createdDate: '2025-01-10',
      createdBy: 'Admin',
    },
    {
      id: 'USR-002',
      fullName: 'Marie Uwase',
      email: 'marie.uwase@school.edu',
      phone: '+250788333444',
      role: 'compliance',
      status: 'Active',
      createdDate: '2025-01-12',
      createdBy: 'Admin',
    },
    {
      id: 'USR-003',
      fullName: 'Peter Mugisha',
      email: 'peter.mugisha@school.edu',
      phone: '+250788555666',
      role: 'onboarding',
      status: 'Inactive',
      createdDate: '2025-01-08',
      createdBy: 'Admin',
    },
  ]);

  const [admins, setAdmins] = useState<User[]>([
    {
      id: 'ADM-001',
      fullName: 'Sarah Iradukunda',
      email: 'sarah.admin@school.edu',
      phone: '+250788777888',
      role: 'admin',
      status: 'Active',
      createdDate: '2025-01-05',
      createdBy: 'Super Admin',
    },
  ]);

  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);

  const handleCreateAdmin = (adminData: Omit<User, 'id' | 'createdDate' | 'createdBy'>) => {
    const newAdmin: User = {
      ...adminData,
      id: `ADM-${String(admins.length + 1).padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Super Admin',
    };
    setAdmins([...admins, newAdmin]);
    setShowCreateAdminModal(false);
    
    // Simulate sending email
    alert(`Password setup email sent to ${adminData.email}`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'onboarding':
        return 'bg-blue-100 text-blue-800';
      case 'compliance':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'onboarding':
        return 'Onboarding Officer';
      case 'compliance':
        return 'Compliance Officer';
      case 'admin':
        return 'System Administrator';
      default:
        return role;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Read-Only Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-purple-800">
          <Lock className="w-5 h-5" />
          <p>
            As Super Admin, you can only <strong>create System Administrators</strong>. All other user data is read-only.
          </p>
        </div>
      </div>

      {/* System Administrators Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-gray-900">System Administrators</h2>
            <p className="text-gray-600">Manage system administrator accounts</p>
          </div>
          <button
            onClick={() => setShowCreateAdminModal(true)}
            className="flex items-center space-x-2 bg-linear-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Shield className="w-5 h-5" />
            <span>Create Administrator</span>
          </button>
        </div>

        {/* Admins Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Admins</p>
                <p className="text-gray-900">{admins.length}</p>
              </div>
              <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Active Admins</p>
                <p className="text-gray-900">
                  {admins.filter(a => a.status === 'Active').length}
                </p>
              </div>
              <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Inactive Admins</p>
                <p className="text-gray-900">
                  {admins.filter(a => a.status === 'Inactive').length}
                </p>
              </div>
              <div className="bg-gray-50 text-gray-600 p-3 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Full Name</th>
                  <th className="px-6 py-3 text-left text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-gray-700">Created Date</th>
                  <th className="px-6 py-3 text-left text-gray-700">Created By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-gray-900">{admin.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                    <td className="px-6 py-4 text-gray-600">{admin.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full ${
                          admin.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(admin.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{admin.createdBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {admins.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No administrators found</p>
            </div>
          )}
        </div>
      </div>

      {/* Other Users Section (Read-Only) */}
      <div className="mt-12">
        <div className="mb-4">
          <h2 className="text-gray-900">All System Users</h2>
          <p className="text-gray-600">View-only access to onboarding and compliance officers</p>
        </div>

        {/* Users Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Users</p>
                <p className="text-gray-900">{users.length}</p>
              </div>
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Active Users</p>
                <p className="text-gray-900">
                  {users.filter(u => u.status === 'Active').length}
                </p>
              </div>
              <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Inactive Users</p>
                <p className="text-gray-900">
                  {users.filter(u => u.status === 'Inactive').length}
                </p>
              </div>
              <div className="bg-gray-50 text-gray-600 p-3 rounded-lg">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Full Name</th>
                  <th className="px-6 py-3 text-left text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-gray-700">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{user.fullName}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(user.createdDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateAdminModal && (
        <CreateAdminModal
          onClose={() => setShowCreateAdminModal(false)}
          onSubmit={handleCreateAdmin}
        />
      )}
    </div>
  );
}
