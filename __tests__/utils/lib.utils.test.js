/**
 * Utility Functions Tests
 * =======================
 * Tests for formatDate, formatCurrency, validation functions, etc.
 * Coverage: All utility functions and edge cases
 */

import {
  formatDate,
  formatTime,
  formatDateTime,
  formatCurrency,
  getDurationText,
  isValidEmail,
  isValidPhone,
} from '../../lib/utils'

describe('formatDate', () => {
  test('formats date correctly', () => {
    const date = '2026-04-15'
    const result = formatDate(date)
    expect(result).toContain('April')
    expect(result).toContain('15')
    expect(result).toContain('2026')
  })

  test('handles various date formats', () => {
    const dates = [
      '2026-04-15',
      new Date('2026-04-15'),
      '04/15/2026',
    ]
    dates.forEach(date => {
      const result = formatDate(date)
      expect(result).toBeTruthy()
    })
  })

  test('returns locale-specific format', () => {
    const date = new Date('2026-04-15')
    const result = formatDate(date)
    // Should be in en-US format
    expect(result).toMatch(/\d+/)
  })

  test('handles current date', () => {
    const today = new Date()
    const result = formatDate(today)
    expect(result).toBeTruthy()
  })

  test('handles past dates', () => {
    const pastDate = new Date('2020-01-01')
    const result = formatDate(pastDate)
    expect(result).toContain('2020')
  })

  test('handles future dates', () => {
    const futureDate = new Date('2030-12-31')
    const result = formatDate(futureDate)
    expect(result).toContain('2030')
  })
})

describe('formatTime', () => {
  test('formats time correctly', () => {
    const time = '14:30'
    const result = formatTime(time)
    expect(result).toContain('2:30')
    expect(result).toContain('PM')
  })

  test('handles morning times', () => {
    const time = '09:00'
    const result = formatTime(time)
    expect(result).toContain('9:00')
    expect(result).toContain('AM')
  })

  test('handles afternoon times', () => {
    const time = '15:45'
    const result = formatTime(time)
    expect(result).toContain('3:45')
    expect(result).toContain('PM')
  })

  test('handles midnight', () => {
    const time = '00:00'
    const result = formatTime(time)
    expect(result).toBeTruthy()
  })

  test('handles noon', () => {
    const time = '12:00'
    const result = formatTime(time)
    expect(result).toContain('12:00')
  })

  test('pads minutes with zero', () => {
    const time = '14:05'
    const result = formatTime(time)
    expect(result).toContain(':05')
  })
})

describe('formatDateTime', () => {
  test('combines date and time correctly', () => {
    const date = '2026-04-15'
    const time = '14:30'
    const result = formatDateTime(date, time)
    expect(result).toContain('April')
    expect(result).toContain('2026')
    expect(result).toContain('PM')
  })

  test('includes "at" separator', () => {
    const date = '2026-04-15'
    const time = '10:00'
    const result = formatDateTime(date, time)
    expect(result).toContain('at')
  })

  test('formats both parts correctly', () => {
    const date = new Date('2026-04-15')
    const time = '09:30'
    const result = formatDateTime(date, time)
    expect(result).toContain('April')
    expect(result).toContain('9:30')
  })
})

