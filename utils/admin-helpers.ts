/**
 * Utility functions for admin operations
 */

export function generateCSV(data: any[], headers: string[]): string {
  // Create header row
  const headerRow = headers.join(',');

  // Create data rows
  const dataRows = data.map((row) => {
    return headers.map((header) => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
  });

  return [headerRow, ...dataRows.map((row) => row.join(','))].join('\n');
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString();
}

export function formatTime(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusBadgeClass(status: string): string {
  return `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`;
}

export function calculateTotalRevenue(bookings: any[]): number {
  return bookings
    .filter((b) => b.status === 'completed')
    .reduce((total, b) => total + (b.totalPrice || 0), 0);
}

export function calculateUpcomingAppointments(bookings: any[]): number {
  const now = new Date();
  return bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    return bookingDate > now && (b.status === 'pending' || b.status === 'confirmed');
  }).length;
}

export async function uploadToSupabase(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  // This will be called from components
  // Import supabase client in component and use this helper
  throw new Error('Use supabaseUpload function from components');
}
