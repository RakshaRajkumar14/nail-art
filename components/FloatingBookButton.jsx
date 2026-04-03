import React, { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function FloatingBookButton({ onClick, href = '#booking' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show button after 3 seconds on mobile
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  if (isDismissed || !isVisible) {
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDismissed(true);
  };

  return (
    <>
      {/* Mobile Floating Button */}
      <div
        className="md:hidden fixed bottom-20 left-0 right-0 z-30 px-4 animate-slide-up pointer-events-none"
        style={{
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <a
          href={href}
          onClick={handleClick}
          className="block mx-auto"
          style={{ pointerEvents: 'auto' }}
        >
          <button
            className="w-full py-3 px-6 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#E6B7A9',
              color: '#FAF7F4',
              fontFamily: 'Inter',
              boxShadow: '0 8px 24px rgba(230, 183, 169, 0.4)',
            }}
          >
            <CheckCircle size={20} />
            Book Your Appointment
          </button>
        </a>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="md:hidden fixed bottom-24 right-4 z-30 p-2 rounded-full transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#777777',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        title="Dismiss"
      >
        <X size={20} />
      </button>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

/**
 * MOBILE FLOATING BUTTON - VARIATIONS
 * ===================================
 */

export function FloatingChatButton({ onClick }) {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <div
      className="md:hidden fixed bottom-8 right-4 z-30 group cursor-pointer"
      onClick={onClick}
    >
      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center animate-pulse"
          style={{ backgroundColor: '#E6B7A9' }}
        >
          {unreadCount}
        </div>
      )}

      {/* Chat Button */}
      <button
        className="p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
        style={{
          backgroundColor: '#E6B7A9',
          color: '#FAF7F4',
          boxShadow: '0 4px 12px rgba(230, 183, 169, 0.4)',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
  );
}
