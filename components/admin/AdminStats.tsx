import React from 'react';
import { BarChart3, DollarSign, Calendar, CheckCircle } from 'lucide-react';

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
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Completed Bookings',
      value: completedBookings,
      icon: CheckCircle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
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
