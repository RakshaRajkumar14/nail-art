import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Instagram, MessageCircle } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/elegancenails';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md" style={{ backgroundColor: '#FAF7F4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#1E1E1E', fontFamily: 'Playfair Display' }}>
              ✨ Elegance Nails
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors duration-300 font-medium hover:opacity-70"
                style={{ color: '#1E1E1E', fontFamily: 'Inter' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Social Icons & CTA - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Instagram Icon */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full transition-all duration-300 hover:bg-yellow-100"
              title="Follow us on Instagram"
              style={{ color: '#E6B7A9' }}
            >
              <Instagram size={20} />
            </a>

            {/* WhatsApp Icon */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full transition-all duration-300 hover:bg-green-100"
              title="Chat on WhatsApp"
              style={{ color: '#25D366' }}
            >
              <MessageCircle size={20} />
            </a>

            {/* Book Now Button */}
            <Link
              href="/book"
              className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 inline-block"
              style={{ backgroundColor: '#E6B7A9', color: '#FAF7F4', fontFamily: 'Inter' }}
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md transition-colors"
              style={{ color: '#1E1E1E' }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t" style={{ borderColor: '#E6B7A9', backgroundColor: '#FAF7F4' }}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:opacity-70"
                style={{ color: '#1E1E1E', fontFamily: 'Inter' }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="w-full text-left px-3 py-2 rounded-md font-semibold transition-all inline-block"
              style={{ backgroundColor: '#E6B7A9', color: '#FAF7F4', fontFamily: 'Inter' }}
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
