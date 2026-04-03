/**
 * Main Booking Component
 * Coordinates all steps and displays the appropriate step
 */

import React, { useState } from 'react';
import { useBooking } from './BookingContext';
import { ServiceSelection } from './ServiceSelection';
import { Calendar } from './Calendar';
import { TimeSlotSelection } from './TimeSlotSelection';
import { CustomerDetailsForm } from './CustomerDetailsForm';
import { ConfirmationModal } from './ConfirmationModal';
import { ServiceCart } from './ServiceCart';
import styles from './BookingComponent.module.css';

interface BookingComponentProps {
  bookedTimes?: string[];
  maxDaysAhead?: number;
}

export function BookingComponent({
  bookedTimes = [],
  maxDaysAhead = 60,
}: BookingComponentProps) {
  const { currentStep, previousStep } = useBooking();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelection />;
      case 2:
        return <Calendar maxDaysAhead={maxDaysAhead} />;
      case 3:
        return <TimeSlotSelection bookedTimes={bookedTimes} />;
      case 4:
        return <CustomerDetailsForm />;
      case 5:
        return <ConfirmationModal />;
      default:
        return <ServiceSelection />;
    }
  };

  const getStepTitle = () => {
    const titles = [
      '',
      'Select Services',
      'Choose Date',
      'Select Time',
      'Your Details',
      'Confirmation',
    ];
    return titles[currentStep];
  };

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.stepIndicator}>
              {currentStep > 1 && (
                <button
                  className={styles.backButton}
                  onClick={previousStep}
                  aria-label="Go back"
                >
                  ←
                </button>
              )}
              <h1 className={styles.title}>{getStepTitle()}</h1>
            </div>

            {currentStep < 5 && (
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{
                  width: `${(currentStep / 5) * 100}%`,
                }} />
                <span className={styles.progressText}>
                  Step {currentStep} of 5
                </span>
              </div>
            )}
          </div>

          <div className={styles.stepContent}>
            {renderStep()}
          </div>
        </div>

        {currentStep < 5 && (
          <aside className={styles.sidebar}>
            <ServiceCart sticky compact={currentStep === 1} />
          </aside>
        )}
      </div>
    </div>
  );
}

export default BookingComponent;
