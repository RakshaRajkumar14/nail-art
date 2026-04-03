import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LogOut, LayoutDashboard, Settings, Calendar, FileText } from 'lucide-react';

interface AdminSidebarProps {
  onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const router = useRouter();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Services',
      href: '/admin/services',
      icon: Settings,
    },
    {
      name: 'Bookings',
      href: '/admin/bookings',
      icon: Calendar,
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: FileText,
    },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">✨ Admin</h2>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <a
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all text-white"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
