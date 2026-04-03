/**
 * SETUP_GUIDE.md
 * Complete setup guide for the nail artist booking system
 */

# Complete Setup Guide

## Quick Start (5 minutes)

### 1. Create React App

```bash
npx create-react-app nail-art-booking --template typescript
cd nail-art-booking
```

### 2. Copy Booking System

```bash
# Copy the booking folder to your project
cp -r /d/2026/nail-art/components/booking src/components/
```

### 3. Update App.tsx

```tsx
import { BookingProvider, BookingComponent } from './components/booking';
import './App.css';

function App() {
  return (
    <BookingProvider>
      <BookingComponent />
    </BookingProvider>
  );
}

export default App;
```

### 4. Create .env file

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 5. Run the App

```bash
npm start
```

## Project Structure

```
nail-art-booking/
├── public/
├── src/
│   ├── components/
│   │   └── booking/
│   │       ├── types.ts
│   │       ├── utils.ts
│   │       ├── api.ts
│   │       ├── BookingContext.tsx
│   │       ├── BookingComponent.tsx
│   │       ├── ServiceSelection.tsx
│   │       ├── Calendar.tsx
│   │       ├── TimeSlotSelection.tsx
│   │       ├── CustomerDetailsForm.tsx
│   │       ├── ServiceCart.tsx
│   │       ├── ConfirmationModal.tsx
│   │       ├── *.module.css
│   │       ├── index.ts
│   │       ├── README.md
│   │       └── EXAMPLES.tsx
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── .env
├── package.json
└── tsconfig.json
```

## Environment Variables

Create `.env` file in root:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Optional: Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id

# Optional: Email Service
REACT_APP_SENDGRID_API_KEY=your-sendgrid-key
```

## Backend Setup (Node.js/Express)

### 1. Create Express Server

```bash
npm init -y
npm install express cors dotenv
npm install --save-dev typescript ts-node @types/node @types/express
```

### 2. Create server.ts

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Booking endpoint
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = req.body;

    // 1. Validate booking data
    if (!booking.services || !booking.date || !booking.timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // 2. Check time slot availability
    const isAvailable = await checkAvailability(
      booking.date,
      booking.timeSlot.time
    );

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is no longer available',
      });
    }

    // 3. Save to database
    const savedBooking = await saveBookingToDatabase(booking);

    // 4. Send confirmation email
    await sendConfirmationEmail(booking.customerDetails.email, savedBooking);

    // 5. Send SMS reminder
    await sendSMSReminder(booking.customerDetails.phone, savedBooking);

    res.json({
      success: true,
      message: 'Booking created successfully',
      bookingId: savedBooking.id,
      booking: savedBooking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get booked times for a specific date
app.get('/api/bookings/booked-times', async (req, res) => {
  try {
    const date = req.query.date as string;
    const bookedTimes = await getBookedTimesForDate(date);

    res.json({
      success: true,
      times: bookedTimes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booked times',
    });
  }
});

// Cancel a booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await cancelBooking(id);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to cancel booking',
    });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

// Helper functions (implement based on your database)
async function checkAvailability(date: string, time: string): Promise<boolean> {
  // Query your database
  return true;
}

async function saveBookingToDatabase(booking: any) {
  // Save to database
  return { ...booking, id: 'BOOKING-' + Date.now() };
}

async function sendConfirmationEmail(email: string, booking: any) {
  // Implement email sending
  console.log(`Email sent to ${email}`);
}

async function sendSMSReminder(phone: string, booking: any) {
  // Implement SMS sending
  console.log(`SMS sent to ${phone}`);
}

async function getBookedTimesForDate(date: string): Promise<string[]> {
  // Query database for booked times
  return [];
}

async function cancelBooking(id: string) {
  // Delete from database
}
```

### 3. Database Schema (MongoDB)

```javascript
// Booking Collection
{
  _id: ObjectId,
  customerDetails: {
    name: string,
    email: string,
    phone: string,
    notes: string,
  },
  services: [
    {
      id: string,
      name: string,
      duration: number,
      price: number,
    },
  ],
  date: Date,
  timeSlot: {
    time: string,
    id: string,
  },
  totalDuration: number,
  totalPrice: number,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  createdAt: Date,
  updatedAt: Date,
}
```

