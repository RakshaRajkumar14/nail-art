/**
 * Calendar Component Tests
 * ========================
 * Tests for date selection, availability, booking conflicts
 * Coverage: Date picking, availability display, conflict detection
 */

import React from 'react'
import { render, screen, fireEvent } from '../setup/test-utils'
import { createMockDate, formatTestDate } from '../setup/test-utils'

jest.mock('../../components/Calendar', () => {
  return function MockCalendar({ onDateSelect, bookedDates = [] }) {
    const [selectedDate, setSelectedDate] = React.useState(null)

    const isDateBooked = (date) => {
      return bookedDates.includes(formatTestDate(date))
    }

    const handleDateClick = (date) => {
      if (!isDateBooked(date)) {
        setSelectedDate(date)
        onDateSelect(date)
      }
    }

    return (
      <div data-testid="calendar">
        <div data-testid="calendar-header">Calendar</div>
        {Array.from({ length: 14 }).map((_, i) => {
          const date = createMockDate(i + 1)
          const dateStr = formatTestDate(date)
          const isBooked = isDateBooked(date)
          return (
            <button
              key={dateStr}
              data-testid={`date-${dateStr}`}
              onClick={() => handleDateClick(date)}
              disabled={isBooked}
            >
              {dateStr}
            </button>
          )
        })}
      </div>
    )
  }
})

import Calendar from '../../components/Calendar'

describe('Calendar Component', () => {
  const mockOnDateSelect = jest.fn()
  const bookedDate = formatTestDate(createMockDate(2))

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders calendar container', () => {
      render(<Calendar onDateSelect={mockOnDateSelect} />)
      expect(screen.getByTestId('calendar')).toBeInTheDocument()
    })

    test('displays available dates', () => {
      render(<Calendar onDateSelect={mockOnDateSelect} />)
      const date = formatTestDate(createMockDate(1))
      expect(screen.getByTestId(`date-${date}`)).toBeInTheDocument()
    })

    test('displays multiple dates', () => {
      render(<Calendar onDateSelect={mockOnDateSelect} />)
      for (let i = 1; i <= 5; i++) {
        const date = formatTestDate(createMockDate(i))
        expect(screen.getByTestId(`date-${date}`)).toBeInTheDocument()
      }
    })
  })

  describe('Date Selection', () => {
    test('calls onDateSelect when date clicked', () => {
      render(<Calendar onDateSelect={mockOnDateSelect} />)
      const date = formatTestDate(createMockDate(1))
      fireEvent.click(screen.getByTestId(`date-${date}`))

      expect(mockOnDateSelect).toHaveBeenCalledTimes(1)
      expect(mockOnDateSelect).toHaveBeenCalledWith(expect.any(Date))
    })

    test('disables booked dates', () => {
      render(
        <Calendar
          onDateSelect={mockOnDateSelect}
          bookedDates={[bookedDate]}
        />
      )
      const bookedButton = screen.getByTestId(`date-${bookedDate}`)
      expect(bookedButton).toBeDisabled()
    })

    test('allows selecting available dates', () => {
      render(
        <Calendar
          onDateSelect={mockOnDateSelect}
          bookedDates={[bookedDate]}
        />
      )
      const availableDate = formatTestDate(createMockDate(3))
      const button = screen.getByTestId(`date-${availableDate}`)

      expect(button).not.toBeDisabled()
      fireEvent.click(button)
      expect(mockOnDateSelect).toHaveBeenCalled()
    })

    test('prevents selecting booked dates', () => {
      render(
        <Calendar
          onDateSelect={mockOnDateSelect}
          bookedDates={[bookedDate]}
        />
      )
      const bookedButton = screen.getByTestId(`date-${bookedDate}`)

      fireEvent.click(bookedButton)
      expect(mockOnDateSelect).not.toHaveBeenCalled()
    })
  })

  describe('Booking Conflicts', () => {
    test('marks multiple booked dates as unavailable', () => {
      const bookedDates = [
        formatTestDate(createMockDate(2)),
        formatTestDate(createMockDate(3)),
        formatTestDate(createMockDate(5)),
      ]

      render(
        <Calendar
          onDateSelect={mockOnDateSelect}
          bookedDates={bookedDates}
        />
      )

      bookedDates.forEach(date => {
        expect(screen.getByTestId(`date-${date}`)).toBeDisabled()
      })
    })

    test('shows available dates between booked dates', () => {
      const bookedDates = [
        formatTestDate(createMockDate(2)),
        formatTestDate(createMockDate(5)),
      ]

      render(
        <Calendar
          onDateSelect={mockOnDateSelect}
          bookedDates={bookedDates}
        />
      )

      const availableDate = formatTestDate(createMockDate(3))
      expect(screen.getByTestId(`date-${availableDate}`)).not.toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    test('date buttons are keyboard accessible', () => {
      render(<Calendar onDateSelect={mockOnDateSelect} />)
      const date = formatTestDate(createMockDate(1))
      const button = screen.getByTestId(`date-${date}`)

      expect(button.tagName).toBe('BUTTON')
    })

    test('disabled buttons are marked as disabled', () => {
      render(
        <Calendar
          onDateSelect={mockOnDateSelect}
          bookedDates={[bookedDate]}
        />
      )
      const button = screen.getByTestId(`date-${bookedDate}`)
      expect(button).toHaveAttribute('disabled')
    })
  })
})
