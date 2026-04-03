import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ServiceManagement from '@/components/admin/ServiceManagement';
import AuthGuard from '@/components/admin/AuthGuard';

export default function ServicesPage() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    router.push('/admin');
    toast.success('Logged out successfully!');
  };

  return (
    <AuthGuard onTokenReceived={setAdminToken}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar onLogout={handleLogout} />

        {/* Main Content */}
        <div className="flex-1 ml-64 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
              <p className="text-gray-600 mt-2">Add, edit, or remove services offered</p>
            </div>

            {/* Service Management Component */}
            {adminToken ? (
              <ServiceManagement adminToken={adminToken} />
            ) : (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
