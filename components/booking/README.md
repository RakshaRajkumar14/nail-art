# Nail Artist Booking System

A comprehensive multi-step booking system for nail artist websites built with React and TypeScript.

## Features

- **5-Step Booking Process**
  1. Service Selection (multiple services)
  2. Date Picker (calendar with next 60 days)
  3. Time Slot Selection (intelligent scheduling)
  4. Customer Details (name, email, phone)
  5. Booking Confirmation (review & submit)

- **Smart Calendar**
  - Shows next 60 days
  - Disables past dates
  - Shows booked slots differently
  - Responsive grid layout
  - Smooth transitions

- **Time Slot Management**
  - Auto-generates from working hours (9am-6pm, extended hours on weekends)
  - Filters based on service duration
  - 30-minute slot intervals
  - Marks booked slots as unavailable

- **Service Summary**
  - Displays selected services with prices
  - Calculates total duration
  - Shows total price
  - Remove service option
  - Sticky positioning on mobile

- **Confirmation Modal**
  - Booking summary review
  - Success animation
  - Booking reference number
  - Next steps information

- **API Integration**
  - POST endpoint: `/api/bookings`
  - Handles loading and error states
  - Toast notifications
  - Error handling

## Installation

### 1. Setup React Project

```bash
# If starting from scratch
npx create-react-app nail-art-booking --template typescript
cd nail-art-booking
```

### 2. Copy Booking Components

Copy the `/d/2026/nail-art/components/booking/` directory to your project's components folder.

### 3. Install Dependencies

The booking system uses only built-in React features and CSS modules. No external dependencies required!

```bash
npm install
```

## Usage

### Basic Setup

Wrap your app with the BookingProvider:

```tsx
// App.tsx
import { BookingProvider, BookingComponent } from './components/booking';

function App() {
  return (
    <BookingProvider>
      <BookingComponent />
    </BookingProvider>
  );
}

export default App;
```

### Environment Configuration

Create a `.env` file:

```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

### Customize Services

Edit `/components/booking/utils.ts`:

```typescript
export const SERVICES: Service[] = [
  {
    id: 'service-id',
    name: 'Service Name',
    duration: 30, // minutes
    price: 50,
    category: 'manicure',
    description: 'Service description'
  },
  // Add more services
];
```

### Customize Working Hours

Edit `/components/booking/utils.ts`:

```typescript
export const WORKING_HOURS: WorkingHours[] = [
  { dayOfWeek: 0, startTime: '10:00', endTime: '18:00', closed: true }, // Sunday - closed
  { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Monday
  // ... other days
];
```

## Component API

### BookingComponent

Main wrapper component that manages all steps.

```tsx
<BookingComponent
  bookedTimes={['09:00', '09:30', '10:00']}
  maxDaysAhead={90}
/>
```

**Props:**
- `bookedTimes` (string[]): Array of booked times (HH:MM format)
- `maxDaysAhead` (number): Number of days to show in calendar (default: 60)

### Using the useBooking Hook

Access booking state and actions:

```tsx
import { useBooking } from './components/booking';

function MyComponent() {
  const {
    currentStep,
    selectedServices,
    selectedDate,
    selectedTimeSlot,
    customerDetails,
    loading,
    error,
    addService,
    removeService,
    setDate,
    setTimeSlot,
    setCustomerDetails,
    submitBooking,
    nextStep,
    previousStep,
  } = useBooking();

  return (
    // Your component JSX
  );
}
```

### Individual Components

Use components separately:

```tsx
import {
  ServiceSelection,
  Calendar,
  TimeSlotSelection,
  CustomerDetailsForm,
  ConfirmationModal,
  ServiceCart
} from './components/booking';

// Step 1: Service Selection
<ServiceSelection onNext={() => goToStep2()} />

// Step 2: Calendar
<Calendar maxDaysAhead={60} onNext={() => goToStep3()} />

// Step 3: Time Slots
<TimeSlotSelection bookedTimes={['09:00', '10:00']} onNext={() => goToStep4()} />

// Step 4: Customer Details
<CustomerDetailsForm onNext={() => goToStep5()} />

// Step 5: Confirmation
<ConfirmationModal onConfirm={() => resetAndStart()} />

// Summary Sidebar
<ServiceCart sticky compact={false} />
```

## Styling

All components use CSS Modules for scoped styling. No global styles required.

### Customizing Styles

Edit the `.module.css` files to match your brand colors:

```css
/* BookingComponent.module.css */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change to your brand colors */
}
```

Key color variables used:
- Primary: `#667eea`
- Secondary: `#764ba2`
- Success: `#48bb78`
- Error: `#fc8181`
- Gray: `#718096`

