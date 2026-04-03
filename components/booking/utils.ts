/**
 * Utility functions for booking system
 */

import { TimeSlot, WorkingHours, Service } from './types';

export const WORKING_HOURS: WorkingHours[] = [
  { dayOfWeek: 0, startTime: '10:00', endTime: '18:00', closed: true }, // Sunday - closed
  { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Monday
  { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' }, // Tuesday
  { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' }, // Wednesday
  { dayOfWeek: 4, startTime: '09:00', endTime: '20:00' }, // Thursday
  { dayOfWeek: 5, startTime: '09:00', endTime: '20:00' }, // Friday
  { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' }, // Saturday
];

export const SERVICES: Service[] = [
  {
    id: 'basic-mani',
    name: 'Basic Manicure',
    duration: 30,
    price: 25,
    category: 'manicure',
    description: 'Polish and shine',
  },
  {
    id: 'gel-mani',
    name: 'Gel Manicure',
    duration: 45,
    price: 50,
    category: 'gel',
    description: 'Long-lasting gel polish',
  },
  {
    id: 'acrylic-nails',
    name: 'Acrylic Nails',
    duration: 60,
    price: 60,
    category: 'acrylic',
    description: 'Full acrylic application',
  },
  {
    id: 'nail-design',
    name: 'Nail Design',
    duration: 30,
    price: 35,
    category: 'design',
    description: 'Custom nail art design',
  },
  {
    id: 'gel-removal',
    name: 'Gel Removal',
    duration: 20,
    price: 15,
    category: 'removal',
    description: 'Safe gel removal',
  },
  {
    id: 'basic-pedi',
    name: 'Basic Pedicure',
    duration: 45,
    price: 35,
    category: 'pedicure',
    description: 'Relaxing pedicure',
  },
  {
    id: 'gel-pedi',
    name: 'Gel Pedicure',
    duration: 60,
    price: 55,
    category: 'pedicure',
    description: 'Long-lasting gel pedicure',
  },
];

/**
 * Generate time slots for a given date
 */
export function generateTimeSlots(
  date: Date,
  serviceDuration: number = 30,
  bookedTimes: string[] = []
): TimeSlot[] {
  const dayOfWeek = date.getDay();
  const workingHour = WORKING_HOURS.find((h) => h.dayOfWeek === dayOfWeek);

  if (!workingHour || workingHour.closed) {
    return [];
  }

  const slots: TimeSlot[] = [];
  const [startHour, startMin] = workingHour.startTime.split(':').map(Number);
  const [endHour, endMin] = workingHour.endTime.split(':').map(Number);

  let currentTime = new Date(date);
  currentTime.setHours(startHour, startMin, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, endMin, 0, 0);

  let slotIndex = 0;

  while (currentTime < endTime) {
    const timeStr = currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const isBooked = bookedTimes.includes(timeStr);
    const available = !isBooked;

    slots.push({
      id: `slot-${slotIndex}`,
      time: timeStr,
      available,
      booked: isBooked,
    });

    // Move to next slot
    currentTime.setMinutes(currentTime.getMinutes() + serviceDuration);
    slotIndex++;
  }

  return slots;
}

/**
 * Get available dates for the next N days
 */
export function getAvailableDates(daysAhead: number = 60): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= daysAhead; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    // Skip if salon is closed on this day
    const dayOfWeek = date.getDay();
    const workingHour = WORKING_HOURS.find((h) => h.dayOfWeek === dayOfWeek);

    if (!workingHour?.closed) {
      dates.push(date);
    }
  }

  return dates;
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime();
}

/**
 * Check if a date is within a specific range
 */
export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  date.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  return date >= startDate && date <= endDate;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time for display
 */
export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(Number(hours), Number(minutes));

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Calculate total duration for selected services
 */
export function calculateTotalDuration(services: Service[]): number {
  return services.reduce((total, service) => total + service.duration, 0);
}

/**
 * Calculate total price for selected services
 */
export function calculateTotalPrice(services: Service[]): number {
  return services.reduce((total, service) => total + service.price, 0);
}

/**
 * Get service by ID
 */
export function getServiceById(serviceId: string): Service | undefined {
  return SERVICES.find((s) => s.id === serviceId);
}

/**
 * Group services by category
 */
export function groupServicesByCategory(services: Service[]) {
  return services.reduce(
    (grouped, service) => {
      const category = service.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(service);
      return grouped;
    },
    {} as Record<string, Service[]>
  );
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return phone;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}
