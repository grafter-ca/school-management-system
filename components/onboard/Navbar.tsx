import { GraduationCap, LogOut, Bell, User } from 'lucide-react';

// In a real Next.js project, this would be in: /components/layout/Navbar.tsx
interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">School Onboarding</h2>
                <p className="text-sm text-gray-500">Onboarding Officer Portal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button aria-label='notification' className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Officer Name</p>
                <p className="text-xs text-gray-500">Onboarding Officer</p>
              </div>
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}