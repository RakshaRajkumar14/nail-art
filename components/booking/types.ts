/**
 * TypeScript types and interfaces for the nail artist booking system
 */

export type BookingStep = 1 | 2 | 3 | 4 | 5;

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description?: string;
  category?: 'manicure' | 'pedicure' | 'gel' | 'acrylic' | 'design' | 'removal';
}

export interface SelectedService extends Service {
  quantity?: number;
}

export interface TimeSlot {
  id: string;
  time: string; // HH:MM format
  available: boolean;
  booked?: boolean;
}

export interface BookingDate {
  date: Date;
  availableSlots: TimeSlot[];
  booked: boolean;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface Booking {
  id?: string;
  customerId?: string;
  services: SelectedService[];
  date: Date;
  timeSlot: TimeSlot;
  customerDetails: CustomerDetails;
  totalDuration: number; // in minutes
  totalPrice: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingContextType {
  currentStep: BookingStep;
  selectedServices: SelectedService[];
  selectedDate: Date | null;
  selectedTimeSlot: TimeSlot | null;
  customerDetails: CustomerDetails | null;
  booking: Booking | null;
  loading: boolean;
  error: string | null;

  // Actions
  goToStep: (step: BookingStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  setDate: (date: Date) => void;
  setTimeSlot: (slot: TimeSlot) => void;
  setCustomerDetails: (details: CustomerDetails) => void;
  submitBooking: () => Promise<void>;
  resetBooking: () => void;
}

export interface WorkingHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  closed?: boolean;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
  booking?: Booking;
  error?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
