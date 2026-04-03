import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" style={{ backgroundColor: '#1E1E1E', color: '#FAF7F4' }}>
      {/* Main Footer Content */}
      <div className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'Playfair Display', color: '#E6B7A9' }}
              >
                ✨ Elegance Nails
              </h3>
              <p className="text-sm mb-6" style={{ color: '#777777', fontFamily: 'Inter' }}>
                Your destination for premium nail artistry and exceptional service.
              </p>
              {/* Social Icons */}
              <div className="flex gap-4">
                {[
                  { icon: Facebook, url: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#' },
                  { icon: Instagram, url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#' },
                  { icon: Twitter, url: process.env.NEXT_PUBLIC_TWITTER_URL || '#' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: '#E6B7A9',
                      color: '#FAF7F4',
                    }}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'Playfair Display', color: '#E6B7A9' }}
              >
                Quick Links
              </h4>
              <ul className="space-y-2" style={{ fontFamily: 'Inter' }}>
                {['Home', 'Services', 'Gallery', 'About', 'Book'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-sm hover:text-yellow-200 transition-colors"
                      style={{ color: '#777777' }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'Playfair Display', color: '#E6B7A9' }}
              >
                Working Hours
              </h4>
              <div className="space-y-2" style={{ fontFamily: 'Inter', fontSize: '0.875rem' }}>
                <div className="flex items-start gap-2">
                  <Clock size={16} style={{ color: '#E6B7A9', marginTop: '2px' }} />
                  <div>
                    <p style={{ color: '#FAF7F4' }}>Mon - Fri</p>
                    <p style={{ color: '#777777' }}>9:00 AM - 7:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={16} style={{ color: '#E6B7A9', marginTop: '2px' }} />
                  <div>
                    <p style={{ color: '#FAF7F4' }}>Saturday</p>
                    <p style={{ color: '#777777' }}>10:00 AM - 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={16} style={{ color: '#E6B7A9', marginTop: '2px' }} />
                  <div>
                    <p style={{ color: '#FAF7F4' }}>Sunday</p>
                    <p style={{ color: '#777777' }}>Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'Playfair Display', color: '#E6B7A9' }}
              >
                Contact Us
              </h4>
              <div className="space-y-3" style={{ fontFamily: 'Inter', fontSize: '0.875rem' }}>
                <div className="flex items-center gap-3">
                  <Phone size={16} style={{ color: '#E6B7A9' }} />
                  <a
                    href="tel:+1234567890"
                    className="hover:text-yellow-200 transition-colors"
                    style={{ color: '#777777' }}
                  >
                    (123) 456-7890
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} style={{ color: '#E6B7A9' }} />
                  <a
                    href="mailto:info@elegancenails.com"
                    className="hover:text-yellow-200 transition-colors"
                    style={{ color: '#777777' }}
                  >
                    info@elegancenails.com
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} style={{ color: '#E6B7A9', marginTop: '2px' }} />
                  <p style={{ color: '#777777' }}>
                    123 Elegance Street<br />
                    Beautiful City, BC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(230, 183, 169, 0.2)' }}
      />

      {/* Bottom Bar */}
      <div className="px-4 py-8" style={{ backgroundColor: '#0F0F0F' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm" style={{ color: '#777777', fontFamily: 'Inter' }}>
            © {currentYear} Elegance Nails. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm" style={{ fontFamily: 'Inter' }}>
            <a href="#" className="hover:text-yellow-200 transition-colors" style={{ color: '#777777' }}>
              Privacy Policy
            </a>
            <a href="#" className="hover:text-yellow-200 transition-colors" style={{ color: '#777777' }}>
              Terms of Service
            </a>
            <a href="#" className="hover:text-yellow-200 transition-colors" style={{ color: '#777777' }}>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
