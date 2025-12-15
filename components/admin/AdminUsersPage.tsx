'use client';

import { useState } from 'react';
import { User } from '@/types';
import { UserPlus, Edit, Trash2, Mail } from 'lucide-react';
import { CreateUserModal } from './CreateUserModal';

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([
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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleCreateUser = (userData: Omit<User, 'id' | 'createdDate' | 'createdBy'>) => {
    const newUser: User = {
      ...userData,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Admin',
    };
    setUsers([...users, newUser]);
    setShowCreateModal(false);
    
    // Simulate sending email
    alert(`Password setup email sent to ${userData.email}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' as 'Active' | 'Inactive' }
        : user
    ));
  };

  const handleResendEmail = (user: User) => {
    alert(`Password setup email resent to ${user.email}`);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">User Management</h2>
          <p className="text-gray-600">Create and manage system users</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
        >
          <UserPlus className="w-5 h-5" />
          <span>Create User</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
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
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full cursor-pointer ${
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleResendEmail(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Resend Password Email"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
        />
      )}
    </div>
  );
}
