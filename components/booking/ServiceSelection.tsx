/**
 * Step 1: Service Selection Component
 * Display available services with checkboxes for multiple selection
 */

import React from 'react';
import { Service } from './types';
import { SERVICES, groupServicesByCategory, formatPhoneNumber } from './utils';
import { useBooking } from './BookingContext';
import styles from './ServiceSelection.module.css';

interface ServiceSelectionProps {
  onNext?: () => void;
}

export function ServiceSelection({ onNext }: ServiceSelectionProps) {
  const { selectedServices, addService, removeService, nextStep } = useBooking();
  const groupedServices = groupServicesByCategory(SERVICES);

  const handleServiceToggle = (service: Service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    if (isSelected) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  const handleNext = () => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    onNext ? onNext() : nextStep();
  };

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((s) => s.id === serviceId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Select Services</h2>
        <p>Choose one or more services for your appointment</p>
      </div>

      <div className={styles.servicesContainer}>
        {Object.entries(groupedServices).map(([category, services]) => (
          <div key={category} className={styles.categorySection}>
            <h3 className={styles.categoryTitle}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>

            <div className={styles.servicesList}>
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`${styles.serviceItem} ${
                    isServiceSelected(service.id) ? styles.selected : ''
                  }`}
                  onClick={() => handleServiceToggle(service)}
                >
                  <input
                    type="checkbox"
                    id={service.id}
                    checked={isServiceSelected(service.id)}
                    onChange={() => handleServiceToggle(service)}
                    className={styles.checkbox}
                  />

                  <label htmlFor={service.id} className={styles.label}>
                    <div className={styles.serviceInfo}>
                      <div className={styles.serviceName}>{service.name}</div>
                      {service.description && (
                        <div className={styles.description}>
                          {service.description}
                        </div>
                      )}
                    </div>

                    <div className={styles.serviceDetails}>
                      <span className={styles.duration}>
                        {service.duration} min
                      </span>
                      <span className={styles.price}>${service.price}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleNext}
          disabled={selectedServices.length === 0}
        >
          Continue to Date Selection
        </button>
      </div>
    </div>
  );
}

export default ServiceSelection;
