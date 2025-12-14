'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  sms_role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on first render
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  // LOGIN FUNCTION  
  const login = (data: any) => {
    const { user, token } = data;

    // Save to state
    setUser(user);
    setToken(token);

    // Save to local storage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    toast.success('Logged in successfully!');
  };

  // LOGOUT FUNCTION  
  const logout = async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST' });

      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Reset state
      setUser(null);
      setToken(null);

      toast.success('Logged out successfully!');

      // Redirect
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed!');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
