import React from 'react';
import Link from 'next/link';
import { Sparkles, Palette, Diamond, Heart } from 'lucide-react';

export default function FeaturedServices() {
  const services = [
    {
      title: 'Gel Manicure',
      description: 'Long-lasting, chip-free color with a mirror-like shine that lasts up to 3 weeks.',
      icon: Sparkles,
      price: 45,
      duration: '60 MIN',
    },
    {
      title: 'Nail Art Design',
      description: 'Custom hand-painted designs from minimalist lines to elaborate floral patterns.',
      icon: Palette,
      price: 65,
      duration: '90 MIN',
    },
    {
      title: 'Luxury Extensions',
      description: 'Sculpted acrylic or gel extensions shaped and styled to your perfect length.',
      icon: Diamond,
      price: 85,
      duration: '120 MIN',
    },
    {
      title: 'Spa Pedicure',
      description: 'Complete foot care with exfoliation, massage, and flawless polish application.',
      icon: Heart,
      price: 55,
      duration: '75 MIN',
    },
  ];

  return (
    <section id="services" className="py-20 px-4" style={{ backgroundColor: '#FAF7F4' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p
            className="text-sm tracking-widest uppercase mb-4"
            style={{ color: '#C5856A', fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 600, letterSpacing: '0.2em' }}
          >
            WHAT WE OFFER
          </p>
          <h2
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ color: '#1E1E1E', fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 700 }}
          >
            Our <span style={{ color: '#C5856A' }}>Services</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: '#888888', fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 500 }}
          >
            Each service is tailored to your unique style and preferences
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-xl"
                style={{ border: '1px solid rgba(200, 175, 160, 0.2)' }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: '#F8EEE8' }}
                >
                  <IconComponent size={28} style={{ color: '#C5856A' }} />
                </div>

                {/* Title */}
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: '#1E1E1E', fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 700 }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className="text-base mb-6 leading-relaxed"
                  style={{ color: '#888888', fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 500 }}
                >
                  {service.description}
                </p>

                {/* Price & Duration */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xl font-semibold"
                    style={{ color: '#C5856A', fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                  >
                    From ${service.price}
                  </span>
                  <span
                    className="text-sm tracking-wider"
                    style={{ color: '#AAAAAA', fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 500 }}
                  >
                    {service.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-block px-10 py-4 rounded-full font-semibold text-lg tracking-wider uppercase transition-all duration-300 hover:opacity-90"
            style={{
              backgroundColor: '#C5856A',
              color: '#FFFFFF',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
            }}
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
