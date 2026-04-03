import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [isHovering, setIsHovering] = useState(false);

  // Phone number (replace with your WhatsApp Business number)
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';

  // Pre-filled message
  const message = encodeURIComponent(
    "Hi! I'm interested in booking a nail appointment. Could you please help me with available dates and times?"
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <>
      {/* Floating WhatsApp Button - Desktop */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-8 right-8 z-40 items-center gap-3 group cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Tooltip */}
        <div
          className={`bg-gray-800 text-white px-4 py-2 rounded-lg whitespace-nowrap text-sm transition-all duration-300 ${
            isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
          }`}
          style={{ fontFamily: 'Inter' }}
        >
          Chat with us on WhatsApp
        </div>

        {/* Button */}
        <div
          className="p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          style={{
            backgroundColor: '#25D366',
            color: '#fff',
            boxShadow: isHovering ? '0 10px 25px rgba(37, 211, 102, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <MessageCircle size={24} />
        </div>
      </a>

      {/* Mobile Sticky Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        style={{
          backgroundColor: '#25D366',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <MessageCircle size={24} />
      </a>
    </>
  );
}

/**
 * WHATSAPP INTEGRATION HELPER
 * ==========================
 *
 * Usage Examples:
 *
 * 1. Generate WhatsApp link with custom message:
 *    const link = generateWhatsAppLink('+1234567890', 'Hello! I want to book an appointment');
 *
 * 2. Track WhatsApp clicks:
 *    onClick={() => trackWhatsAppClick('booking')}
 */
export function generateWhatsAppLink(phoneNumber, message = '') {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function getWhatsAppNumberFormatted() {
  // Format: Convert from any format to international (e.g., +1234567890)
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  return raw.replace(/\D/g, ''); // Remove non-digits
}
