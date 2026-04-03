/**
 * index.ts
 * Main export file for booking system components
 */

// Components
export { BookingComponent } from './BookingComponent';
export { ServiceSelection } from './ServiceSelection';
export { Calendar } from './Calendar';
export { TimeSlotSelection } from './TimeSlotSelection';
export { CustomerDetailsForm } from './CustomerDetailsForm';
export { ServiceCart } from './ServiceCart';
export { ConfirmationModal } from './ConfirmationModal';

// Context & Hooks
export { BookingProvider, useBooking } from './BookingContext';

// Types
export type {
  BookingStep,
  Service,
  SelectedService,
  TimeSlot,
  BookingDate,
  CustomerDetails,
  Booking,
  BookingContextType,
  WorkingHours,
  BookingResponse,
  ApiError,
} from './types';

// Utilities
export {
  SERVICES,
  WORKING_HOURS,
  generateTimeSlots,
  getAvailableDates,
  isPastDate,
  isToday,
  isDateInRange,
  formatDate,
  formatTime,
  calculateTotalDuration,
  calculateTotalPrice,
  getServiceById,
  groupServicesByCategory,
  isValidEmail,
  isValidPhone,
  formatPhoneNumber,
} from './utils';

// API
export { apiClient, submitBooking, fetchAvailableSlots } from './api';
