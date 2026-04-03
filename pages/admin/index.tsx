import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminStats from '@/components/admin/AdminStats';
import AuthGuard from '@/components/admin/AuthGuard';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState('');
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    upcomingAppointments: 0,
    completedBookings: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminToken) {
      fetchDashboardData();
    }
  }, [adminToken]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings', {
        headers: {
          'Authorization': adminToken,
        },
      });

      const result = await res.json();

      if (result.success) {
        const bookings = result.data || [];

        // Calculate stats
        const totalBookings = bookings.length;
        const completedBookings = bookings.filter((b: any) => b.status === 'completed').length;
        const totalRevenue = bookings
          .filter((b: any) => b.status === 'completed')
          .reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);

        const now = new Date();
        const upcoming = bookings.filter((b: any) => {
          const bookingDate = new Date(b.date);
          return bookingDate > now && (b.status === 'pending' || b.status === 'confirmed');
        });

        setStats({
          totalBookings,
          totalRevenue,
          upcomingAppointments: upcoming.length,
          completedBookings,
        });
        setUpcomingAppointments(upcoming.slice(0, 5));
      } else {
        toast.error(result.error || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back to your admin panel</p>
            </div>

            {/* Stats */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            ) : (
              <>
                <AdminStats
                  totalBookings={stats.totalBookings}
                  totalRevenue={stats.totalRevenue}
                  upcomingAppointments={stats.upcomingAppointments}
                  completedBookings={stats.completedBookings}
                />

                {/* Upcoming Appointments */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>

                    {upcomingAppointments.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingAppointments.map((appointment: any) => (
                          <div
                            key={appointment.id}
                            className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {appointment.customerName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ${appointment.totalPrice.toFixed(2)}
                              </p>
                              <span
                                className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  appointment.status === 'confirmed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>

                    <div className="space-y-3">
                      <button
                        onClick={() => router.push('/admin/services')}
                        className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
                      >
                        Manage Services
                      </button>
                      <button
                        onClick={() => router.push('/admin/bookings')}
                        className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors font-medium"
                      >
                        View All Bookings
                      </button>
                      <button
                        onClick={() => router.push('/admin/reports')}
                        className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors font-medium"
                      >
                        Generate Reports
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
