import React, { useEffect, useState } from 'react';
import { Check, Copy, Clock, MapPin, DollarSign, Phone, Share2, DownloadCloud } from 'lucide-react';

// Simple confetti animation
function useConfetti() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const colors = ['#E6B7A9', '#FAF7F4', '#F5D6CF', '#E0B0A0'];

    for (let i = 0; i < 50; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 5 + 5,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vrotation: (Math.random() - 0.5) * 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((particle, index) => {
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity
        particle.x += particle.vx;
        particle.rotation += particle.vrotation;

        if (particle.y > canvas.height) {
          confetti.splice(index, 1);
        }

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
      });

      if (confetti.length > 0) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas);
      }
    };

    animate();
  }, []);
}

export default function SuccessConfirmation({
  bookingRef,
  serviceNames = [],
  date,
  time,
  totalPrice = 0,
  customerName = 'Guest',
  onClose,
  onDownload,
}) {
  const [copied, setCopied] = useState(false);
  const [openingInWhatsApp, setOpeningInWhatsApp] = useState(false);

  useConfetti();

  const handleCopyRef = () => {
    navigator.clipboard.writeText(bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    setOpeningInWhatsApp(true);
    const message = encodeURIComponent(
      `✨ Booking Confirmed!\n\nRef: ${bookingRef}\nServices: ${serviceNames.join(', ')}\nDate: ${date}\nTime: ${time}\n\nThank you for booking with Elegance Nails!`
    );
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Success Header */}
        <div
          className="p-8 text-center text-white flex flex-col items-center gap-4"
          style={{ backgroundColor: '#E6B7A9' }}
        >
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              <Check size={40} strokeWidth={3} />
            </div>
          </div>
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: 'Playfair Display' }}
            >
              Booking Confirmed!
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', opacity: 0.9 }}>
              Thank you {customerName}
            </p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-8 space-y-6">
          {/* Booking Reference */}
          <div>
            <p style={{ color: '#777777', fontFamily: 'Inter', fontSize: '0.75rem' }} className="mb-2 uppercase tracking-wide">
              Booking Reference
            </p>
            <div className="flex items-center gap-2">
              <code
                className="flex-1 p-3 rounded-lg font-mono text-sm font-semibold"
                style={{
                  backgroundColor: '#F5F5F5',
                  color: '#1E1E1E',
                  fontFamily: 'Courier New',
                  border: '2px solid #E6B7A9',
                }}
              >
                {bookingRef}
              </code>
              <button
                onClick={handleCopyRef}
                className="p-3 rounded-lg transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: copied ? '#E6B7A9' : '#F5F5F5',
                  color: copied ? '#FAF7F4' : '#1E1E1E',
                }}
                title={copied ? 'Copied!' : 'Copy reference'}
              >
                <Copy size={20} />
              </button>
            </div>
          </div>

          {/* Booking Details Grid */}
          <div className="space-y-3">
            {/* Date */}
            <div className="flex items-start gap-3">
              <Clock size={20} style={{ color: '#E6B7A9', marginTop: '2px' }} />
              <div>
                <p style={{ color: '#777777', fontFamily: 'Inter', fontSize: '0.75rem' }} className="uppercase tracking-wide">
                  Date & Time
                </p>
                <p style={{ color: '#1E1E1E', fontFamily: 'Inter' }} className="font-semibold">
                  {date} at {time}
                </p>
              </div>
            </div>

            {/* Services */}
            {serviceNames.length > 0 && (
              <div className="flex items-start gap-3">
                <MapPin size={20} style={{ color: '#E6B7A9', marginTop: '2px' }} />
                <div>
                  <p style={{ color: '#777777', fontFamily: 'Inter', fontSize: '0.75rem' }} className="uppercase tracking-wide">
                    Services
                  </p>
                  <div>
                    {serviceNames.map((service, idx) => (
                      <p key={idx} style={{ color: '#1E1E1E', fontFamily: 'Inter' }} className="font-semibold">
                        • {service}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Price */}
            {totalPrice > 0 && (
              <div className="flex items-start gap-3">
                <DollarSign size={20} style={{ color: '#E6B7A9', marginTop: '2px' }} />
                <div>
                  <p style={{ color: '#777777', fontFamily: 'Inter', fontSize: '0.75rem' }} className="uppercase tracking-wide">
                    Total Amount
                  </p>
                  <p style={{ color: '#1E1E1E', fontFamily: 'Inter' }} className="font-bold text-lg">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: '#FAF7F4', borderLeft: '4px solid #E6B7A9' }}
          >
            <h4
              style={{ color: '#1E1E1E', fontFamily: 'Playfair Display' }}
              className="font-semibold mb-2"
            >
              What's Next?
            </h4>
            <ol style={{ color: '#777777', fontFamily: 'Inter', fontSize: '0.875rem' }} className="space-y-1 list-decimal list-inside">
              <li>A confirmation email has been sent to you</li>
              <li>Please arrive 10 minutes early</li>
              <li>We'll send you a reminder 24 hours before</li>
              <li>Have any questions? Message us anytime!</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleShareWhatsApp}
              disabled={openingInWhatsApp}
              className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                backgroundColor: '#25D366',
                color: '#FAF7F4',
                fontFamily: 'Inter',
              }}
            >
              <Phone size={18} />
              WhatsApp
            </button>

            {onDownload && (
              <button
                onClick={onDownload}
                className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#E0E0E0',
                  color: '#1E1E1E',
                  fontFamily: 'Inter',
                }}
              >
                <DownloadCloud size={18} />
                Receipt
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: '#FAF7F4',
              color: '#1E1E1E',
              border: '2px solid #E6B7A9',
              fontFamily: 'Inter',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * USAGE EXAMPLE
 * =============
 *
 * import SuccessConfirmation from '@/components/SuccessConfirmation';
 *
 * <SuccessConfirmation
 *   bookingRef="NAB-2024-001234"
 *   serviceNames={['Gel Manicure', 'Nail Art']}
 *   date="March 31, 2024"
 *   time="2:00 PM"
 *   totalPrice={120}
 *   customerName="Sarah"
 *   onClose={() => router.push('/')}
 *   onDownload={() => downloadReceipt()}
 * />
 */
