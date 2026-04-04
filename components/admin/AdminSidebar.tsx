import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LogOut, LayoutDashboard, Settings, Calendar, FileText } from 'lucide-react';
import { SHIVYA_SITE_NAME } from '@/lib/shivyaContent';

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
    <div className="fixed left-0 top-0 h-screen w-72 overflow-y-auto border-r border-[#8d6b5d] bg-[linear-gradient(180deg,#2f221c_0%,#6d4c3f_100%)] px-5 py-6 text-white">
      <div className="border-b border-white/10 pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e5c6ba]">
          Admin Panel
        </p>
        <h2
          className="mt-3 text-3xl font-medium leading-none"
          style={{ fontFamily: 'var(--shivya-serif)' }}
        >
          {SHIVYA_SITE_NAME}
        </h2>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`mb-2 flex items-center space-x-3 rounded-2xl px-4 py-3 transition-all ${
                isActive
                  ? 'bg-[#d7a095] text-white shadow-[0_12px_24px_rgba(215,160,149,0.28)]'
                  : 'text-[#f4e5dd] hover:bg-white/10'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-5 right-5">
        <button
          onClick={onLogout}
          className="flex w-full items-center space-x-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white transition-all hover:bg-white/15"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
