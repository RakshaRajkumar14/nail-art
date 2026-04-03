import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AuthGuard from '@/components/admin/AuthGuard';
import { formatDate, formatCurrency } from '@/utils/admin-helpers';

export default function ReportsPage() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('revenue');

  React.useEffect(() => {
    if (adminToken) {
      fetchBookingsForReport();
    }
  }, [adminToken, reportType]);

  const fetchBookingsForReport = async () => {
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
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    router.push('/admin');
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
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar onLogout={handleLogout} />

        {/* Main Content */}
        <div className="flex-1 ml-64 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600 mt-2">View analytics and business metrics</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading reports...</p>
              </div>
            ) : (
              <>
                {/* Report Type Selector */}
                <div className="mb-6 flex space-x-4">
                  <button
                    onClick={() => setReportType('revenue')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      reportType === 'revenue'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    Revenue Report
                  </button>
                  <button
                    onClick={() => setReportType('bookings')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      reportType === 'bookings'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    Booking Stats
                  </button>
                </div>

                {/* Revenue Report */}
                {reportType === 'revenue' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {formatCurrency(revenueReport.totalRevenue)}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-gray-600 text-sm font-medium">Completed Bookings</h3>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {revenueReport.completedBookings}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-gray-600 text-sm font-medium">Average Booking</h3>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {formatCurrency(revenueReport.averageBookingPrice)}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-gray-600 text-sm font-medium">Last Updated</h3>
                      <p className="text-sm text-gray-900 mt-2">{revenueReport.lastUpdated}</p>
                    </div>
                  </div>
                )}

                {/* Booking Stats Report */}
                {reportType === 'bookings' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-gray-600 text-sm font-medium">Total Bookings</h3>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{bookingStats.total}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                      <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
                      <p className="text-3xl font-bold text-yellow-600 mt-2">{bookingStats.pending}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                      <h3 className="text-gray-600 text-sm font-medium">Confirmed</h3>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{bookingStats.confirmed}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                      <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
                      <p className="text-3xl font-bold text-green-600 mt-2">{bookingStats.completed}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                      <h3 className="text-gray-600 text-sm font-medium">Cancelled</h3>
                      <p className="text-3xl font-bold text-red-600 mt-2">{bookingStats.cancelled}</p>
                    </div>
                  </div>
                )}

                {/* Chart Placeholder */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Trend Analysis</h2>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">Chart visualization would go here</p>
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
