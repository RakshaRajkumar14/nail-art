/**
 * Step 2: Calendar Component - Date Selection
 * Display calendar with available dates for next 60 days
 */

import React, { useState, useMemo } from 'react';
import { useBooking } from './BookingContext';
import {
  getAvailableDates,
  isPastDate,
  isToday,
  formatDate,
  WORKING_HOURS,
} from './utils';
import styles from './Calendar.module.css';

interface CalendarProps {
  onNext?: () => void;
  maxDaysAhead?: number;
}

export function Calendar({ onNext, maxDaysAhead = 60 }: CalendarProps) {
  const { selectedDate, setDate, nextStep } = useBooking();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date;
  });

  const availableDates = useMemo(
    () => getAvailableDates(maxDaysAhead),
    [maxDaysAhead]
  );

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() - 1);
      return date;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() + 1);
      return date;
    });
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setDate(selected);
  };

  const handleNext = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    onNext ? onNext() : nextStep();
  };

  const isDateAvailable = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return availableDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  };

  const isDateSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === currentMonth.getFullYear() &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getDate() === day
    );
  };

  const isSalonClosed = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayOfWeek = date.getDay();
    const workingHour = WORKING_HOURS.find((h) => h.dayOfWeek === dayOfWeek);
    return workingHour?.closed || false;
  };

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className={styles.emptyDay}></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const available = isDateAvailable(day);
      const selected = isDateSelected(day);
      const closed = isSalonClosed(day);

      days.push(
        <button
          key={day}
          className={`${styles.day} ${available ? styles.available : styles.unavailable} ${
            selected ? styles.selected : ''
          } ${closed ? styles.closed : ''}`}
          onClick={() => available && handleDateSelect(day)}
          disabled={!available || closed}
          title={
            closed
              ? 'Salon closed'
              : available
                ? `${day} ${currentMonth.toLocaleString('en-US', { month: 'long' })}`
                : 'No availability'
          }
        >
          <span className={styles.dayNumber}>{day}</span>
          {isToday(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) && (
            <span className={styles.todayBadge}>Today</span>
          )}
        </button>
      );
    }

    return days;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Select Date</h2>
        <p>Choose your preferred appointment date</p>
      </div>

      <div className={styles.calendarCard}>
        <div className={styles.monthNavigation}>
          <button
            className={styles.navButton}
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            ←
          </button>

          <h3 className={styles.monthYear}>
            {currentMonth.toLocaleString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h3>

          <button
            className={styles.navButton}
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className={styles.weekdays}>
          {weekDays.map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.days}>{renderDays()}</div>

        <div className={styles.legend}>
          <div className={`${styles.legendItem}`}>
            <div className={`${styles.legendColor} ${styles.available}`}></div>
            <span>Available</span>
          </div>
          <div className={`${styles.legendItem}`}>
            <div className={`${styles.legendColor} ${styles.selected}`}></div>
            <span>Selected</span>
          </div>
          <div className={`${styles.legendItem}`}>
            <div className={`${styles.legendColor} ${styles.unavailable}`}></div>
            <span>Unavailable</span>
          </div>
          <div className={`${styles.legendItem}`}>
            <div className={`${styles.legendColor} ${styles.closed}`}></div>
            <span>Closed</span>
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className={styles.selectedInfo}>
          <p>Selected: <strong>{formatDate(selectedDate)}</strong></p>
        </div>
      )}

      <div className={styles.footer}>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleNext}
          disabled={!selectedDate}
        >
          Continue to Time Selection
        </button>
      </div>
    </div>
  );
}

export default Calendar;
