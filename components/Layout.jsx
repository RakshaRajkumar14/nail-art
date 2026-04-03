import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { MessageCircle } from 'lucide-react';

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      {/* Main Content */}
      <main className="flex-grow">
        <div className={mounted ? 'fade-in' : 'opacity-0'}>
          {children}
        </div>
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle size={32} color="#FFFFFF" />
      </a>

      <Footer />
    </div>
  );
}
