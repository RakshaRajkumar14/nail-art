export interface AdminStats {
  totalBookings: number;
  totalRevenue: number;
  upcomingAppointments: number;
  completedBookings: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  upcomingAppointments: any[];
  recentBookings: any[];
}

export interface ServiceFormData {
  title: string;
  description: string;
  price: number;
  duration: number;
  category?: string;
  imageUrl?: string;
  imageFile?: File;
}

export interface BookingFilters {
  startDate?: string;
  endDate?: string;
  customerName?: string;
  status?: string;
}

export interface ExportOptions {
  format: 'csv' | 'pdf';
  fields: string[];
}
