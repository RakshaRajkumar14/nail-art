import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminStats from '@/components/admin/AdminStats';
import AuthGuard from '@/components/admin/AuthGuard';
import { formatCurrency } from '@/utils/admin-helpers';

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

  const fetchDashboardData = useCallback(async () => {
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
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      fetchDashboardData();
    }
  }, [adminToken, fetchDashboardData]);

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
                Studio Overview
              </p>
              <h1
                className="mt-3 text-4xl font-medium text-[#2e211c]"
                style={{ fontFamily: 'var(--shivya-serif)' }}
              >
                Dashboard
              </h1>
              <p className="mt-2 text-[#897168]">
                Track bookings, revenue, and upcoming appointments with the same studio theme.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#c48379]"></div>
                <p className="text-[#897168]">Loading dashboard...</p>
              </div>
            ) : (
              <>
                <AdminStats
                  totalBookings={stats.totalBookings}
                  totalRevenue={stats.totalRevenue}
                  upcomingAppointments={stats.upcomingAppointments}
                  completedBookings={stats.completedBookings}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 rounded-[1.75rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                    <h2 className="mb-4 text-xl font-bold text-[#2e211c]">Upcoming Appointments</h2>

                    {upcomingAppointments.length === 0 ? (
                      <p className="py-8 text-center text-[#897168]">No upcoming appointments</p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingAppointments.map((appointment: any) => (
                          <div
                            key={appointment.id}
                            className="flex items-start justify-between rounded-2xl border border-[#efe1d9] bg-[#fffaf7] p-4 transition-colors hover:bg-white"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-[#2e211c]">
                                {appointment.customerName}
                              </p>
                              <p className="text-sm text-[#897168]">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-[#2e211c]">
                                {formatCurrency(appointment.totalPrice)}
                              </p>
                              <span
                                className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                  appointment.status === 'confirmed'
                                    ? 'bg-[#e8f1ea] text-[#50745b]'
                                    : 'bg-[#f6eee4] text-[#9c6f43]'
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

                  <div className="rounded-[1.75rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                    <h2 className="mb-4 text-xl font-bold text-[#2e211c]">Quick Actions</h2>

                    <div className="space-y-3">
                      <button
                        onClick={() => router.push('/admin/services')}
                        className="w-full rounded-2xl bg-[#f8eee8] px-4 py-3 text-left font-medium text-[#b47958] transition-colors hover:bg-[#f3e4dc]"
                      >
                        Manage Services
                      </button>
                      <button
                        onClick={() => router.push('/admin/bookings')}
                        className="w-full rounded-2xl bg-[#fff4ee] px-4 py-3 text-left font-medium text-[#b47958] transition-colors hover:bg-[#f7e6dc]"
                      >
                        View All Bookings
                      </button>
                      <button
                        onClick={() => router.push('/admin/reports')}
                        className="w-full rounded-2xl bg-[#f5ebe5] px-4 py-3 text-left font-medium text-[#945b3b] transition-colors hover:bg-[#ecddd3]"
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
