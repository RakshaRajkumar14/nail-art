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
    <div className="fixed left-0 top-0 h-screen w-72 overflow-y-auto border-r border-[#ead8cf]/60 bg-white/60 backdrop-blur-2xl px-5 py-6 text-[#2e211c] shadow-[4px_0_32px_rgba(180,121,88,0.08)] z-20 transition-all">
      <div className="border-b border-[#ead8cf]/60 pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c48379]">
          Admin Panel
        </p>
        <h2
          className="mt-3 text-4xl font-bold leading-none text-[#2e211c]"
          style={{ fontFamily: 'var(--shivya-serif)' }}
        >
          {SHIVYA_SITE_NAME}
        </h2>
      </div>

      <nav className="mt-8 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-4 rounded-2xl px-4 py-4 transition-all duration-300 font-bold text-lg ${
                isActive
                  ? 'bg-gradient-to-r from-[#d7a095] to-[#c48379] text-white shadow-[0_8px_20px_rgba(215,160,149,0.35)]'
                  : 'text-[#6e5c54] hover:bg-white/80 hover:text-[#2e211c] hover:shadow-sm'
              }`}
            >
              <Icon size={24} className={isActive ? 'text-white' : 'text-[#b47958]'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-5 right-5">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center space-x-3 rounded-2xl border border-[#efe1d9] bg-white/70 px-4 py-4 text-base font-bold text-[#897168] transition-all hover:bg-white hover:text-[#c48379] hover:shadow-sm hover:border-[#e6c2bf]"
        >
          <LogOut size={20} />
          <span>SIGN OUT</span>
        </button>
      </div>
    </div>
  );
}
