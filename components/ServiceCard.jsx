import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function ServiceCard({ title, description, image, price, duration }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer"
      style={{
        transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 40px rgba(230, 183, 169, 0.2)' : '0 10px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#FFFFFF',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Desktop: Horizontal layout */}
      <div className="hidden md:flex">
        {/* Image (Left) */}
        <div className="w-40 h-40 flex-shrink-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>

        {/* Content (Center) */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: '#1E1E1E', fontFamily: 'Playfair Display' }}
          >
            {title}
          </h3>
          <p className="text-sm mb-4" style={{ color: '#777777', fontFamily: 'Inter' }}>
            {description}
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm" style={{ color: '#777777', fontFamily: 'Inter' }}>
                {duration}
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: '#E6B7A9', fontFamily: 'Inter' }}
              >
                ${price}
              </p>
            </div>
          </div>
        </div>

        {/* Add Button (Right) */}
        <div className="p-6 flex items-center">
          <button
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
            style={{
              backgroundColor: '#E6B7A9',
              color: '#FAF7F4',
            }}
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Mobile: Vertical layout */}
      <div className="md:hidden">
        <div className="h-32 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: '#1E1E1E', fontFamily: 'Playfair Display' }}
          >
            {title}
          </h3>
          <p className="text-sm mb-3" style={{ color: '#777777', fontFamily: 'Inter' }}>
            {description}
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs" style={{ color: '#777777', fontFamily: 'Inter' }}>
                {duration}
              </p>
              <p
                className="text-base font-bold"
                style={{ color: '#E6B7A9', fontFamily: 'Inter' }}
              >
                ${price}
              </p>
            </div>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: '#E6B7A9',
                color: '#FAF7F4',
              }}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