## API Integration

### POST /api/bookings

Submit a booking:

```typescript
interface BookingPayload {
  services: SelectedService[];
  date: Date;
  timeSlot: TimeSlot;
  customerDetails: CustomerDetails;
  totalDuration: number;
  totalPrice: number;
}

interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
  booking?: Booking;
  error?: string;
}
```

### Example Backend Implementation

```typescript
// Node.js/Express example
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = req.body;

    // Validate booking data
    // Save to database
    // Send confirmation email

    res.json({
      success: true,
      message: 'Booking created successfully',
      bookingId: 'BOOKING-12345',
      booking: { ...booking, id: 'BOOKING-12345' }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
});
```

## TypeScript Types

```typescript
// Service
interface Service {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
  description?: string;
  category?: 'manicure' | 'pedicure' | 'gel' | 'acrylic' | 'design' | 'removal';
}

// Booking
interface Booking {
  id?: string;
  services: SelectedService[];
  date: Date;
  timeSlot: TimeSlot;
  customerDetails: CustomerDetails;
  totalDuration: number;
  totalPrice: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Customer Details
interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}
```

## Utilities

Helpful utility functions:

```typescript
import {
  generateTimeSlots,
  getAvailableDates,
  calculateTotalDuration,
  calculateTotalPrice,
  isValidEmail,
  isValidPhone,
  formatDate,
  formatTime,
} from './components/booking';

// Generate time slots for a date
const slots = generateTimeSlots(new Date(), 30); // 30-minute slots

// Get available dates
const dates = getAvailableDates(60); // Next 60 days

// Calculate totals
const duration = calculateTotalDuration(services);
const price = calculateTotalPrice(services);

// Validate input
if (isValidEmail(email)) { /* ... */ }
if (isValidPhone(phone)) { /* ... */ }

// Format display
const dateStr = formatDate(new Date()); // "Jan 15"
const timeStr = formatTime('14:30'); // "2:30 PM"
```

## Customization Guide

### Change Default Services

```typescript
// components/booking/utils.ts
export const SERVICES: Service[] = [
  {
    id: 'french-mani',
    name: 'French Manicure',
    duration: 35,
    price: 40,
    category: 'manicure',
    description: 'Classic French tip manicure'
  },
  // Add your services
];
```

### Modify Working Hours

```typescript
// components/booking/utils.ts
export const WORKING_HOURS: WorkingHours[] = [
  { dayOfWeek: 0, startTime: '11:00', endTime: '19:00' }, // Sunday
  { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Monday
  // ... etc
];
```

### Custom Time Slot Duration

When generating slots, pass duration in minutes:

```typescript
// Generate 15-minute slots instead of 30
const slots = generateTimeSlots(date, 15);
```

### Add Notifications

The booking system emits an API response. Handle it in your confirmation:

```typescript
const { submitBooking } = useBooking();

await submitBooking();
// API response will trigger success/error notifications
```

## Performance Optimization

- Calendar only renders visible dates
- Service list uses lazy rendering
- Time slots memoized to prevent unnecessary recalculations
- CSS modules scoped to components
- No external animation libraries

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatible
- Touch-friendly on mobile (min 44px tap targets)

## Troubleshooting

### Issue: Services not showing
- Check `utils.ts` has services defined
- Verify `SERVICES` export is correct

### Issue: Calendar not showing available dates
- Verify `WORKING_HOURS` is correctly configured
- Check date isn't in the past
- Ensure `getAvailableDates()` is called properly

### Issue: Time slots not generating
- Confirm service duration is set
- Check working hours for that day aren't marked as closed
- Verify `generateTimeSlots()` receives correct parameters

### Issue: API call failing
- Check `REACT_APP_API_URL` environment variable
- Verify backend endpoint is at `/api/bookings`
- Check CORS configuration
- Review network tab for detailed error

## License

MIT

## Support

For issues and feature requests, contact: support@nailart.dev
