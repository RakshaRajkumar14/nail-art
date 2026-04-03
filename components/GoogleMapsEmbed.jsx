import React, { useState } from 'react';
import { Clock, MapPin } from 'lucide-react';

export default function GoogleMapsEmbed({
  latitude = 40.7128,
  longitude = -74.0060,
  zoom = 15,
  title = 'Elegance Nails',
  address = '123 Elegance Street, Beautiful City, BC 12345',
  showHoursOverlay = true,
  showDirectionsButton = true,
  height = '400px',
}) {
  const [isLoading, setIsLoading] = useState(true);

  const mapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.0!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i${1024 * zoom}!2i${768 * zoom}!4f13.1!3m3!1m2!1s${encodeURIComponent(address)}!2zElegance%20Nails!5e0!3m2!1sen!2sus!4v1234567890`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="w-full space-y-4">
      {/* Map Container */}
      <div
        className="relative w-full rounded-lg overflow-hidden shadow-lg"
        style={{ height }}
      >
        {/* Loading State */}
        {isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ backgroundColor: '#F5F5F5' }}
          >
            <div className="text-center">
              <div className="animate-pulse mb-2" style={{ color: '#E6B7A9' }}>
                <MapPin size={32} className="mx-auto" />
              </div>
              <p style={{ color: '#777777', fontFamily: 'Inter' }}>Loading map...</p>
            </div>
          </div>
        )}

        {/* Map Iframe */}
        <iframe
          src={mapsUrl}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoading(false)}
          title={`Map of ${title}`}
        />

        {/* Hours Overlay - Desktop */}
        {showHoursOverlay && (
          <div
            className="hidden md:block absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs"
            style={{ fontFamily: 'Inter' }}
          >
            <h4
              className="font-semibold mb-3 flex items-center gap-2"
              style={{ color: '#1E1E1E' }}
            >
              <Clock size={18} style={{ color: '#E6B7A9' }} />
              {title}
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <p style={{ color: '#777777' }}>Mon - Fri</p>
                <p style={{ color: '#1E1E1E' }} className="font-semibold">
                  9:00 AM - 7:00 PM
                </p>
              </div>
              <div>
                <p style={{ color: '#777777' }}>Saturday</p>
                <p style={{ color: '#1E1E1E' }} className="font-semibold">
                  10:00 AM - 6:00 PM
                </p>
              </div>
              <div>
                <p style={{ color: '#777777' }}>Sunday</p>
                <p style={{ color: '#1E1E1E' }} className="font-semibold">
                  Closed
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address and Directions - Below Map */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div style={{ fontFamily: 'Inter' }}>
          <h4
            className="font-semibold mb-1"
            style={{ color: '#1E1E1E' }}
          >
            {title}
          </h4>
          <p className="flex items-start gap-2" style={{ color: '#777777', fontSize: '0.875rem' }}>
            <MapPin size={16} style={{ marginTop: '2px', color: '#E6B7A9', flexShrink: 0 }} />
            <span>{address}</span>
          </p>
        </div>

        {showDirectionsButton && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg whitespace-nowrap flex-shrink-0"
            style={{
              backgroundColor: '#E6B7A9',
              color: '#FAF7F4',
              fontFamily: 'Inter',
            }}
          >
            Get Directions
          </a>
        )}
      </div>

      {/* Mobile Hours Overlay */}
      {showHoursOverlay && (
        <div
          className="md:hidden p-4 rounded-lg"
          style={{ backgroundColor: '#FAF7F4' }}
        >
          <h4
            className="font-semibold mb-3 flex items-center gap-2"
            style={{ color: '#1E1E1E', fontFamily: 'Inter' }}
          >
            <Clock size={18} style={{ color: '#E6B7A9' }} />
            Working Hours
          </h4>
          <div className="space-y-2 text-sm" style={{ fontFamily: 'Inter' }}>
            <div>
              <p style={{ color: '#777777' }}>Mon - Fri</p>
              <p style={{ color: '#1E1E1E' }} className="font-semibold">
                9:00 AM - 7:00 PM
              </p>
            </div>
            <div>
              <p style={{ color: '#777777' }}>Saturday</p>
              <p style={{ color: '#1E1E1E' }} className="font-semibold">
                10:00 AM - 6:00 PM
              </p>
            </div>
            <div>
              <p style={{ color: '#777777' }}>Sunday</p>
              <p style={{ color: '#1E1E1E' }} className="font-semibold">
                Closed
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * GOOGLE MAPS EMBED - ALTERNATIVE STATIC MAP
 * ============================================
 * Use this if embedded maps don't work for your region
 */
export function GoogleMapsStatic({
  latitude = 40.7128,
  longitude = -74.0060,
  zoom = 15,
  address = 'Elegance Nails, Beautiful City',
  height = '400px',
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        className="rounded-lg flex items-center justify-center"
        style={{ height, backgroundColor: '#F5F5F5' }}
      >
        <p style={{ color: '#777777', fontFamily: 'Inter', textAlign: 'center' }}>
          Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env
        </p>
      </div>
    );
  }

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=600x400&key=${apiKey}&markers=color:red%7C${latitude},${longitude}`;

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <img
        src={mapUrl}
        alt={`Map of ${address}`}
        className="w-full"
        style={{ height }}
      />
    </div>
  );
}
