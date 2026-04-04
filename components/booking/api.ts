/**
 * API utilities for booking system
 */

import { Booking, BookingResponse, ApiError } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error: ApiError & { error?: string } = await response.json();
        throw new Error(error.message || error.error || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('An unexpected error occurred');
    }
  }

  /**
   * Submit a booking
   */
  async createBooking(booking: Booking): Promise<BookingResponse> {
    return this.request<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  /**
   * Get booking by ID
   */
  async getBooking(bookingId: string): Promise<Booking> {
    return this.request<Booking>(`/bookings/${bookingId}`);
  }

  /**
   * Get all bookings for a customer
   */
  async getCustomerBookings(customerId: string): Promise<Booking[]> {
    return this.request<Booking[]>(`/bookings?customerId=${customerId}`);
  }

  /**
   * Get available slots for a date
   */
  async getAvailableSlots(date: string): Promise<string[]> {
    const response = await this.request<{
      success: boolean;
      data?: Array<{ time: string; available: boolean }>;
    }>(`/available-times?date=${date}`);

    const slots = response.data || [];
    return slots.filter((slot) => !slot.available).map((slot) => slot.time);
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Update a booking
   */
  async updateBooking(
    bookingId: string,
    updates: Partial<Booking>
  ): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
}

export const apiClient = new ApiClient();

/**
 * Hook-friendly async function to submit booking
 */
export async function submitBooking(booking: Booking): Promise<BookingResponse> {
  try {
    const response = await apiClient.createBooking(booking);
    return response;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch available slots for a date
 */
export async function fetchAvailableSlots(date: Date): Promise<string[]> {
  try {
    const dateStr = date.toISOString().split('T')[0];
    return await apiClient.getAvailableSlots(dateStr);
  } catch (error) {
    console.error('Failed to fetch available slots:', error);
    return [];
  }
}
