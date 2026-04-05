/**
 * Booking Context - manages booking state across all steps
 */

import React, { createContext, useState, useCallback, useContext } from 'react';
import {
  BookingContextType,
  BookingStep,
  Service,
  SelectedService,
  TimeSlot,
  CustomerDetails,
  Booking,
} from './types';
import { submitBooking } from './api';
import {
  calculateTotalDuration,
  calculateTotalPrice,
  getServiceById,
} from './utils';

export const BookingContext = createContext<BookingContextType | undefined>(
  undefined
);

interface BookingProviderProps {
  children: React.ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const goToStep = useCallback((step: BookingStep) => {
    setCurrentStep(step);
    setError(null);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as BookingStep);
      setError(null);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as BookingStep);
      setError(null);
    }
  }, [currentStep]);

  const addService = useCallback((service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) {
        return prev; // Service already selected
      }
      return [...prev, { ...service }];
    });
  }, []);

  const removeService = useCallback((serviceId: string) => {
    setSelectedServices((prev) =>
      prev.filter((s) => s.id !== serviceId)
    );
  }, []);

  const handleSetDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  }, []);

  const handleSetTimeSlot = useCallback((slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  }, []);

  const handleSetCustomerDetails = useCallback((details: CustomerDetails) => {
    setCustomerDetails(details);
  }, []);

  const submitBookingHandler = useCallback(async () => {
    if (
      !selectedServices.length ||
      !selectedDate ||
      !selectedTimeSlot ||
      !customerDetails
    ) {
      setError('Please complete all steps before submitting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const totalDuration = calculateTotalDuration(selectedServices);
      const totalPrice = calculateTotalPrice(selectedServices);

      const bookingData: Booking = {
        services: selectedServices,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        customerDetails,
        totalDuration,
        totalPrice,
        status: 'pending',
      };

      const response = await submitBooking(bookingData);

      if (!response.success) {
        throw new Error(
          response.error || response.message || 'Failed to create booking'
        );
      }

      setBooking({
        ...bookingData,
        id: response.bookingId || response.booking?.id,
        status: response.booking?.status || bookingData.status,
      });
      setCurrentStep(5); // Go to confirmation screen
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Booking submission error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedServices, selectedDate, selectedTimeSlot, customerDetails]);

  const resetBooking = useCallback(() => {
    setCurrentStep(1);
    setSelectedServices([]);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setCustomerDetails(null);
    setError(null);
    setBooking(null);
  }, []);

  const value: BookingContextType = {
    currentStep,
    selectedServices,
    selectedDate,
    selectedTimeSlot,
    customerDetails,
    booking,
    loading,
    error,
    goToStep,
    nextStep,
    previousStep,
    addService,
    removeService,
    setDate: handleSetDate,
    setTimeSlot: handleSetTimeSlot,
    setCustomerDetails: handleSetCustomerDetails,
    submitBooking: submitBookingHandler,
    resetBooking,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

/**
 * Hook to use booking context
 */
export function useBooking(): BookingContextType {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}
