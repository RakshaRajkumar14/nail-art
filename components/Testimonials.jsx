import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Bride',
      text: 'My bridal nails were absolutely stunning! The artist listened to every detail and created a masterpiece. I felt so beautiful on my wedding day.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100',
    },
    {
      name: 'Jessica Chen',
      role: 'Regular Client',
      text: 'I visit Elegance Nails every two weeks. The quality is consistently excellent, and the team is so professional and welcoming.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100',
    },
    {
      name: 'Emma Thompson',
      role: 'Special Event',
      text: 'The custom gel design I got here was beyond my expectations. Everyone at the gala commented on my nails. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100',
    },
    {
      name: 'Rachel Davis',
      role: 'Weekly Client',
      text: 'Best nail salon in the city. The attention to detail is unmatched, and the prices are fair. I am a loyal customer for life!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1517849845537-1d51a20414de?w=100&h=100',
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 px-4" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl font-bold mb-4"
            style={{ color: '#1E1E1E', fontFamily: 'Playfair Display' }}
          >
            Love From Our Clients
          </h2>
          <p className="text-lg" style={{ color: '#777777', fontFamily: 'Inter' }}>
            Hear what our happy customers have to say about their experience
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Testimonial Card */}
          <div
            className="rounded-xl p-8 md:p-12 text-center transition-all duration-300"
            style={{
              backgroundColor: '#FAF7F4',
              minHeight: '280px',
            }}
          >
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {Array(testimonials[currentIndex].rating)
                .fill()
                .map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    style={{
                      color: '#E6B7A9',
                      fill: '#E6B7A9',
                    }}
                  />
                ))}
            </div>

            {/* Quote Text */}
            <p
              className="text-xl md:text-2xl mb-8 italic"
              style={{ color: '#1E1E1E', fontFamily: 'Playfair Display' }}
            >
              "{testimonials[currentIndex].text}"
            </p>

            {/* Author Info */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover border-4"
                style={{ borderColor: '#E6B7A9' }}
              />
              <div>
                <p
                  className="font-bold text-lg"
                  style={{ color: '#1E1E1E', fontFamily: 'Playfair Display' }}
                >
                  {testimonials[currentIndex].name}
                </p>
                <p
                  className="text-sm"
                  style={{ color: '#777777', fontFamily: 'Inter' }}
                >
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full transition-all duration-300 hover:shadow-lg transform hover:scale-110"
              style={{
                backgroundColor: '#E6B7A9',
                color: '#FAF7F4',
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full transition-all duration-300 hover:shadow-lg transform hover:scale-110"
              style={{
                backgroundColor: '#E6B7A9',
                color: '#FAF7F4',
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: index === currentIndex ? '#E6B7A9' : '#DDD',
                }}
              />
            ))}
          </div>
        </div>

        {/* Grid Alternative View (for smaller screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-lg p-6 hover:shadow-lg transition-all"
              style={{
                backgroundColor: '#FAF7F4',
                display: index < 2 ? 'block' : 'none',
              }}
            >
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating)
                  .fill()
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      style={{
                        color: '#E6B7A9',
                        fill: '#E6B7A9',
                      }}
                    />
                  ))}
              </div>
              <p className="text-sm mb-4" style={{ color: '#1E1E1E', fontFamily: 'Inter' }}>
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1E1E1E', fontFamily: 'Inter' }}>
                    {testimonial.name}
                  </p>
                  <p className="text-xs" style={{ color: '#777777', fontFamily: 'Inter' }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
