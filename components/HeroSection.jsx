import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#FAF7F4' }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url(data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23E6B7A9;stop-opacity:0.3" /%3E%3Cstop offset="100%25" style="stop-color:%23F5D6CF;stop-opacity:0.3" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1200" height="600" fill="url(%23grad1)"/"%3E%3C/svg%3E)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Decorative circles */}
      <div
        className="absolute top-20 right-10 w-40 h-40 rounded-full opacity-10 z-0"
        style={{ backgroundColor: '#E6B7A9' }}
      />
      <div
        className="absolute bottom-20 left-10 w-60 h-60 rounded-full opacity-10 z-0"
        style={{ backgroundColor: '#F5D6CF' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        {/* Headline */}
        <h1
          className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
          style={{ color: '#1E1E1E', fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 700 }}
        >
          Shivya's Nail Studio
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl mb-8 font-light"
          style={{ color: '#444444', fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 600 }}
        >
          Experience luxury nail artistry with our award-winning artists. Your perfect manicure awaits.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book"
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 inline-block"
            style={{ backgroundColor: '#E6B7A9', color: '#FAF7F4', fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 700 }}
          >
            Book Appointment
            <ChevronRight size={20} />
          </Link>

          <Link
            href="/services"
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg border-2 hover:bg-opacity-10 inline-block"
            style={{
              backgroundColor: 'transparent',
              color: '#E6B7A9',
              borderColor: '#E6B7A9',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontWeight: 700,
            }}
          >
            View Services
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex justify-center animate-bounce">
          <svg
            className="w-6 h-6"
            style={{ color: '#E6B7A9' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
