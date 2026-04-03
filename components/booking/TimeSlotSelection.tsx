/**
 * Step 3: Time Slot Selection
 * Display available time slots based on selected date and service duration
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useBooking } from './BookingContext';
import { generateTimeSlots, calculateTotalDuration, formatTime, formatDate } from './utils';
import styles from './TimeSlotSelection.module.css';

interface TimeSlotSelectionProps {
  onNext?: () => void;
  bookedTimes?: string[];
}

export function TimeSlotSelection({
  onNext,
  bookedTimes = [],
}: TimeSlotSelectionProps) {
  const {
    selectedServices,
    selectedDate,
    selectedTimeSlot,
    setTimeSlot,
    nextStep,
  } = useBooking();

  const [loading, setLoading] = useState(false);

  const totalDuration = useMemo(
    () => calculateTotalDuration(selectedServices),
    [selectedServices]
  );

  const availableSlots = useMemo(() => {
    if (!selectedDate || selectedServices.length === 0) {
      return [];
    }
    return generateTimeSlots(selectedDate, 30, bookedTimes);
  }, [selectedDate, selectedServices, bookedTimes]);

  const handleSlotSelect = (slotId: string) => {
    const slot = availableSlots.find((s) => s.id === slotId);
    if (slot && slot.available) {
      setTimeSlot(slot);
    }
  };

  const handleNext = () => {
    if (!selectedTimeSlot) {
      alert('Please select a time slot');
      return;
    }
    onNext ? onNext() : nextStep();
  };

  // Group slots by time of day
  const groupSlotsByPeriod = () => {
    const morning = availableSlots.filter((s) => {
      const hour = parseInt(s.time.split(':')[0]);
      return hour >= 9 && hour < 12;
    });

    const afternoon = availableSlots.filter((s) => {
      const hour = parseInt(s.time.split(':')[0]);
      return hour >= 12 && hour < 17;
    });

    const evening = availableSlots.filter((s) => {
      const hour = parseInt(s.time.split(':')[0]);
      return hour >= 17;
    });

    return { morning, afternoon, evening };
  };

  const periods = groupSlotsByPeriod();

  const renderSlotGroup = (label: string, slots: any[]) => {
    if (slots.length === 0) return null;

    return (
      <div key={label} className={styles.slotGroup}>
        <h4 className={styles.groupLabel}>{label}</h4>
        <div className={styles.slotsGrid}>
          {slots.map((slot) => (
            <button
              key={slot.id}
              className={`${styles.slotButton} ${
                slot.available ? styles.available : styles.unavailable
              } ${selectedTimeSlot?.id === slot.id ? styles.selected : ''}`}
              onClick={() => handleSlotSelect(slot.id)}
              disabled={!slot.available}
              title={
                slot.booked
                  ? 'This slot is booked'
                  : slot.available
                    ? `Available at ${formatTime(slot.time)}`
                    : 'Unavailable'
              }
            >
              <span className={styles.slotTime}>{formatTime(slot.time)}</span>
              {!slot.available && (
                <span className={styles.bookedBadge}>Booked</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!selectedDate || selectedServices.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Please select services and a date first
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Select Time</h2>
        <p>Choose your preferred appointment time</p>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Date:</span>
            <span className={styles.value}>{formatDate(selectedDate)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Duration:</span>
            <span className={styles.value}>{totalDuration} minutes</span>
          </div>
        </div>
      </div>

      <div className={styles.slotsContainer}>
        {availableSlots.length === 0 ? (
          <div className={styles.noSlots}>
            <p>No available time slots for this date.</p>
            <p>Please select a different date.</p>
          </div>
        ) : (
          <>
            {renderSlotGroup('Morning', periods.morning)}
            {renderSlotGroup('Afternoon', periods.afternoon)}
            {renderSlotGroup('Evening', periods.evening)}
          </>
        )}
      </div>

      {selectedTimeSlot && (
        <div className={styles.selectedInfo}>
          <p>
            Selected: <strong>{formatTime(selectedTimeSlot.time)}</strong>
          </p>
        </div>
      )}

      <div className={styles.footer}>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleNext}
          disabled={!selectedTimeSlot || loading}
        >
          {loading ? 'Loading...' : 'Continue to Details'}
        </button>
      </div>
    </div>
  );
}

export default TimeSlotSelection;
