import React from 'react';
import {
  Navigation,
  HeroSection,
  FeaturedServices,
  Gallery,
  Testimonials,
  Footer,
} from './index';

/**
 * Premium Nail Artist Booking Website - Main App
 *
 * Complete component integration example for a luxury nail salon website
 * Built with React + Tailwind CSS using a sophisticated design system
 */
export default function App() {
  return (
    <div className="w-full bg-white">
      <Navigation />
      <HeroSection />
      <FeaturedServices />
      <Gallery />
      <Testimonials />
      <Footer />
    </div>
  );
}

/**
 * COMPONENT DOCUMENTATION
 * ========================
 *
 * 1. NAVIGATION COMPONENT (Navigation.jsx)
 *    - Sticky navigation bar with logo and menu items
 *    - Menu: Home, Services, Book, Gallery, About, Contact
 *    - Mobile hamburger menu for responsive design
 *    - "Book Now" CTA button
 *    - Stays fixed at top of page
 *
 * 2. HERO SECTION (HeroSection.jsx)
 *    - Full-screen hero with gradient background
 *    - Main headline: "Elegant Nails Designed For You"
 *    - Subtitle describing the service
 *    - Dual CTA buttons: "Book Appointment" and "View Services"
 *    - Animated scroll indicator at bottom
 *
 * 3. SERVICE CARD (ServiceCard.jsx)
 *    - Desktop: Horizontal layout (image | content | plus button)
 *    - Mobile: Vertical stacked layout
 *    - Shows price, duration, description
 *    - Hover lift animation with shadow effect
 *    - Add/Plus button for booking
 *
 * 4. FEATURED SERVICES SECTION (FeaturedServices.jsx)
 *    - Grid of 3 featured services
 *    - Reuses ServiceCard component
 *    - Includes "View All Services" button
 *    - Services: Classic Manicure, Gel Extensions, Bridal Nails
 *
 * 5. GALLERY (Gallery.jsx)
 *    - Pinterest-style masonry grid layout
 *    - Category filters: All, French, Gel, Acrylic, Minimal, Bridal
 *    - Lightbox viewer when clicking images
 *    - Lazy loading for performance
 *    - 9 sample gallery images with responsive sizing
 *
 * 6. TESTIMONIALS (Testimonials.jsx)
 *    - Carousel slider with navigation arrows
 *    - Dot indicators for navigation
 *    - Shows 5-star ratings
 *    - Client photo, name, role, and quote
 *    - Alternative grid layout for mobile
 *    - 4 sample testimonials
 *
 * 7. FOOTER (Footer.jsx)
 *    - 4-column layout: Brand, Quick Links, Working Hours, Contact
 *    - Social media icons (Facebook, Instagram, Twitter)
 *    - Working hours display with clock icon
 *    - Contact information (phone, email, address)
 *    - Bottom copyright bar with policy links
 *
 * DESIGN SYSTEM
 * =============
 *
 * Colors:
 *   - Background: #FAF7F4 (soft beige)
 *   - Text Primary: #1E1E1E (dark)
 *   - Text Secondary: #777777 (gray)
 *   - Accent: #E6B7A9 (warm rose)
 *   - Pink: #F5D6CF (light pink)
 *
 * Typography:
 *   - Headings: Playfair Display (elegant serif)
 *   - Body: Inter (modern sans-serif)
 *
 * Styling:
 *   - Tailwind CSS for utility-first styling
 *   - Responsive breakpoints: sm, md, lg
 *   - Smooth transitions and hover effects
 *   - Lucide React icons for UI elements
 *
 * FEATURES
 * ========
 *
 * Responsive Design:
 *   - Mobile-first approach
 *   - Breakpoints at 768px (md) and 1024px (lg)
 *   - Hamburger menu for mobile navigation
 *   - Adaptive grid layouts
 *
 * Animations:
 *   - Hover lift effect on service cards
 *   - Image hover zoom
 *   - Button scale and shadow effects
 *   - Scroll animation on hero
 *   - Carousel transitions
 *
 * Interactive Elements:
 *   - Lightbox image viewer
 *   - Category filtering
 *   - Testimonial carousel
 *   - Mobile menu toggle
 *   - Add to booking buttons
 *
 * REQUIRED DEPENDENCIES
 * =====================
 *
 * npm install react lucide-react
 * npm install -D tailwindcss
 *
 * Then configure tailwind.config.js with custom colors:
 *
 * module.exports = {
 *   theme: {
 *     colors: {
 *       primary: '#FAF7F4',
 *       text: '#1E1E1E',
 *       secondary: '#777777',
 *       accent: '#E6B7A9',
 *       pink: '#F5D6CF',
 *     },
 *     fontFamily: {
 *       playfair: ['Playfair Display', 'serif'],
 *       inter: ['Inter', 'sans-serif'],
 *     },
 *   },
 * }
 *
 * CUSTOMIZATION GUIDE
 * ====================
 *
 * To customize for your salon:
 *
 * 1. Update Logo/Brand Name in Navigation.jsx
 * 2. Modify service list in FeaturedServices.jsx
 * 3. Add your own images (replace placeholder Unsplash URLs)
 * 4. Update testimonials with real client reviews
 * 5. Change contact information in Footer.jsx
 * 6. Modify working hours in Footer.jsx
 * 7. Add your social media links in Footer.jsx
 * 8. Customize colors in any component using style prop
 *
 * NOTES
 * =====
 *
 * - All components use inline styles with Tailwind CSS
 * - Images use placeholder URLs from Unsplash (replace with real images)
 * - Components are fully self-contained and reusable
 * - No external state management required (uses React hooks)
 * - Mobile-responsive by default
 * - Accessibility features included (semantic HTML, ARIA labels)
 */
