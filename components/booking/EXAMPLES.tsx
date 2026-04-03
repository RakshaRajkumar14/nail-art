/**
 * Example usage of the booking system
 * This file demonstrates how to integrate the booking system into your application
 */

// ============================================
// EXAMPLE 1: Basic Integration
// ============================================

import React from 'react';
import { BookingProvider, BookingComponent } from './index';

export function BasicBookingPage() {
  return (
    <BookingProvider>
      <BookingComponent
        bookedTimes={['09:00', '09:30', '10:00']}
        maxDaysAhead={60}
      />
    </BookingProvider>
  );
}

// ============================================
// EXAMPLE 2: Custom Wrapper with Header
// ============================================

import { BookingProvider } from './index';

export function BookingPageWithHeader() {
  return (
    <BookingProvider>
      <div className="booking-page">
        <header className="booking-header">
          <h1>Book Your Nail Appointment</h1>
          <p>Choose from our range of nail art services</p>
        </header>
        <BookingComponent />
      </div>
    </BookingProvider>
  );
}

// ============================================
// EXAMPLE 3: Fetch Booked Times from API
// ============================================

import { useEffect, useState } from 'react';

export function BookingWithDynamicBookedTimes() {
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/bookings/booked-times');
        const data = await response.json();
        setBookedTimes(data.times);
      } catch (error) {
        console.error('Failed to fetch booked times:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedTimes();
  }, []);

  if (loading) {
    return <div>Loading available times...</div>;
  }

  return (
    <BookingProvider>
      <BookingComponent bookedTimes={bookedTimes} />
    </BookingProvider>
  );
}

// ============================================
// EXAMPLE 4: Using Individual Steps
// ============================================

import {
  ServiceSelection,
  Calendar,
  TimeSlotSelection,
  CustomerDetailsForm,
  ConfirmationModal,
  ServiceCart,
  useBooking,
} from './index';

export function MultiStepBooking() {
  const { currentStep } = useBooking();

  return (
    <div className="multi-step-container">
      <div className="main-content">
        {currentStep === 1 && <ServiceSelection />}
        {currentStep === 2 && <Calendar />}
        {currentStep === 3 && <TimeSlotSelection />}
        {currentStep === 4 && <CustomerDetailsForm />}
        {currentStep === 5 && <ConfirmationModal />}
      </div>

      {currentStep < 5 && (
        <aside className="sidebar">
          <ServiceCart sticky />
        </aside>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 5: Custom Booking Flow
// ============================================

import { useBooking } from './index';
import type { Service } from './types';

export function CustomBookingFlow() {
  const {
    selectedServices,
    selectedDate,
    selectedTimeSlot,
    customerDetails,
    addService,
    removeService,
    nextStep,
    previousStep,
    currentStep,
  } = useBooking();

  const handleServiceClick = (service: Service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    if (isSelected) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  return (
    <div>
      <div className="step-indicator">
        {currentStep > 1 && (
          <button onClick={previousStep}>Back</button>
        )}
        <span>Step {currentStep} of 5</span>
        {currentStep < 5 && (
          <button onClick={nextStep}>Next</button>
        )}
      </div>

      {/* Your custom step content here */}
    </div>
  );
}

// ============================================
// EXAMPLE 6: Pre-populate Customer Details
// ============================================

import { useEffect } from 'react';
import { useBooking } from './index';

export function BookingWithPrefilledData() {
  const { setCustomerDetails } = useBooking();

  useEffect(() => {
    // Pre-populate from user profile or localStorage
    const savedCustomer = localStorage.getItem('customerDetails');
    if (savedCustomer) {
      setCustomerDetails(JSON.parse(savedCustomer));
    }
  }, [setCustomerDetails]);

  return (
    <BookingProvider>
      <BookingComponent />
    </BookingProvider>
  );
}

// ============================================
// EXAMPLE 7: Handle Booking Success
// ============================================

import { useBooking } from './index';

export function BookingWithSuccessHandler() {
  const { booking, submitBooking } = useBooking();

  const handleConfirm = async () => {
    try {
      await submitBooking();

      // Booking successful
      if (booking) {
        // Show notification
        console.log('Booking confirmed:', booking.id);

        // Save to localStorage
        localStorage.setItem('lastBooking', JSON.stringify(booking));

        // Redirect
        window.location.href = '/booking-confirmation';
      }
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <BookingProvider>
      <BookingComponent />
    </BookingProvider>
  );
}

// ============================================
// EXAMPLE 8: Modal Booking Dialog
// ============================================

import { useEffect, useRef } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={modalRef} className="booking-modal">
      <button onClick={onClose} className="close-button">
        ×
      </button>
      <BookingProvider>
        <BookingComponent />
      </BookingProvider>
    </dialog>
  );
}

// Usage:
// export function App() {
//   const [isBookingOpen, setIsBookingOpen] = useState(false);
//   return (
//     <>
//       <button onClick={() => setIsBookingOpen(true)}>Book Now</button>
//       <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
//     </>
//   );
// }

// ============================================
// EXAMPLE 9: Analytics Integration
// ============================================

import { useEffect } from 'react';
import { useBooking } from './index';

export function BookingWithAnalytics() {
  const { currentStep, booking } = useBooking();

  useEffect(() => {
    // Track step viewed
    if (window.gtag) {
      window.gtag('event', 'booking_step_viewed', {
        step: currentStep,
      });
    }
  }, [currentStep]);

  useEffect(() => {
    // Track booking completed
    if (booking && window.gtag) {
      window.gtag('event', 'booking_completed', {
        booking_id: booking.id,
        total_price: booking.totalPrice,
        services_count: booking.services.length,
      });
    }
  }, [booking]);

  return (
    <BookingProvider>
      <BookingComponent />
    </BookingProvider>
  );
}

// ============================================
// EXAMPLE 10: Responsive Layout
// ============================================

export function ResponsiveBookingLayout() {
  return (
    <div className="booking-layout">
      <style>{`
        .booking-layout {
          width: 100%;
          padding: 1rem;
        }

        @media (max-width: 768px) {
          .booking-layout {
            padding: 0.5rem;
          }
        }

        .booking-page {
          max-width: 1400px;
          margin: 0 auto;
        }

        .booking-header {
          text-align: center;
          margin-bottom: 2rem;
        }
      `}</style>

      <BookingProvider>
        <BookingComponent />
      </BookingProvider>
    </div>
  );
}

// ============================================
// EXAMPLE 11: Fetch Booked Slots for Date
// ============================================

import { fetchAvailableSlots } from './api';

export function BookingWithDynamicSlots() {
  const { selectedDate } = useBooking();
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate)
        .then((slots) => setBookedTimes(slots))
        .catch((error) => console.error('Error fetching slots:', error));
    }
  }, [selectedDate]);

  return (
    <BookingProvider>
      <BookingComponent bookedTimes={bookedTimes} />
    </BookingProvider>
  );
}

// ============================================
// EXAMPLE 12: Customize API Endpoint
// ============================================

import { apiClient } from './api';

export function BookingWithCustomAPI() {
  useEffect(() => {
    // Override API base URL
    const newClient = new (apiClient as any).constructor(
      'https://custom-api.com/v1'
    );
  }, []);

  return (
    <BookingProvider>
      <BookingComponent />
    </BookingProvider>
  );
}

export default BasicBookingPage;
