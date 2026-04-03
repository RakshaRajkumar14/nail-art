import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lazyLoad, setLazyLoad] = useState({});

  const categories = ['All', 'French', 'Gel', 'Acrylic', 'Minimal', 'Bridal'];

  const galleryImages = [
    { id: 1, category: 'French', src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=600' },
    { id: 2, category: 'Gel', src: 'https://images.unsplash.com/photo-1610692957206-c7c5aae46ef9?w=500&h=400' },
    { id: 3, category: 'Acrylic', src: 'https://images.unsplash.com/photo-1604654896304-c46e2ccad7aa?w=500&h=600' },
    { id: 4, category: 'Minimal', src: 'https://images.unsplash.com/photo-1604654895122-c92c0e4b1c49?w=500&h=500' },
    { id: 5, category: 'Bridal', src: 'https://images.unsplash.com/photo-1604697261474-455dc6250117?w=500&h=700' },
    { id: 6, category: 'French', src: 'https://images.unsplash.com/photo-1604654897103-f2e5fc8b4ae6?w=500&h=550' },
    { id: 7, category: 'Gel', src: 'https://images.unsplash.com/photo-1604654898175-47fbec5e5b09?w=500&h=450' },
    { id: 8, category: 'Acrylic', src: 'https://images.unsplash.com/photo-1604654895050-e5b4b4a5e3f5?w=500&h=650' },
    { id: 9, category: 'Minimal', src: 'https://images.unsplash.com/photo-1604654896311-3d3fdc6a69c5?w=500&h=500' },
  ];

  const filteredImages =
    selectedCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  // Simulate lazy loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLazyLoad({});
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  return (
    <section id="gallery" className="py-20 px-4" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2
            className="text-5xl font-bold mb-4"
            style={{ color: '#1E1E1E', fontFamily: 'Playfair Display' }}
          >
            Our Gallery
          </h2>
          <p className="text-lg" style={{ color: '#777777', fontFamily: 'Inter' }}>
            Explore our stunning collection of nail art designs
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-6 py-2 rounded-full font-semibold transition-all duration-300"
              style={{
                backgroundColor: selectedCategory === category ? '#E6B7A9' : '#FAF7F4',
                color: selectedCategory === category ? '#FAF7F4' : '#1E1E1E',
                border: '2px solid',
                borderColor: '#E6B7A9',
                fontFamily: 'Inter',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-300 ${
                index % 3 === 0 ? 'md:col-span-1 lg:row-span-2' : ''
              }`}
              onClick={() => setSelectedImage(image)}
              style={{
                aspectRatio: index % 3 === 0 ? '1' : '1',
                opacity: lazyLoad[image.id] === false ? 0.5 : 1,
              }}
            >
              <img
                src={image.src}
                alt={`Gallery ${image.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <span className="text-white font-semibold" style={{ fontFamily: 'Inter' }}>
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt="Lightbox"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full transition-all hover:scale-110"
              style={{ backgroundColor: '#E6B7A9', color: '#FAF7F4' }}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </section>
  );
}