### 4. Database Schema (PostgreSQL)

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_notes TEXT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  total_duration INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking_services (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  service_id VARCHAR(50) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_duration INTEGER NOT NULL,
  service_price DECIMAL(10, 2) NOT NULL
);
```

## Customization

### Add Logo/Branding

```tsx
// App.tsx
import logo from './logo.png';

export function App() {
  return (
    <div className="app">
      <header>
        <img src={logo} alt="Salon Logo" />
        <h1>Nails & Beauty Studio</h1>
      </header>
      <BookingProvider>
        <BookingComponent />
      </BookingProvider>
    </div>
  );
}
```

### Change Colors

Create `src/theme.css`:

```css
:root {
  --primary: #667eea;
  --primary-dark: #764ba2;
  --success: #48bb78;
  --error: #fc8181;
  --gray-light: #f7fafc;
  --gray-dark: #2d3748;
}
```

Update component files to use CSS variables.

### Add Custom Animations

```css
/* Add to BookingComponent.module.css */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal {
  animation: fadeInScale 0.3s ease-out;
}
```

## Testing

### Unit Tests with Jest

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

```typescript
// ServiceSelection.test.tsx
import { render, screen } from '@testing-library/react';
import { BookingProvider } from './BookingContext';
import { ServiceSelection } from './ServiceSelection';

describe('ServiceSelection', () => {
  it('displays available services', () => {
    render(
      <BookingProvider>
        <ServiceSelection />
      </BookingProvider>
    );
    // Add assertions
  });
});
```

### E2E Tests with Cypress

```bash
npm install --save-dev cypress
npx cypress open
```

```typescript
// cypress/e2e/booking.cy.ts
describe('Booking Flow', () => {
  it('completes booking process', () => {
    cy.visit('http://localhost:3000');

    // Step 1: Select service
    cy.get('[data-testid="service-gel-mani"]').click();
    cy.contains('Continue to Date Selection').click();

    // Step 2: Select date
    cy.get('[data-testid="calendar-day-15"]').click();
    cy.contains('Continue to Time Selection').click();

    // Step 3: Select time
    cy.get('[data-testid="time-slot-1000"]').click();
    cy.contains('Continue to Details').click();

    // Step 4: Fill details
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="phone"]').type('5551234567');
    cy.contains('Review Booking').click();

    // Step 5: Confirm
    cy.contains('Confirm Booking').click();

    // Verify success
    cy.contains('Booking Confirmed!').should('be.visible');
  });
});
```

## Deployment

### Deploy Frontend (Vercel)

```bash
npm i -g vercel
vercel
```

### Deploy Backend (Heroku)

```bash
npm install -g heroku-cli
heroku login
heroku create nail-art-booking-api
git push heroku main
```

### Environment Variables in Production

```bash
# Vercel
vercel env add REACT_APP_API_URL

# Heroku
heroku config:set DATABASE_URL=postgresql://...
```

## Performance Optimization

### 1. Code Splitting

```typescript
// Lazy load booking component
import { lazy, Suspense } from 'react';

const BookingComponent = lazy(() => import('./components/booking'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingComponent />
    </Suspense>
  );
}
```

### 2. Image Optimization

```bash
npm install image-webpack-loader
```

### 3. Production Build

```bash
npm run build
```

## Monitoring

### Error Tracking (Sentry)

```bash
npm install @sentry/react
```

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Analytics (Google Analytics)

```bash
npm install react-ga4
```

```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize(process.env.REACT_APP_GA_ID || '');
```

## Support & Troubleshooting

### Common Issues

1. **CORS Error**: Configure backend CORS settings
2. **API Not Found**: Check `REACT_APP_API_URL` in .env
3. **Services Not Loading**: Verify `utils.ts` has SERVICES array
4. **Booking Submit Fails**: Check backend is running on correct port

### Debug Mode

Add to `App.tsx`:

```typescript
useEffect(() => {
  console.log('Booking System Debug:', {
    apiUrl: process.env.REACT_APP_API_URL,
    services: SERVICES,
    workingHours: WORKING_HOURS,
  });
}, []);
```

## Next Steps

1. Customize services and working hours
2. Connect to your database
3. Implement payment processing (Stripe)
4. Add email notifications
5. Deploy to production

## Support

For issues and questions:
- GitHub: https://github.com/nailart/booking
- Email: support@nailart.dev
- Docs: https://docs.nailart.dev
