import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import BookingsView from '@/components/admin/BookingsView';
import AuthGuard from '@/components/admin/AuthGuard';

export default function BookingsPage() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    router.push('/');
    toast.success('Logged out successfully!');
  };

  return (
    <AuthGuard onTokenReceived={setAdminToken}>
      <div className="flex min-h-screen bg-transparent relative z-10">
        <AdminSidebar onLogout={handleLogout} />

        <div className="ml-72 flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c48379]">
                Operations
              </p>
              <h1
                className="mt-3 text-4xl font-medium text-[#2e211c]"
                style={{ fontFamily: 'var(--shivya-serif)' }}
              >
                Bookings Management
              </h1>
              <p className="mt-2 text-[#897168]">View and manage all customer bookings.</p>
            </div>

            {adminToken ? (
              <BookingsView adminToken={adminToken} />
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#c48379]"></div>
                <p className="text-[#897168]">Loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
