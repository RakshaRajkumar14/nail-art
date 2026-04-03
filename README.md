# Nail Art Booking Website - Complete Documentation

**Project Status**: ✅ Production Ready
**Tech Stack**: Next.js 14 | React 18 | Supabase | Tailwind CSS | TypeScript
**Last Updated**: 2026-04-02

---

## 📑 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Setup & Installation](#setup--installation)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Development](#development)
7. [Building & Deployment](#building--deployment)
8. [Features & Components](#features--components)
9. [API Documentation](#api-documentation)
10. [Admin Panel](#admin-panel)
11. [Security](#security)
12. [Performance](#performance)
13. [Testing](#testing)
14. [Troubleshooting](#troubleshooting)
15. [Maintenance](#maintenance)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)
- Vercel account (for deployment)

### Installation (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Setup database
# See Database Setup section below

# 4. Start development server
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

---

## 📋 Project Overview

### What You Get
- **Premium Portfolio Website**: Luxury brand aesthetic with rose gold design
- **Full Booking System**: 5-step booking flow with calendar & time slots
- **Admin Dashboard**: Complete service & booking management
- **Gallery**: Image management with lightbox and filters
- **WhatsApp Integration**: Floating button for direct contact
- **Email Notifications**: Booking confirmations & reminders
- **Mobile Responsive**: Works perfectly on all devices
- **SEO Optimized**: Sitemap, robots.txt, meta tags
- **Performance Optimized**: Service workers, image optimization, code splitting

### Architecture
```
nail-art/
├── pages/              # Next.js pages & API routes
├── components/         # React components (17 total)
├── lib/               # Utilities, hooks, database client
├── styles/            # Global CSS & Tailwind config
├── public/            # Static assets, service worker
├── __tests__/         # Test suites (100+ tests)
├── database/          # SQL schema for Supabase
└── scripts/           # Deployment & validation scripts
```

---

## 🔧 Setup & Installation

### Step 1: Clone & Install

```bash
git clone <your-repo-url> nail-art-booking
cd nail-art-booking
npm install
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API Keys
4. Copy `URL` and `anon key`
5. Also get the `service_role key`

### Step 3: Setup Database

In Supabase SQL Editor, run this script:

```sql
-- Services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  duration_minutes INT DEFAULT 60,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  service_id UUID REFERENCES services(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  total_price NUMERIC(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies (public read, admin write)
CREATE POLICY services_read ON services FOR SELECT USING (true);
CREATE POLICY bookings_read ON bookings FOR SELECT USING (true);
```

See `DATABASE_SETUP.md` for complete schema.

---

## 🌍 Environment Variables

Create `.env.local` with these variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin
ADMIN_SECRET=your-secure-admin-password

# Email (choose one)
RESEND_API_KEY=your-resend-key           # Recommended
# OR
SENDGRID_API_KEY=your-sendgrid-key

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890   # Country code + number

# OpenAI (optional for AI features)
OPENAI_API_KEY=your-openai-key

# Deployment
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

### Validation
```bash
npm run validate-env  # Check all variables are set correctly
```

---

## 💾 Database Setup

### Supabase Configuration

1. **Enable Authentication** (if needed)
   - Go to Authentication → Providers
   - Enable Email for login

2. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Services: Public read access
   - Bookings: Public insert/read, admin update/delete

3. **Backups**
   - Supabase provides daily backups (free)
   - Manual backups available in project settings

### Running Migration
```bash
# Import SQL schema
supabase db push  # If using Supabase CLI

# Or manually:
# 1. Open Supabase Dashboard
# 2. Go to SQL Editor
# 3. Create new query
# 4. Paste content from database/schema.sql
# 5. Run Query
```

---

## 🧪 Development

### Available Scripts

```bash
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm run start            # Run production build
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run typecheck        # TypeScript type checking

# Testing
npm run test             # Jest tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run e2e              # Playwright tests
npm run e2e:ui           # E2E with UI
npm run e2e:debug        # Debug E2E tests
npm run e2e:report       # View test report

# Pre-deployment
npm run pre-deploy       # Full validation (lint + tests + env)
npm run build-analyze    # Bundle size analysis
```

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes**
   - Edit files in `pages/`, `components/`, etc.
   - Dev server auto-reloads on save

3. **Test Locally**
   ```bash
   npm run test              # Unit tests
   npm run e2e               # E2E tests
   npm run lint              # Check code quality
   ```

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   ```

5. **Create Pull Request**
   - Tests run automatically via GitHub Actions
   - Preview deployed to Vercel preview URL

---

## 🚀 Building & Deployment

### Local Production Build

```bash
npm run build-production   # Build for production
npm run start-production   # Run production build locally
```

### Vercel Deployment

#### Option 1: Git Auto-Deploy (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Configure environment variables in Vercel dashboard
5. Click Deploy

Auto-deploys on every push to `main` branch.

#### Option 2: Manual Deploy via CLI

```bash
npm install -g vercel      # Install once

# First-time setup
vercel                      # Follow prompts

# Deploy
vercel --prod              # Production deployment
vercel                      # Preview deployment
```

### Deployment Checklist

- [ ] All tests pass (`npm run test:all`)
- [ ] Environment variables set in Vercel
- [ ] Database backups created
- [ ] Domain configured (DNS settings)
- [ ] SSL certificate generated (automatic on Vercel)
- [ ] Branch protection rules enabled
- [ ] CI/CD workflow active

---

## 🎨 Features & Components

### Core Features

#### 1. Booking System
- **5-Step Booking Flow**
  - Step 1: Select service
  - Step 2: Choose date
  - Step 3: Select time slot
  - Step 4: Enter customer details
  - Step 5: Confirm & review

- **Smart Calendar**
  - Prevents past date selection
  - Shows available time slots
  - Real-time availability checking

- **Time Slot Management**
  - 30/60-minute slots
  - Lunch break support
  - Holiday exclusion

#### 2. Gallery
- Image upload & management
- Lightbox viewer
- Category filtering
- Mobile optimization

#### 3. Admin Dashboard
- Service management (CRUD)
- Booking status tracking
- Customer information
- Revenue analytics
- Email notifications

#### 4. Integrations
- **WhatsApp**: Floating button with pre-filled messages
- **Email**: Booking confirmations via Resend/SendGrid
- **Google Maps**: Location display
- **OpenAI**: AI-powered recommendations (optional)

### Components (17 total)

**Layout Components:**
- `Navigation` - Header with logo & menu
- `Footer` - Footer with links & contact
- `ErrorBoundary` - Error handling wrapper

**Content Components:**
- `Hero` - Landing section with CTA
- `Services` - Service showcase
- `Gallery` - Image gallery with filters
- `Testimonials` - Customer reviews
- `GoogleMapsEmbed` - Location map
- `SuccessConfirmation` - Booking confirmation screen

**Booking Components:**
- `BookingForm` - Main booking container
- `ServiceSelector` - Service selection step
- `DatePicker` - Calendar & date selection
- `TimeSlotSelector` - Time slot selection
- `CustomerDetails` - Contact form
- `BookingSummary` - Order review
- `BookingNavigation` - Step navigation

**UI Components:**
- `LoadingSpinner` - Loading indicator
- `WhatsAppButton` - Floating chat button

---

## 📡 API Documentation

### Endpoints

#### Services
```
GET    /api/services           # Get all services
GET    /api/services/[id]      # Get service by ID
POST   /api/services           # Create service (admin)
PUT    /api/services/[id]      # Update service (admin)
DELETE /api/services/[id]      # Delete service (admin)
```

#### Bookings
```
GET    /api/bookings           # Get all bookings
GET    /api/bookings/[id]      # Get booking by ID
POST   /api/bookings           # Create booking
PUT    /api/bookings/[id]      # Update booking (admin)
DELETE /api/bookings/[id]      # Delete booking (admin)
```

#### Time Management
```
GET    /api/available-times    # Get available slots
```

#### Email
```
POST   /api/send-email         # Send email notification
```

#### AI Features
```
POST   /api/ai/caption         # Generate image captions
POST   /api/ai/chat            # AI chat responses
POST   /api/ai/recommendations # Service recommendations
```

#### SEO
```
GET    /api/sitemap.xml        # Dynamic sitemap
GET    /api/robots.txt         # Dynamic robots.txt
```

### Example Usage

```javascript
// Fetch services
const response = await fetch('/api/services');
const services = await response.json();

// Create booking
const booking = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    serviceId: 'uuid-here',
    bookingDate: '2026-05-15',
    bookingTime: '14:00'
  })
});
```

---

## ⚙️ Admin Panel

### Admin Dashboard Features

**URL**: `/admin` (protected with ADMIN_SECRET)

### Accessing Admin

1. Navigate to `/admin`
2. Enter `ADMIN_SECRET` from environment
3. Access dashboard

### Admin Functions

#### Services Management
- View all services
- Add new service with image
- Edit existing services
- Delete services
- View service bookings

#### Bookings Management
- View all bookings
- Filter by status (pending, confirmed, completed, cancelled)
- Update booking status
- Send email reminders
- Cancel bookings

#### Reports
- Revenue by month
- Bookings by service
- Peak booking times
- Customer insights

#### Settings
- Email notification preferences
- Business hours
- Holiday configuration
- Payment settings

---

## 🔒 Security

### Implemented Security Measures

#### 1. Authentication
- Admin route protection via secret
- Supabase RLS (Row Level Security)
- JWT token validation

#### 2. Data Protection
- HTTPS only (enforced on Vercel)
- Environment variables never in code
- Sensitive keys in `.env.local` (git-ignored)
- Service role key never exposed to frontend

#### 3. Input Validation
- Email format validation
- Date/time validation
- Required field checking
- SQL injection prevention via Supabase

#### 4. Rate Limiting
- API rate limiting via Vercel
- Email sending throttling
- Booking frequency limits

#### 5. Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

### Best Practices

1. **Never commit `.env.local`**
   ```bash
   # Already in .gitignore
   ```

2. **Rotate secrets regularly**
   - Change ADMIN_SECRET monthly
   - Regenerate API keys quarterly

3. **Use strong passwords**
   - Admin secret: 32+ characters
   - Supabase passwords: complex mix

4. **Monitor access logs**
   - Check Supabase auth logs
   - Review Vercel analytics

5. **Enable CORS properly**
   - Only allow trusted domains
   - Already configured in `next.config.js`

---

## ⚡ Performance

### Optimization Features

#### 1. Image Optimization
- Next.js Image component with lazy loading
- WebP/AVIF support
- Automatic compression
- Responsive srcset

#### 2. Code Splitting
- Automatic route-based splitting
- Vendor chunk optimization
- React-specific chunks

#### 3. Caching Strategy
- Service Worker: Cache-first for images
- API responses: Network-first with fallback
- HTML: Stale-while-revalidate

#### 4. Database
- Indexed queries
- Efficient filtering
- Connection pooling

#### 5. API Performance
- Supabase real-time (optional)
- Pagination support
- Request caching headers

### Performance Targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Monitor Performance

```bash
# Build analysis
npm run build-analyze

# Check bundle size
npm run build

# Lighthouse in Chrome DevTools
# Cmd+Shift+P → Lighthouse
```

---

## 🧪 Testing

### Test Coverage

- **Unit Tests**: Components, utilities (Jest)
- **Integration Tests**: API endpoints
- **E2E Tests**: User workflows (Playwright)
- **Coverage Target**: 80% lines

### Running Tests

```bash
# All tests
npm run test:all            # Lint + unit + E2E

# Unit tests
npm run test               # Run once
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage report

# E2E tests
npm run e2e               # Run all browsers
npm run e2e:ui            # Interactive UI
npm run e2e:debug         # Debug mode
npm run e2e:report        # View HTML report
```

### Writing Tests

**Jest Example:**
```javascript
describe('BookingForm', () => {
  it('should render form fields', () => {
    const { getByLabelText } = render(<BookingForm />);
    expect(getByLabelText(/email/i)).toBeInTheDocument();
  });
});
```

**Playwright Example:**
```javascript
test('booking flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Book Now');
  await page.fill('input[name="email"]', 'test@test.com');
  await page.click('button:has-text("Next")');
});
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port 3000 Already in Use
```bash
# Kill process using port 3000
# macOS/Linux:
lsof -ti :3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Database Connection Error
```
Error: Invalid Supabase credentials
```
**Fix:**
1. Check `NEXT_PUBLIC_SUPABASE_URL` format
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
3. Ensure database tables exist

#### Email Not Sending
```
Error: Email API key invalid
```
**Fix:**
1. Verify `RESEND_API_KEY` is set
2. Check email template syntax
3. Review email logs in Resend dashboard

#### Tests Timing Out
```
Error: Timed out waiting 60000ms from config.webServer
```
**Fix:**
```bash
# Kill all Node processes
pkill -9 node

# Clear .next cache
rm -rf .next

# Restart tests
npm run e2e
```

#### Build Failures
```bash
# Clear everything and rebuild
rm -rf node_modules .next
npm install
npm run build
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Debug tests
npm run test:debug

# Debug E2E
npm run e2e:debug
```

---

## 🛠️ Maintenance

### Daily Tasks
- Monitor booking requests
- Check email delivery
- Review analytics

### Weekly Tasks
- Test booking flow
- Check admin dashboard
- Review error logs
- Backup database

### Monthly Tasks
- Update dependencies
- Rotate admin secret
- Review performance metrics
- Analyze customer feedback

### Quarterly Tasks
- Security audit
- Performance optimization review
- Update deployment configuration
- Regenerate API keys

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm install package-name@latest

# Security audit
npm audit
npm audit fix
```

### Database Maintenance

```sql
-- Analyze performance
ANALYZE;

-- Vacuum and optimize
VACUUM ANALYZE;

-- Check table sizes
SELECT schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
```

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 📄 File Structure

```
nail-art/
├── pages/
│   ├── _app.tsx              # App wrapper & layout
│   ├── _document.tsx         # Custom HTML
│   ├── index.tsx             # Home page
│   ├── services.tsx          # Services listing
│   ├── gallery.tsx           # Gallery page
│   ├── about.tsx             # About page
│   ├── contact.tsx           # Contact page
│   ├── book.tsx              # Booking page
│   ├── admin/
│   │   ├── index.tsx         # Admin dashboard
│   │   ├── services.tsx      # Service management
│   │   ├── bookings.tsx      # Booking management
│   │   └── reports.tsx       # Analytics & reports
│   └── api/
│       ├── services.ts       # Services endpoints
│       ├── bookings.ts       # Bookings endpoints
│       ├── available-times.ts
│       ├── send-email.ts
│       ├── sitemap.ts
│       ├── robots.ts
│       └── ai/               # AI endpoints
├── components/
│   ├── Navigation.tsx        # Header
│   ├── Hero.tsx              # Landing section
│   ├── Gallery.tsx           # Gallery component
│   ├── Testimonials.tsx      # Reviews section
│   ├── GoogleMapsEmbed.tsx   # Map component
│   ├── WhatsAppButton.tsx    # Chat button
│   ├── ErrorBoundary.tsx     # Error handler
│   ├── LoadingSpinner.tsx    # Loading UI
│   ├── SuccessConfirmation.tsx
│   ├── admin/                # Admin components
│   │   ├── ServiceForm.tsx
│   │   ├── BookingList.tsx
│   │   └── Reports.tsx
│   └── booking/              # Booking form steps
│       ├── BookingForm.tsx
│       ├── ServiceSelector.tsx
│       ├── DatePicker.tsx
│       ├── TimeSlotSelector.tsx
│       ├── CustomerDetails.tsx
│       ├── BookingSummary.tsx
│       └── BookingNavigation.tsx
├── lib/
│   ├── supabaseClient.ts     # Supabase setup
│   ├── emailService.ts       # Email logic
│   ├── bookingService.ts     # Booking utilities
│   ├── validationHooks.ts    # Form validation
│   └── types.ts              # TypeScript types
├── styles/
│   ├── globals.css           # Global styles
│   └── tailwind.config.js    # Tailwind config
├── public/
│   ├── sw.js                 # Service worker
│   ├── offline.html          # Offline page
│   ├── robots.txt            # SEO robots
│   └── images/               # Static images
├── database/
│   └── schema.sql            # Database schema
├── __tests__/
│   ├── components.test.tsx
│   ├── api.test.ts
│   ├── booking.test.ts
│   └── e2e/                  # Playwright tests
├── jest.config.js            # Jest configuration
├── playwright.config.ts      # Playwright config
├── tailwind.config.js        # Tailwind config
├── tsconfig.json             # TypeScript config
├── next.config.js            # Next.js config
├── package.json              # Dependencies
├── vercel.json               # Vercel deployment
└── README.md                 # This file
```

---

## ✨ Quick Tips

1. **Modify Colors**
   - Edit `tailwind.config.js`: `rose-gold` #E6B7A9
   - Primary: Rose gold, Secondary: Cream #FAF7F4

2. **Add New Service**
   - Admin dashboard → Services → Add New
   - Or via API: `POST /api/services`

3. **Change Booking Hours**
   - Edit `lib/bookingService.ts`
   - Modify `BUSINESS_HOURS` object

4. **Update Contact Info**
   - Environment variables
   - Component props
   - Database values

5. **Enable WhatsApp**
   - Set `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - Button appears automatically

6. **Add New Page**
   - Create `pages/newpage.tsx`
   - Add to navigation component
   - Update sitemap

---

## 📝 License & Credits

This project was built with:
- **Next.js 14** - React framework
- **Supabase** - Database & auth
- **Tailwind CSS** - Styling
- **Vercel** - Hosting & CDN

---

**Happy booking! 🎀**
