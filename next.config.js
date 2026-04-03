/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Image Optimization
  images: {
    domains: [
      'yourdomain.supabase.co',
      'cdn.yourdomain.com',
      'images.unsplash.com',
      'localhost:3000',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // React Strict Mode for Development
  reactStrictMode: true,

  // SWC Minification for better performance
  swcMinify: true,

  // Compiler Options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },

  // Optimization: Code Splitting (use Next.js defaults)
  webpack: (config, { isServer }) => {
    return config;
  },

  // Environment Variables
  env: {
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/book-now',
        destination: '/book',
        permanent: true,
      },
      {
        source: '/booking',
        destination: '/book',
        permanent: true,
      },
      {
        source: '/admin-login',
        destination: '/admin',
        permanent: true,
      },
    ];
  },

  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/healthcheck',
        destination: '/api/health',
      },
    ];
  },

  // Experimental Features
  experimental: {
    // esmExternals: true,
    // isrMemoryCacheSize: 52 * 1024 * 1024, // 52 MB
  },

  // Production Source Maps (optional, disable for smaller builds)
  productionBrowserSourceMaps: false,

  // Compression
  compress: true,

  // Generate ETags
  generateEtags: true,

  // Power by header
  poweredByHeader: false,

  // Trailing slashes
  trailingSlash: false,

  // TypeScript
  typescript: {
    // Temporarily ignore TypeScript errors during builds
    ignoreBuildErrors: false,
  },

  // ESLint
  eslint: {
    // This allows build to succeed even if your project has ESLint errors
    ignoreDuringBuilds: false,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
