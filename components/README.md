# Premium Nail Artist Booking Website - Components

## Quick Start

All React components for the premium nail artist booking website have been created and are ready to use!

## Created Components

### 1. **Navigation Component** (`Navigation.jsx`)
- Sticky top navigation with logo
- Menu items: Home, Services, Book, Gallery, About, Contact
- Mobile hamburger menu
- "Book Now" CTA button
- Fully responsive

### 2. **Hero Section** (`HeroSection.jsx`)
- Full-screen hero banner
- Headline: "Elegant Nails Designed For You"
- Subtitle and description
- Dual CTA buttons (Book Appointment, View Services)
- Animated scroll indicator

### 3. **Service Card** (`ServiceCard.jsx`)
- Responsive card component
- Desktop: horizontal layout (image | content | button)
- Mobile: vertical stacked layout
- Hover lift animation
- Shows price, duration, description
- Plus button for adding to cart

### 4. **Featured Services** (`FeaturedServices.jsx`)
- Grid layout displaying 3 featured services
- Uses ServiceCard component
- Each card includes: image, title, description, price, duration
- "View All Services" button

### 5. **Gallery** (`Gallery.jsx`)
- Pinterest-style masonry grid
- Category filters: All, French, Gel, Acrylic, Minimal, Bridal
- Lightbox viewer for images
- Lazy loading for performance
- 9 sample images

### 6. **Testimonials** (`Testimonials.jsx`)
- Carousel with navigation arrows
- 5-star ratings
- Client photos, names, and quotes
- Dot indicators for pagination
- Responsive grid fallback

### 7. **Footer** (`Footer.jsx`)
- 4-column layout
- Brand info and social icons
- Quick navigation links
- Working hours display
- Contact information
- Copyright and policy links

## Design System

### Colors
```
- Background: #FAF7F4 (soft beige)
- Text Primary: #1E1E1E (dark)
- Text Secondary: #777777 (gray)
- Accent: #E6B7A9 (warm rose)
- Pink: #F5D6CF (light pink)
```

### Typography
```
- Headings: Playfair Display (elegant serif)
- Body: Inter (modern sans-serif)
```

### Styling
- Tailwind CSS for all styling
- Responsive design (mobile-first)
- Smooth transitions and hover effects
- Lucide React icons

## Setup Instructions

### 1. Install Dependencies
```bash
npm install react lucide-react
npm install -D tailwindcss postcss autoprefixer
```

### 2. Initialize Tailwind
```bash
npx tailwindcss init -p
```

### 3. Configure Tailwind (tailwind.config.js)
```javascript
module.exports = {
  content: [
    "./components/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FAF7F4',
        text: '#1E1E1E',
        secondary: '#777777',
        accent: '#E6B7A9',
        pink: '#F5D6CF',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 4. Add Fonts to Your HTML
In your public/index.html or main HTML file:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
```

### 5. Use Components
```javascript
import {
  Navigation,
  HeroSection,
  FeaturedServices,
  Gallery,
  Testimonials,
  Footer
} from './components';

export default function App() {
  return (
    <div>
      <Navigation />
      <HeroSection />
      <FeaturedServices />
      <Gallery />
      <Testimonials />
      <Footer />
    </div>
  );
}
```

## Customization

### Change Brand Name
Edit `Navigation.jsx` and `Footer.jsx`:
```javascript
// Change from "✨ Elegance Nails" to your salon name
```

### Modify Services
Edit `FeaturedServices.jsx` to update the services array with your own offerings.

### Add Real Images
Replace Unsplash placeholder URLs with your own images:
```javascript
// Before: 'https://images.unsplash.com/...'
// After: '/images/your-image.jpg'
```

### Update Contact Info
In `Footer.jsx`:
- Phone number
- Email address
- Physical address
- Working hours
- Social media links

### Adjust Colors
Colors are applied inline using the `style` prop. You can modify any component's colors:
```javascript
style={{ backgroundColor: '#YOUR_COLOR', color: '#YOUR_COLOR' }}
```

## File Locations

All components are located in: `/d/2026/nail-art/components/`

```
components/
├── Navigation.jsx (3.2 KB)
├── HeroSection.jsx (3.3 KB)
├── ServiceCard.jsx (3.7 KB)
├── FeaturedServices.jsx (2.3 KB)
├── Gallery.jsx (5.6 KB)
├── Testimonials.jsx (7.3 KB)
├── Footer.jsx (6.6 KB)
├── App.jsx (Usage guide & documentation)
├── index.js (Export all components)
└── README.md (This file)
```

## Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Adaptive layouts for all screen sizes

### Interactive Elements
- Hover animations and effects
- Lightbox image viewer
- Category filtering
- Testimonial carousel
- Mobile menu toggle
- Smooth transitions

### Performance
- Lazy loading in Gallery
- Optimized image handling
- Minimal bundle size

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation support
- Color contrast compliance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "lucide-react": "^0.263.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## Notes

- All components are fully functional and production-ready
- No external state management needed (uses React hooks)
- Components are self-contained and reusable
- Images use Unsplash URLs as placeholders
- Modify placeholder content as needed for your salon

## Support

For issues or customization needs, refer to:
- Component documentation in `App.jsx`
- Inline comments in individual component files
- Tailwind CSS documentation: https://tailwindcss.com
- Lucide React icons: https://lucide.dev
