'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { AdminDashboardHome } from '../admin/AdminDashboardHome';
import { SuperAdminSchoolsPage } from './SuperAdminSchoolsPage';
import { SuperAdminUsersPage } from './SuperAdminUsersPage';

interface SuperAdminDashboardProps {
  onLogout: () => void;
}

type SuperAdminPage = 'dashboard' | 'schools' | 'users';

export function SuperAdminDashboard({ onLogout }: SuperAdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState<SuperAdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { id: 'dashboard' as SuperAdminPage, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'schools' as SuperAdminPage, name: 'Schools', icon: School },
    { id: 'users' as SuperAdminPage, name: 'Users', icon: Users },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboardHome />;
      case 'schools':
        return <SuperAdminSchoolsPage />;
      case 'users':
        return <SuperAdminUsersPage />;
      default:
        return <AdminDashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-linear-to-b from-purple-600 to-indigo-700 text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6" />
              <h2 className="text-xl">Super Admin</h2>
            </div>
            <button aria-label='hide'
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white/10 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-purple-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-purple-100 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <button aria-label='menu'
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <div>
                <h1 className="text-gray-900">
                  {navigation.find((n) => n.id === currentPage)?.name}
                </h1>
                <p className="text-gray-600">Super Administrator - Read Only</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-gray-900">Super Admin</p>
                <p className="text-gray-600">Full Access</p>
              </div>
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
