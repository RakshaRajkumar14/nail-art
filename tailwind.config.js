/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'luxury-cream': '#FAF7A4',
        'luxury-dark': '#1E1E1E',
        'luxury-gray': '#777777',
        'luxury-rose': '#E6B7A9',
        'luxury-light-rose': '#F5D6CF',
        'luxury-white': '#FAF7F4',
        primary: '#d946a6',
        secondary: '#ec4899',
        accent: '#f97316',
        dark: '#1a1a1a',
        light: '#f8f8f8',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'luxury': '0 8px 30px rgba(230, 183, 169, 0.15)',
      },
      borderRadius: {
        'luxury': '12px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-in-out',
        'slideUp': 'slideUp 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(230, 183, 169, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(230, 183, 169, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
