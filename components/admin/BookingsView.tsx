import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Download,
  Eye,
  Trash2,
  Calendar,
  User,
  RefreshCw,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  formatDate,
  formatCurrency,
  formatDuration,
  generateCSV,
  downloadCSV,
  getStatusColor,
  computeOverlappingBookingIds,
} from '@/utils/admin-helpers';

interface ServiceLine {
  id?: string;
  name: string;
  duration?: number;
  price?: number;
}

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  totalPrice: number;
  totalDuration: number;
  status: string;
  createdAt: string;
  notes?: string;
  services?: ServiceLine[];
}

interface BookingsViewProps {
  adminToken: string;
}

const emptyFilters = {
  startDate: '',
  endDate: '',
  customerName: '',
  status: '',
};

export default function BookingsView({ adminToken }: BookingsViewProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ ...emptyFilters });
  const [appliedFilters, setAppliedFilters] = useState({ ...emptyFilters });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (appliedFilters.startDate) params.append('startDate', appliedFilters.startDate);
      if (appliedFilters.endDate) params.append('endDate', appliedFilters.endDate);
      if (appliedFilters.customerName) params.append('customerName', appliedFilters.customerName);
      if (appliedFilters.status) params.append('status', appliedFilters.status);

      const res = await fetch(`/api/bookings?${params}`, {
        headers: {
          Authorization: adminToken,
        },
      });

      const result = await res.json();

      if (result.success) {
        setBookings(result.data || []);
      } else {
        toast.error(result.error || 'Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [adminToken, appliedFilters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const d = String(a.date).localeCompare(String(b.date));
      if (d !== 0) return d;
      return String(a.timeSlot || '').localeCompare(String(b.timeSlot || ''));
    });
  }, [bookings]);

  const overlapIds = useMemo(() => {
    return computeOverlappingBookingIds(
      sortedBookings.map((b) => ({
        id: b.id,
        date: b.date,
        timeSlot: b.timeSlot,
        totalDuration: b.totalDuration,
        status: b.status,
      }))
    );
  }, [sortedBookings]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterApply = () => {
    setAppliedFilters({ ...filters });
  };

  const handleResetFilters = () => {
    setFilters({ ...emptyFilters });
    setAppliedFilters({ ...emptyFilters });
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: adminToken,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success('Booking status updated.');
        await fetchBookings();
      } else {
        toast.error(result.error || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Delete this booking permanently?')) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: adminToken,
        },
      });

      const result = await res.json();

      if (result.success) {
        toast.success('Booking deleted.');
        await fetchBookings();
      } else {
        toast.error(result.error || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Time',
      'Duration',
      'Customer Name',
      'Email',
      'Phone',
      'Services',
      'Price',
      'Status',
      'Schedule overlap',
    ];
    const data = sortedBookings.map((b) => ({
      Date: formatDate(b.date),
      Time: b.timeSlot,
      Duration: formatDuration(b.totalDuration || 0),
      'Customer Name': b.customerName,
      Email: b.customerEmail,
      Phone: b.customerPhone,
      Services: (b.services || []).map((s) => s.name).join('; '),
      Price: formatCurrency(b.totalPrice),
      Status: b.status,
      'Schedule overlap': overlapIds.has(b.id) ? 'yes' : '',
    }));

    const csv = generateCSV(data, headers);
    downloadCSV(csv, `bookings-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('CSV exported.');
  };

  const servicesSummary = (b: Booking) => {
    const list = b.services || [];
    if (!list.length) return '—';
    const names = list.map((s) => s.name).filter(Boolean);
    const joined = names.join(', ');
    return joined.length > 48 ? `${joined.slice(0, 45)}…` : joined;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#2e211c]">Bookings</h2>
          <p className="mt-1 text-sm text-[#6e5c54]">
            Pending and confirmed visits block the same time for other guests. Overlaps are flagged
            below.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fetchBookings()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-[#d9c1b5] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#6b5850] shadow-sm transition hover:bg-[#fffaf7] disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={bookings.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#d7a095,#e2b3ab)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-md transition hover:opacity-95 disabled:bg-[#d6c7bf]"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {overlapIds.size > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">Schedule overlaps detected</p>
            <p className="mt-0.5 text-amber-900/85">
              {overlapIds.size} booking{overlapIds.size === 1 ? '' : 's'} share a time window with
              another appointment on the same day. Cancel or reschedule one of them, or mark as
              cancelled so online booking can use that slot again.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-[1.75rem] border border-[#ead8cf] bg-white/95 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
        <h3 className="text-base font-semibold text-[#2e211c]">Filters</h3>
        <p className="mt-1 text-sm text-[#6e5c54]">Set criteria, then apply — list won&apos;t reload on every keystroke.</p>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#897168]">
              Start date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full rounded-2xl border border-[#d9c1b5] bg-white px-3 py-3 text-[#2e211c] outline-none ring-[#c48379]/30 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#897168]">
              End date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full rounded-2xl border border-[#d9c1b5] bg-white px-3 py-3 text-[#2e211c] outline-none ring-[#c48379]/30 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#897168]">
              Customer
            </label>
            <input
              type="text"
              name="customerName"
              placeholder="Search name…"
              value={filters.customerName}
              onChange={handleFilterChange}
              className="w-full rounded-2xl border border-[#d9c1b5] bg-white px-3 py-3 text-[#2e211c] outline-none ring-[#c48379]/30 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#897168]">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-2xl border border-[#d9c1b5] bg-white px-3 py-3 text-[#2e211c] outline-none ring-[#c48379]/30 focus:ring-2"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleFilterApply}
            disabled={loading}
            className="rounded-full bg-[#b47958] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[#a06a4c] disabled:bg-[#d6c7bf]"
          >
            Apply filters
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="rounded-full border border-[#d9c1b5] bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#6b5850] transition hover:bg-[#fffaf7]"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-[#ead8cf] bg-white/95 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
        {loading ? (
          <div className="p-12 text-center text-[#6e5c54]">Loading bookings…</div>
        ) : sortedBookings.length === 0 ? (
          <div className="p-12 text-center text-[#6e5c54]">No bookings match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left">
              <thead className="sticky top-0 z-10 border-b border-[#efe1d9] bg-[#fffaf7]">
                <tr>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#6b5850]">
                    Date & time
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#6b5850]">
                    Duration
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#6b5850]">
                    Customer
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#6b5850]">
                    Services
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#6b5850]">
                    Price
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#6b5850]">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#6b5850]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e4de]">
                {sortedBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className={`transition-colors hover:bg-[#fffaf7]/90 ${
                      overlapIds.has(booking.id) ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-[#2e211c]">
                          <Calendar size={15} className="shrink-0 text-[#b47958]" />
                          {formatDate(booking.date)} · {booking.timeSlot}
                        </div>
                        {overlapIds.has(booking.id) && (
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-amber-900">
                            <AlertTriangle size={11} />
                            Overlap
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="inline-flex items-center gap-1.5 text-sm text-[#4a3d38]">
                        <Clock size={15} className="text-[#b47958]" />
                        {formatDuration(booking.totalDuration || 0)}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-start gap-2">
                        <User size={15} className="mt-0.5 shrink-0 text-[#b47958]" />
                        <div>
                          <div className="text-sm font-semibold text-[#2e211c]">{booking.customerName}</div>
                          <div className="text-xs text-[#6e5c54]">{booking.customerEmail}</div>
                          <div className="text-xs text-[#897168]">{booking.customerPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[220px] px-5 py-4 align-top">
                      <div className="flex items-start gap-1.5 text-sm leading-snug text-[#4a3d38]">
                        <Sparkles size={14} className="mt-0.5 shrink-0 text-[#c48379]" />
                        <span>{servicesSummary(booking)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-sm font-semibold text-[#2e211c]">
                      {formatCurrency(booking.totalPrice)}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`max-w-full rounded-full border-0 px-3 py-2 text-xs font-semibold outline-none ring-1 ring-black/5 ${getStatusColor(booking.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="View details"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowModal(true);
                          }}
                          className="rounded-full p-2 text-[#b47958] transition hover:bg-[#f3e4dc]"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => handleDelete(booking.id)}
                          className="rounded-full p-2 text-[#a55a50] transition hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(56,38,28,0.35)] px-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-detail-title"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] border border-[#ead8cf] bg-white p-8 shadow-[0_24px_50px_rgba(103,69,53,0.15)]">
            <h3 id="booking-detail-title" className="text-xl font-semibold text-[#2e211c]">
              Booking details
            </h3>

            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#897168]">Customer</dt>
                <dd className="mt-1 font-medium text-[#2e211c]">{selectedBooking.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#897168]">Contact</dt>
                <dd className="mt-1 text-[#4a3d38]">{selectedBooking.customerEmail}</dd>
                <dd className="text-[#4a3d38]">{selectedBooking.customerPhone}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#897168]">When</dt>
                <dd className="mt-1 font-medium text-[#2e211c]">
                  {formatDate(selectedBooking.date)} at {selectedBooking.timeSlot}
                </dd>
                <dd className="mt-0.5 text-[#6e5c54]">
                  {formatDuration(selectedBooking.totalDuration || 0)} total
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#897168]">Services</dt>
                <dd className="mt-2 space-y-2">
                  {(selectedBooking.services || []).length === 0 ? (
                    <span className="text-[#897168]">—</span>
                  ) : (
                    (selectedBooking.services || []).map((s, i) => (
                      <div
                        key={`${s.id || s.name}-${i}`}
                        className="flex justify-between gap-3 rounded-xl border border-[#f0e4de] bg-[#fffaf7] px-3 py-2"
                      >
                        <span className="font-medium text-[#2e211c]">{s.name}</span>
                        <span className="shrink-0 text-xs text-[#6e5c54]">
                          {s.duration != null ? `${s.duration} min` : ''}
                          {s.price != null ? ` · ${formatCurrency(s.price)}` : ''}
                        </span>
                      </div>
                    ))
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#897168]">Total</dt>
                <dd className="mt-1 text-lg font-semibold text-[#c48379]">
                  {formatCurrency(selectedBooking.totalPrice)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#897168]">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </dd>
              </div>
              {selectedBooking.notes ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#897168]">Notes</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-[#4a3d38]">{selectedBooking.notes}</dd>
                </div>
              ) : null}
            </dl>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mt-8 w-full rounded-full bg-[#f3e4dc] py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#945b3b] transition hover:bg-[#ead4c7]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
