/**
 * Step 5: Confirmation Modal
 * Show booking summary and confirm/submit button
 */

import React, { useState, useEffect } from 'react';
import { useBooking } from './BookingContext';
import {
  calculateTotalDuration,
  calculateTotalPrice,
  formatDate,
  formatTime,
} from './utils';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
  onConfirm?: () => void;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function ConfirmationModal({ onConfirm }: ConfirmationModalProps) {
  const {
    selectedServices,
    selectedDate,
    selectedTimeSlot,
    customerDetails,
    booking,
    loading,
    error: contextError,
    submitBooking,
    resetBooking,
  } = useBooking();

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'info',
  });

  const totalDuration = calculateTotalDuration(selectedServices);
  const totalPrice = calculateTotalPrice(selectedServices);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleConfirm = async () => {
    try {
      await submitBooking();
      showToast('Booking confirmed successfully!', 'success');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to confirm booking',
        'error'
      );
    }
  };

  const handleNewBooking = () => {
    resetBooking();
    onConfirm?.();
  };

  // Success state - show confirmation
  if (booking) {
    return (
      <div className={styles.container}>
        <div className={styles.modal}>
          <div className={styles.successAnimation}>
            <div className={styles.checkmark}>✓</div>
          </div>

          <div className={styles.successContent}>
            <h2 className={styles.successTitle}>Booking Confirmed!</h2>
            <p className={styles.successMessage}>
              Your appointment has been successfully booked.
            </p>

            {booking.id && (
              <div className={styles.bookingId}>
                <span className={styles.label}>Booking Reference:</span>
                <span className={styles.id}>{booking.id}</span>
              </div>
            )}

            <div className={styles.confirmationDetails}>
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Services</h3>
                <div className={styles.servicesList}>
                  {booking.services.map((service) => (
                    <div key={service.id} className={styles.serviceItem}>
                      <span className={styles.serviceName}>{service.name}</span>
                      <span className={styles.servicePrice}>
                        ${service.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Appointment Details</h3>
                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Date:</span>
                    <span className={styles.value}>
                      {formatDate(booking.date)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Time:</span>
                    <span className={styles.value}>
                      {formatTime(booking.timeSlot.time)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Duration:</span>
                    <span className={styles.value}>
                      {booking.totalDuration} minutes
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Customer Info</h3>
                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Name:</span>
                    <span className={styles.value}>
                      {booking.customerDetails.name}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>
                      {booking.customerDetails.email}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Phone:</span>
                    <span className={styles.value}>
                      {booking.customerDetails.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.totalSection}>
                <div className={styles.totalAmount}>
                  <span className={styles.label}>Total Amount:</span>
                  <span className={styles.amount}>
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.nextSteps}>
              <h3>Next Steps</h3>
              <ul>
                <li>
                  A confirmation email has been sent to{' '}
                  <strong>{booking.customerDetails.email}</strong>
                </li>
                <li>You will receive a reminder SMS 24 hours before your appointment</li>
                <li>
                  If you need to reschedule, contact us at least 24 hours before
                </li>
              </ul>
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={handleNewBooking}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation state - awaiting confirmation
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Review Your Booking</h2>
          <p>Please verify all details before confirming</p>
        </div>

        <div className={styles.reviewContent}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Services</h3>
            <div className={styles.servicesList}>
              {selectedServices.map((service) => (
                <div key={service.id} className={styles.serviceItem}>
                  <div className={styles.serviceInfo}>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.serviceMeta}>
                      {service.duration} min • ${service.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Appointment</h3>
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Date:</span>
                <span className={styles.value}>
                  {selectedDate && formatDate(selectedDate)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Time:</span>
                <span className={styles.value}>
                  {selectedTimeSlot && formatTime(selectedTimeSlot.time)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Duration:</span>
                <span className={styles.value}>{totalDuration} minutes</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Your Details</h3>
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Name:</span>
                <span className={styles.value}>{customerDetails?.name}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{customerDetails?.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>{customerDetails?.phone}</span>
              </div>
            </div>
          </div>

          <div className={styles.totalSection}>
            <div className={styles.totalAmount}>
              <span className={styles.label}>Total Amount:</span>
              <span className={styles.amount}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {contextError && (
            <div className={styles.error}>
              <p>{contextError}</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Back
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </div>
      </div>

      {toast.show && (
        <div className={`${styles.toast} ${styles[`toast-${toast.type}`]}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default ConfirmationModal;
