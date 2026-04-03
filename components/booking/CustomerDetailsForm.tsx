/**
 * Step 4: Customer Details Form
 * Collect customer information (name, email, phone, notes)
 */

import React, { useState, useEffect } from 'react';
import { useBooking } from './BookingContext';
import {
  isValidEmail,
  isValidPhone,
  formatPhoneNumber,
} from './utils';
import { CustomerDetails } from './types';
import styles from './CustomerDetailsForm.module.css';

interface CustomerDetailsFormProps {
  onNext?: () => void;
}

export function CustomerDetailsForm({ onNext }: CustomerDetailsFormProps) {
  const { customerDetails, setCustomerDetails, nextStep } = useBooking();
  const [formData, setFormData] = useState<CustomerDetails>(
    customerDetails || {
      name: '',
      email: '',
      phone: '',
      notes: '',
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Keep only digits while typing
    value = value.replace(/\D/g, '');
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setCustomerDetails(formData);
    onNext ? onNext() : nextStep();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Your Details</h2>
        <p>Please provide your contact information</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="John Doe"
            className={`${styles.input} ${errors.name ? styles.error : ''}`}
            required
          />
          {errors.name && (
            <span className={styles.errorMessage}>{errors.name}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            className={`${styles.input} ${errors.email ? styles.error : ''}`}
            required
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>
            Phone Number *
          </label>
          <div className={styles.phoneInputWrapper}>
            <span className={styles.phonePrefix}>+1</span>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="(555) 123-4567"
              className={`${styles.phoneInput} ${errors.phone ? styles.error : ''}`}
              maxLength={14}
              required
            />
          </div>
          {formData.phone && (
            <span className={styles.phonePreview}>
              {formatPhoneNumber(formData.phone)}
            </span>
          )}
          {errors.phone && (
            <span className={styles.errorMessage}>{errors.phone}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes" className={styles.label}>
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes || ''}
            onChange={handleInputChange}
            placeholder="Any special requests or preferences?"
            className={styles.textarea}
            rows={4}
          />
          <span className={styles.hint}>
            Tell us about any preferences or requirements
          </span>
        </div>

        <div className={styles.footer}>
          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            Review Booking
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerDetailsForm;
