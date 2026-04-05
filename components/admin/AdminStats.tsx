import React from 'react';
import { BarChart3, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/admin-helpers';

interface AdminStatsProps {
  totalBookings: number;
  totalRevenue: number;
  upcomingAppointments: number;
  completedBookings: number;
}

export default function AdminStats({
  totalBookings,
  totalRevenue,
  upcomingAppointments,
  completedBookings,
}: AdminStatsProps) {
  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'from-[#d7a095] to-[#c48379]',
      bgColor: 'bg-[#f6e7e0]',
      textColor: 'text-[#b47958]',
    },
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments,
      icon: Calendar,
      color: 'from-[#e7c8ba] to-[#d7a095]',
      bgColor: 'bg-[#f8eee8]',
      textColor: 'text-[#b47958]',
    },
    {
      title: 'Completed Bookings',
      value: completedBookings,
      icon: CheckCircle,
      color: 'from-[#d9b8a8] to-[#b47958]',
      bgColor: 'bg-[#f7ede7]',
      textColor: 'text-[#945b3b]',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="rounded-[1.5rem] border border-[#ead8cf] bg-white/90 p-6 shadow-[0_16px_36px_rgba(103,69,53,0.06)] transition-shadow hover:shadow-[0_20px_40px_rgba(103,69,53,0.08)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#897168]">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-[#2e211c]">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`${stat.textColor}`} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
