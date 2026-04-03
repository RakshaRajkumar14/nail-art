import React from 'react';
import Link from 'next/link';
import ServiceCard from './ServiceCard';

export default function FeaturedServices() {
  const services = [
    {
      title: 'Classic Manicure',
      description: 'Traditional manicure with cuticle care, hand massage, and polish application',
      image: 'https://images.unsplash.com/photo-1604654896304-c46e2ccad7aa?w=400&h=400',
      price: 45,
      duration: '60 min',
    },
    {
      title: 'Gel Extensions',
      description: 'Long-lasting gel extensions with custom shapes and vibrant color options',
      image: 'https://images.unsplash.com/photo-1610692957206-c7c5aae46ef9?w=400&h=400',
      price: 75,
      duration: '90 min',
    },
    {
      title: 'Bridal Nails',
      description: 'Stunning bridal nail design with crystals, gems, and premium finishes',
      image: 'https://images.unsplash.com/photo-1604697261474-455dc6250117?w=400&h=400',
      price: 120,
      duration: '120 min',
    },
  ];

  return (
    <section id="services" className="py-20 px-4" style={{ backgroundColor: '#FAF7F4' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl font-bold mb-4"
            style={{ color: '#1E1E1E', fontFamily: 'Playfair Display' }}
          >
            Featured Services
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#777777', fontFamily: 'Inter' }}>
            Discover our most popular nail care and design services, carefully curated for maximum elegance and
            satisfaction
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: '#E6B7A9',
              color: '#FAF7F4',
              fontFamily: 'Inter',
            }}
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
