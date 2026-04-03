import React from 'react';

export default function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  message = 'Loading...',
  overlay = true
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-4"
          style={{
            borderColor: 'rgba(230, 183, 169, 0.2)',
          }}
        />

        {/* Spinning ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-t-4 animate-spin"
          style={{
            borderColor: 'transparent',
            borderTopColor: '#E6B7A9',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>

      {message && (
        <p
          className="text-center"
          style={{
            color: '#777777',
            fontFamily: 'Inter',
            fontSize: '0.875rem',
          }}
        >
          {message}
        </p>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          overlay ? 'backdrop-blur-sm' : ''
        }`}
        style={{
          backgroundColor: overlay ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
        }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * SKELETON SCREEN COMPONENT
 * ========================
 * Shows placeholder content while loading
 */
export function SkeletonScreen({ count = 3, type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg p-4 space-y-4"
            style={{ backgroundColor: '#F5F5F5' }}
          >
            <div
              className="h-40 rounded-lg animate-pulse"
              style={{ backgroundColor: '#E0E0E0' }}
            />
            <div
              className="h-4 rounded animate-pulse"
              style={{ backgroundColor: '#E0E0E0' }}
            />
            <div
              className="h-4 rounded animate-pulse w-2/3"
              style={{ backgroundColor: '#E0E0E0' }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`h-4 rounded animate-pulse ${i === count - 1 ? 'w-2/3' : ''}`}
            style={{ backgroundColor: '#E0E0E0' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="h-48 rounded-lg animate-pulse"
        style={{ backgroundColor: '#E0E0E0' }}
      />
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded animate-pulse"
            style={{ backgroundColor: '#E0E0E0' }}
          />
        ))}
      </div>
    </div>
  );
}
