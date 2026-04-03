/**
 * Test Utilities
 * ==============
 * Common helpers and utilities for testing
 */

import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { Router } from 'next/router'

/**
 * Custom render function that wraps components with necessary providers
 */
export function render(ui, options = {}) {
  const Wrapper = ({ children }) => {
    return <div>{children}</div>
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options })
}

/**
 * Helper to mock fetch
 */
export function mockFetch(response = {}, status = 200) {
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(response),
    text: jest.fn().mockResolvedValue(JSON.stringify(response)),
  })
}

/**
 * Wait for async operations
 */
export function waitFor(callback, options = {}) {
  const { timeout = 1000, interval = 50 } = options
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const interval_id = setInterval(() => {
      try {
        callback()
        clearInterval(interval_id)
        resolve()
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          clearInterval(interval_id)
          reject(error)
        }
      }
    }, interval)
  })
}

/**
 * Setup mock Next.js router
 */
export function mockRouter(overrides = {}) {
  return {
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    ...overrides,
  }
}

/**
 * Setup mock supabase client
 */
export function mockSupabaseClient(overrides = {}) {
  return {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
    ...overrides,
  }
}

/**
 * Helper to simulate user interactions
 */
export async function userInteraction(element, action, ...args) {
  if (action === 'click') {
    element.click()
  } else if (action === 'type') {
    element.value = args[0]
    element.dispatchEvent(new Event('input', { bubbles: true }))
  } else if (action === 'change') {
    element.value = args[0]
    element.dispatchEvent(new Event('change', { bubbles: true }))
  } else if (action === 'focus') {
    element.focus()
    element.dispatchEvent(new Event('focus', { bubbles: true }))
  } else if (action === 'blur') {
    element.blur()
    element.dispatchEvent(new Event('blur', { bubbles: true }))
  }
}

/**
 * Create mock dates for testing
 */
export function createMockDate(days = 0, hours = 0) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hours, 0, 0, 0)
  return date
}

/**
 * Format date for testing assertions
 */
export function formatTestDate(date) {
  return date.toISOString().split('T')[0]
}

/**
 * Create mock service data
 */
export function createMockService(overrides = {}) {
  return {
    id: '1',
    name: 'Classic Manicure',
    description: 'Beautiful polish application',
    price: 25,
    duration: 30,
    category: 'manicure',
    image: '/service.jpg',
    ...overrides,
  }
}

/**
 * Create mock booking data
 */
export function createMockBooking(overrides = {}) {
  return {
    id: '1',
    customer_name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    selected_services: ['service-1'],
    date: formatTestDate(createMockDate(1)),
    time: '10:00',
    notes: 'No specific requests',
    total_price: 50,
    status: 'pending',
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