describe('formatCurrency', () => {
  test('formats currency with dollar sign', () => {
    const result = formatCurrency(50)
    expect(result).toContain('$')
  })

  test('formats whole amounts', () => {
    const result = formatCurrency(100)
    expect(result).toContain('100')
  })

  test('formats decimal amounts', () => {
    const result = formatCurrency(25.50)
    expect(result).toContain('25.50')
  })

  test('handles zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })

  test('handles large amounts', () => {
    const result = formatCurrency(9999.99)
    expect(result).toContain('9999.99')
  })

  test('handles cents correctly', () => {
    const result = formatCurrency(50.99)
    expect(result).toContain('50.99')
  })

  test('uses US locale format', () => {
    const result = formatCurrency(1000)
    // Should not have comma in test environment or handle it properly
    expect(result).toBeTruthy()
  })
})

describe('getDurationText', () => {
  test('formats minutes only', () => {
    const result = getDurationText(30)
    expect(result).toBe('30 minutes')
  })

  test('formats single hour', () => {
    const result = getDurationText(60)
    expect(result).toBe('1 hour')
  })

  test('formats multiple hours', () => {
    const result = getDurationText(120)
    expect(result).toBe('2 hours')
  })

  test('formats hours and minutes', () => {
    const result = getDurationText(90)
    expect(result).toBe('1h 30m')
  })

  test('formats hour and single minute', () => {
    const result = getDurationText(65)
    expect(result).toBe('1h 5m')
  })

  test('handles less than hour', () => {
    const result = getDurationText(45)
    expect(result).toBe('45 minutes')
  })

  test('handles 15 minutes', () => {
    const result = getDurationText(15)
    expect(result).toBe('15 minutes')
  })

  test('handles 2 hours and 45 minutes', () => {
    const result = getDurationText(165)
    expect(result).toBe('2h 45m')
  })
})

describe('isValidEmail', () => {
  test('validates correct email', () => {
    expect(isValidEmail('john@example.com')).toBe(true)
  })

  test('validates email with dots', () => {
    expect(isValidEmail('john.doe@example.com')).toBe(true)
  })

  test('validates email with hyphens', () => {
    expect(isValidEmail('john-doe@example.co.uk')).toBe(true)
  })

  test('rejects email without @', () => {
    expect(isValidEmail('johnexample.com')).toBe(false)
  })

  test('rejects email without domain', () => {
    expect(isValidEmail('john@')).toBe(false)
  })

  test('rejects email without local part', () => {
    expect(isValidEmail('@example.com')).toBe(false)
  })

  test('rejects email without TLD', () => {
    expect(isValidEmail('john@example')).toBe(false)
  })

  test('rejects email with space', () => {
    expect(isValidEmail('john @example.com')).toBe(false)
  })

  test('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  test('validates subdomain emails', () => {
    expect(isValidEmail('user@sub.example.com')).toBe(true)
  })

  test('rejects multiple @ signs', () => {
    expect(isValidEmail('john@@example.com')).toBe(false)
  })
})

describe('isValidPhone', () => {
  test('validates 10 digit phone', () => {
    expect(isValidPhone('1234567890')).toBe(true)
  })

  test('validates phone with hyphens', () => {
    expect(isValidPhone('123-456-7890')).toBe(true)
  })

  test('validates phone with parentheses', () => {
    expect(isValidPhone('(123) 456-7890')).toBe(true)
  })

  test('validates phone with spaces', () => {
    expect(isValidPhone('123 456 7890')).toBe(true)
  })

  test('validates phone with leading 1', () => {
    expect(isValidPhone('1-123-456-7890')).toBe(true)
  })

  test('rejects less than 10 digits', () => {
    expect(isValidPhone('123456789')).toBe(false)
  })

  test('rejects empty string', () => {
    expect(isValidPhone('')).toBe(false)
  })

  test('accepts more than 10 digits', () => {
    expect(isValidPhone('1-123-456-7890')).toBe(true)
  })

  test('validates international format', () => {
    expect(isValidPhone('+1-555-1234567')).toBe(true)
  })

  test('rejects text characters', () => {
    expect(isValidPhone('1-ABC-DEF-GHIJ')).toBe(false)
  })

  test('handles formatted numbers', () => {
    expect(isValidPhone('+1 (555) 555-1234')).toBe(true)
  })
})

describe('Utility Functions Integration', () => {
  test('can format complete booking details', () => {
    const date = '2026-04-15'
    const time = '14:30'
    const price = 75.50

    const formattedDate = formatDate(date)
    const formattedTime = formatTime(time)
    const formattedPrice = formatCurrency(price)

    expect(formattedDate).toBeTruthy()
    expect(formattedTime).toBeTruthy()
    expect(formattedPrice).toBeTruthy()
  })

  test('validates customer information', () => {
    const email = 'customer@example.com'
    const phone = '555-123-4567'

    expect(isValidEmail(email)).toBe(true)
    expect(isValidPhone(phone)).toBe(true)
  })

  test('formats multiple services', () => {
    const prices = [25, 40, 60]
    const formatted = prices.map(p => formatCurrency(p))

    formatted.forEach(f => {
      expect(f).toContain('$')
    })
  })

  test('handles edge cases gracefully', () => {
    // Test error conditions
    expect(() => formatDate('invalid')).not.toThrow()
    expect(() => formatCurrency(-50)).not.toThrow()
  })
})

describe('Utility Functions Boundaries', () => {
  test('formatCurrency handles very large amounts', () => {
    const result = formatCurrency(999999.99)
    expect(result).toBeTruthy()
  })

  test('getDurationText handles large durations', () => {
    const result = getDurationText(1440) // 24 hours
    expect(result).toBeTruthy()
  })

  test('isValidEmail handles edge cases', () => {
    const emails = [
      'a@b.c',
      'test+tag@example.com',
      'user.name+tag@example.co.uk',
    ]
    emails.forEach(email => {
      expect(typeof isValidEmail(email)).toBe('boolean')
    })
  })

  test('isValidPhone handles minimum length', () => {
    expect(isValidPhone('1234567890')).toBe(true)
    expect(isValidPhone('123456789')).toBe(false)
  })
})
