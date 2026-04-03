# Quick Reference Card

## Import Everything

```tsx
import {
  BookingComponent,
  BookingProvider,
  useBooking,
  ServiceCart,
  // Individual components
  ServiceSelection,
  Calendar,
  TimeSlotSelection,
  CustomerDetailsForm,
  ConfirmationModal,
  // Types
  Booking,
  Service,
  TimeSlot,
  CustomerDetails,
  // Utilities
  SERVICES,
  WORKING_HOURS,
  generateTimeSlots,
  calculateTotalPrice,
  formatDate,
} from './components/booking';
```

## Basic Setup

```tsx
// App.tsx
import { BookingProvider, BookingComponent } from './components/booking';

export default function App() {
  return (
    <BookingProvider>
      <BookingComponent />
    </BookingProvider>
  );
}
```

## Use the Hook

```tsx
import { useBooking } from './components/booking';

function MyComponent() {
  const {
    currentStep,           // 1 | 2 | 3 | 4 | 5
    selectedServices,      // Service[]
    selectedDate,          // Date | null
    selectedTimeSlot,      // TimeSlot | null
    customerDetails,       // CustomerDetails | null
    booking,               // Booking | null (on step 5)
    loading,               // boolean
    error,                 // string | null
    addService,            // (service: Service) => void
    removeService,         // (serviceId: string) => void
    setDate,               // (date: Date) => void
    setTimeSlot,           // (slot: TimeSlot) => void
    setCustomerDetails,    // (details: CustomerDetails) => void
    nextStep,              // () => void
    previousStep,          // () => void
    submitBooking,         // () => Promise<void>
  } = useBooking();

  return <div>{currentStep}</div>;
}
```

## Add Custom Service

```typescript
// utils.ts - add to SERVICES array
{
  id: 'custom-design',
  name: 'Custom Nail Art',
  duration: 45,
  price: 75,
  category: 'design',
  description: '3D custom design work',
}
```

## Change Working Hours

```typescript
// utils.ts - modify WORKING_HOURS
export const WORKING_HOURS: WorkingHours[] = [
  { dayOfWeek: 0, startTime: '11:00', endTime: '19:00', closed: false },
  { dayOfWeek: 1, startTime: '08:00', endTime: '20:00' },
  // ... etc
];
```

## Generate Time Slots

```typescript
import { generateTimeSlots } from './components/booking';

// 30-minute slots for a date
const slots = generateTimeSlots(new Date(), 30);

// 15-minute slots
const slotsShort = generateTimeSlots(new Date(), 15);

// With booked times
const slotsFiltered = generateTimeSlots(
  new Date(),
  30,
  ['09:00', '09:30', '10:00'] // booked times
);
```

## Format Dates & Times

```typescript
import { formatDate, formatTime } from './components/booking';

formatDate(new Date());      // "Jan 15"
formatTime('14:30');         // "2:30 PM"
```

## Validate Input

```typescript
import {
  isValidEmail,
  isValidPhone,
  formatPhoneNumber,
} from './components/booking';

isValidEmail('test@example.com');     // true
isValidPhone('5551234567');           // true
formatPhoneNumber('5551234567');      // "(555) 123-4567"
```

## Calculate Totals

```typescript
import {
  calculateTotalPrice,
  calculateTotalDuration,
} from './components/booking';

const services = [
  { id: '1', name: 'Mani', duration: 30, price: 25 },
  { id: '2', name: 'Pedi', duration: 45, price: 35 },
];

calculateTotalDuration(services);  // 75
calculateTotalPrice(services);     // 60
```

## Handle Booking Submission

```tsx
import { useBooking } from './components/booking';

function BookingButton() {
  const { submitBooking, loading, error } = useBooking();

  const handleSubmit = async () => {
    try {
      await submitBooking();
      // Success - booking is complete
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Submitting...' : 'Confirm Booking'}
    </button>
  );
}
```

## Fetch Booked Times from API

```tsx
import { useEffect, useState } from 'react';
import { fetchAvailableSlots } from './components/booking';

function TimeSlots() {
  const [booked, setBooked] = useState<string[]>([]);

  useEffect(() => {
    fetchAvailableSlots(new Date()).then(setBooked);
  }, []);

  return <TimeSlotSelection bookedTimes={booked} />;
}
```

## Customize Colors

```css
/* Add to your global CSS */
:root {
  --primary: #667eea;
  --primary-dark: #764ba2;
  --success: #48bb78;
  --error: #fc8181;
}
```

## Environment Variables

```env
# .env
REACT_APP_API_URL=http://localhost:3001/api
```

## API Response

```typescript
// POST /api/bookings
{
  success: true,
  message: 'Booking created successfully',
  bookingId: 'BOOKING-12345',
  booking: {
    id: 'BOOKING-12345',
    services: [...],
    date: '2026-03-30',
    timeSlot: { time: '14:30', ... },
    customerDetails: { name: '...', ... },
    totalDuration: 75,
    totalPrice: 85,
    status: 'pending'
  }
}
```

