import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AuthGuard from '@/components/admin/AuthGuard';
import { formatCurrency } from '@/utils/admin-helpers';

export default function ReportsPage() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('revenue');

  const fetchBookingsForReport = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings', {
        headers: {
          'Authorization': adminToken,
        },
      });

      const result = await res.json();

      if (result.success) {
        setBookings(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  React.useEffect(() => {
    if (adminToken) {
      fetchBookingsForReport();
    }
  }, [adminToken, reportType, fetchBookingsForReport]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    router.push('/');
    toast.success('Logged out successfully!');
  };

  const getRevenueReport = () => {
    const completed = bookings.filter((b: any) => b.status === 'completed');
    const totalRevenue = completed.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
    const avgRevenue = completed.length > 0 ? totalRevenue / completed.length : 0;

    return {
      totalRevenue,
      completedBookings: completed.length,
      averageBookingPrice: avgRevenue,
      lastUpdated: new Date().toLocaleString(),
    };
  };

  const getBookingStatsReport = () => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter((b: any) => b.status === 'pending').length,
      confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
      completed: bookings.filter((b: any) => b.status === 'completed').length,
      cancelled: bookings.filter((b: any) => b.status === 'cancelled').length,
    };

    return stats;
  };

  const revenueReport = getRevenueReport();
  const bookingStats = getBookingStatsReport();

  return (
    <AuthGuard onTokenReceived={setAdminToken}>
      <div className="flex min-h-screen bg-transparent relative z-10">
        <AdminSidebar onLogout={handleLogout} />

        <div className="ml-72 flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c48379]">
                Studio Reports
              </p>
              <h1
                className="mt-3 text-4xl font-medium text-[#2e211c]"
                style={{ fontFamily: 'var(--shivya-serif)' }}
              >
                Reports
              </h1>
              <p className="mt-2 text-[#897168]">View analytics and business metrics.</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#c48379]"></div>
                <p className="text-[#897168]">Loading reports...</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex space-x-4">
                  <button
                    onClick={() => setReportType('revenue')}
                    className={`rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                      reportType === 'revenue'
                        ? 'bg-[linear-gradient(135deg,#d7a095,#e2b3ab)] text-white shadow-[0_18px_34px_rgba(213,160,147,0.22)]'
                        : 'border border-[#ead8cf] bg-white text-[#2e211c]'
                    }`}
                  >
                    Revenue Report
                  </button>
                  <button
                    onClick={() => setReportType('bookings')}
                    className={`rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                      reportType === 'bookings'
                        ? 'bg-[linear-gradient(135deg,#d7a095,#e2b3ab)] text-white shadow-[0_18px_34px_rgba(213,160,147,0.22)]'
                        : 'border border-[#ead8cf] bg-white text-[#2e211c]'
                    }`}
                  >
                    Booking Stats
                  </button>
                </div>

                {reportType === 'revenue' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="rounded-[1.5rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                      <h3 className="text-sm font-medium text-[#897168]">Total Revenue</h3>
                      <p className="mt-2 text-3xl font-bold text-[#2e211c]">
                        {formatCurrency(revenueReport.totalRevenue)}
                      </p>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                      <h3 className="text-sm font-medium text-[#897168]">Completed Bookings</h3>
                      <p className="mt-2 text-3xl font-bold text-[#2e211c]">
                        {revenueReport.completedBookings}
                      </p>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                      <h3 className="text-sm font-medium text-[#897168]">Average Booking</h3>
                      <p className="mt-2 text-3xl font-bold text-[#2e211c]">
                        {formatCurrency(revenueReport.averageBookingPrice)}
                      </p>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                      <h3 className="text-sm font-medium text-[#897168]">Last Updated</h3>
                      <p className="mt-2 text-sm text-[#2e211c]">{revenueReport.lastUpdated}</p>
                    </div>
                  </div>
                )}

                {reportType === 'bookings' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="rounded-[1.5rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                      <h3 className="text-sm font-medium text-[#897168]">Total Bookings</h3>
                      <p className="mt-2 text-3xl font-bold text-[#2e211c]">{bookingStats.total}</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                      <h3 className="text-sm font-medium text-[#897168]">Pending</h3>
                      <p className="mt-2 text-3xl font-bold text-[#9c6f43]">{bookingStats.pending}</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                      <h3 className="text-sm font-medium text-[#897168]">Confirmed</h3>
                      <p className="mt-2 text-3xl font-bold text-[#b47958]">{bookingStats.confirmed}</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                      <h3 className="text-sm font-medium text-[#897168]">Completed</h3>
                      <p className="mt-2 text-3xl font-bold text-[#50745b]">{bookingStats.completed}</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                      <h3 className="text-sm font-medium text-[#897168]">Cancelled</h3>
                      <p className="mt-2 text-3xl font-bold text-[#a55a50]">{bookingStats.cancelled}</p>
                    </div>
                  </div>
                )}

                <div className="mt-8 rounded-[1.75rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
                  <h2 className="mb-6 text-xl font-bold text-[#2e211c]">Trend Analysis</h2>
                  <div className="flex h-64 items-center justify-center rounded-[1.25rem] border border-dashed border-[#d9c1b5] bg-[#fffaf7]">
                    <p className="text-[#897168]">Chart visualization would go here</p>
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
