import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface AuthGuardProps {
  children: React.ReactNode;
  onTokenReceived?: (token: string) => void;
}

export default function AuthGuard({ children, onTokenReceived }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [credentials, setCredentials] = useState({ password: '' });

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      onTokenReceived?.(token);
      setLoading(false);
    } else {
      setShowLoginForm(true);
      setLoading(false);
    }
  }, [onTokenReceived]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // For demo purposes, we're using a simple password check
      // In production, this would be replaced with proper Supabase auth
      const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin123';

      if (credentials.password === adminSecret) {
        const token = `Bearer ${credentials.password}`;
        localStorage.setItem('adminToken', token);
        setIsAuthenticated(true);
        setShowLoginForm(false);
        onTokenReceived?.(token);
        toast.success('Logged in successfully!');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || showLoginForm) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">✨ Admin</h1>
          <p className="text-center text-gray-600 mb-6">Login to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ password: e.target.value })}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Demo: Use your admin password (check .env.local)
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