## Types Quick Reference

```typescript
// Service
interface Service {
  id: string;
  name: string;
  duration: number;      // minutes
  price: number;
  description?: string;
  category?: string;
}

// Booking
interface Booking {
  id?: string;
  services: Service[];
  date: Date;
  timeSlot: TimeSlot;
  customerDetails: CustomerDetails;
  totalDuration: number;
  totalPrice: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// TimeSlot
interface TimeSlot {
  id: string;
  time: string;         // "14:30"
  available: boolean;
  booked?: boolean;
}

// CustomerDetails
interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}
```

## Components Props

```typescript
// BookingComponent
<BookingComponent
  bookedTimes={['09:00', '10:00']}
  maxDaysAhead={60}
/>

// Calendar
<Calendar
  maxDaysAhead={60}
  onNext={() => {}}
/>

// TimeSlotSelection
<TimeSlotSelection
  bookedTimes={['09:00']}
  onNext={() => {}}
/>

// ServiceSelection
<ServiceSelection onNext={() => {}} />

// CustomerDetailsForm
<CustomerDetailsForm onNext={() => {}} />

// ConfirmationModal
<ConfirmationModal onConfirm={() => {}} />

// ServiceCart
<ServiceCart
  sticky={true}
  compact={false}
/>
```

## Common Patterns

### Listen to Step Changes

```tsx
import { useEffect } from 'react';
import { useBooking } from './components/booking';

function StepTracker() {
  const { currentStep } = useBooking();

  useEffect(() => {
    console.log('User moved to step:', currentStep);
    // Track analytics
    // window.gtag?.('event', `booking_step_${currentStep}`);
  }, [currentStep]);

  return null;
}
```

### Pre-fill Customer Info

```tsx
import { useEffect } from 'react';
import { useBooking } from './components/booking';

function PreFillCustomer() {
  const { setCustomerDetails } = useBooking();

  useEffect(() => {
    const stored = localStorage.getItem('customer');
    if (stored) {
      setCustomerDetails(JSON.parse(stored));
    }
  }, [setCustomerDetails]);

  return null;
}
```

### Handle Errors

```tsx
import { useBooking } from './components/booking';

function ErrorHandler() {
  const { error } = useBooking();

  if (error) {
    return (
      <div className="error-alert">
        <p>{error}</p>
      </div>
    );
  }

  return null;
}
```

### Show Loading State

```tsx
import { useBooking } from './components/booking';

function LoadingIndicator() {
  const { loading } = useBooking();

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  return null;
}
```

## Styling Classes

Each component has scoped CSS module with:
- `.container` - Main wrapper
- `.button` - Primary button
- `.buttonPrimary` / `.buttonSecondary`
- `.input` / `.textarea` - Form inputs
- `.error` - Error state
- `.selected` - Selected state
- `.loading` - Loading state

## File Sizes

- `BookingComponent.tsx`: 2.8KB
- `ServiceSelection.tsx`: 3.5KB
- `Calendar.tsx`: 6.4KB
- `TimeSlotSelection.tsx`: 5.1KB
- `CustomerDetailsForm.tsx`: 5.7KB
- `ConfirmationModal.tsx`: 11KB
- `BookingContext.tsx`: 4.8KB
- `ServiceCart.tsx`: 3.5KB
- **Total Components**: ~48KB
- **Total Styles**: ~36KB
- **Total System**: ~160KB (with docs)

## Performance Tips

1. Memoize callbacks with `useCallback`
2. Lazy load components with `React.lazy()`
3. Use CSS modules for scoped styling
4. Avoid inline functions in render
5. Use React DevTools Profiler to check renders

## Debugging

```tsx
// Enable debug logging
import { useBooking } from './components/booking';

function Debug() {
  const booking = useBooking();
  console.log('Booking State:', {
    step: booking.currentStep,
    services: booking.selectedServices,
    date: booking.selectedDate,
    time: booking.selectedTimeSlot,
    customer: booking.customerDetails,
    error: booking.error,
  });
  return null;
}
```

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| "useBooking must be used within BookingProvider" | Wrap with `<BookingProvider>` |
| "API call failed" | Check `REACT_APP_API_URL` in .env |
| "Services not showing" | Verify SERVICES array in utils.ts |
| "Calendar not updating" | Check WORKING_HOURS configuration |
| "Phone validation failing" | Use 10+ digit numbers |

## Next: Backend Setup

See `SETUP_GUIDE.md` for:
- Express.js server setup
- Database configuration
- API endpoint implementation
- Email/SMS integration
- Deployment instructions

---

**For more info**: See README.md, SETUP_GUIDE.md, or EXAMPLES.tsx
