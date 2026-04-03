/**
 * Service Cart/Summary Component
 * Display selected services with totals and remove options
 * Sticky on mobile
 */

import React from 'react';
import { useBooking } from './BookingContext';
import {
  calculateTotalDuration,
  calculateTotalPrice,
  formatDate,
  formatTime,
} from './utils';
import styles from './ServiceCart.module.css';

interface ServiceCartProps {
  sticky?: boolean;
  compact?: boolean;
}

export function ServiceCart({ sticky = false, compact = false }: ServiceCartProps) {
  const {
    selectedServices,
    removeService,
    selectedDate,
    selectedTimeSlot,
    currentStep,
  } = useBooking();

  const totalDuration = calculateTotalDuration(selectedServices);
  const totalPrice = calculateTotalPrice(selectedServices);

  if (selectedServices.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.container} ${sticky ? styles.sticky : ''}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Booking Summary</h3>
          <span className={styles.badge}>{selectedServices.length} service(s)</span>
        </div>

        <div className={styles.servicesSection}>
          <div className={styles.servicesList}>
            {selectedServices.map((service) => (
              <div key={service.id} className={styles.serviceItem}>
                <div className={styles.serviceInfo}>
                  <div className={styles.serviceName}>{service.name}</div>
                  <div className={styles.serviceDetails}>
                    <span className={styles.duration}>{service.duration} min</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.price}>${service.price}</span>
                  </div>
                </div>

                <button
                  className={styles.removeButton}
                  onClick={() => removeService(service.id)}
                  title="Remove service"
                  aria-label={`Remove ${service.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {(selectedDate || selectedTimeSlot) && !compact && (
          <div className={styles.appointmentDetails}>
            {selectedDate && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Date:</span>
                <span className={styles.value}>{formatDate(selectedDate)}</span>
              </div>
            )}
            {selectedTimeSlot && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Time:</span>
                <span className={styles.value}>
                  {formatTime(selectedTimeSlot.time)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className={styles.totals}>
          <div className={styles.totalItem}>
            <span className={styles.label}>Duration:</span>
            <span className={styles.value}>{totalDuration} min</span>
          </div>
          <div className={`${styles.totalItem} ${styles.price}`}>
            <span className={styles.label}>Total:</span>
            <span className={styles.value}>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {currentStep === 1 && (
          <div className={styles.hint}>
            You can adjust your services in this summary
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceCart;
