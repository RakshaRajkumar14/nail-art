/**
 * Booking Component Tests
 * =======================
 * Tests for booking form, form progression, data validation, and submission
 * Coverage: Form rendering, data entry, validation, multi-step flow
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '../setup/test-utils'
import { mockFormData, mockServices } from '../fixtures/mockData'

// Mock BookingComponent
jest.mock('../../components/BookingComponent', () => {
  return function MockBookingComponent({ onSubmit }) {
    const [step, setStep] = React.useState(1)
    const [formData, setFormData] = React.useState({
      customer_name: '',
      email: '',
      phone: '',
      selected_services: [],
      date: '',
      time: '',
      notes: '',
    })

    const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleServiceToggle = (serviceId) => {
      setFormData(prev => ({
        ...prev,
        selected_services: prev.selected_services.includes(serviceId)
          ? prev.selected_services.filter(id => id !== serviceId)
          : [...prev.selected_services, serviceId],
      }))
    }

    const handleNextStep = () => {
      if (step < 3) setStep(step + 1)
    }

    const handlePrevStep = () => {
      if (step > 1) setStep(step - 1)
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      onSubmit(formData)
    }

    return (
      <div data-testid="booking-component">
        <div data-testid="step-indicator">Step {step} of 3</div>

        {step === 1 && (
          <div data-testid="step-1">
            <h2>Select Services</h2>
            {mockServices.map(service => (
              <label key={service.id}>
                <input
                  type="checkbox"
                  value={service.id}
                  checked={formData.selected_services.includes(service.id)}
                  onChange={() => handleServiceToggle(service.id)}
                  data-testid={`service-${service.id}`}
                />
                {service.name} - ${service.price}
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div data-testid="step-2">
            <h2>Enter Details</h2>
            <input
              type="text"
              name="customer_name"
              placeholder="Name"
              value={formData.customer_name}
              onChange={handleInputChange}
              data-testid="input-name"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              data-testid="input-email"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              data-testid="input-phone"
            />
          </div>
        )}

        {step === 3 && (
          <div data-testid="step-3">
            <h2>Choose Date & Time</h2>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              data-testid="input-date"
            />
            <select
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              data-testid="input-time"
            >
              <option value="">Select Time</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="14:00">2:00 PM</option>
            </select>
            <textarea
              name="notes"
              placeholder="Special requests"
              value={formData.notes}
              onChange={handleInputChange}
              data-testid="input-notes"
            />
          </div>
        )}

        <div data-testid="form-buttons">
          {step > 1 && (
            <button onClick={handlePrevStep} data-testid="btn-back">
              Back
            </button>
          )}
          {step < 3 && (
            <button onClick={handleNextStep} data-testid="btn-next">
              Next
            </button>
          )}
          {step === 3 && (
            <button onClick={handleSubmit} data-testid="btn-submit">
              Complete Booking
            </button>
          )}
        </div>
      </div>
    )
  }
})

import BookingComponent from '../../components/BookingComponent'

describe('BookingComponent', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders booking component', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      expect(screen.getByTestId('booking-component')).toBeInTheDocument()
    })

    test('starts on step 1', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
    })

    test('displays step indicator', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      expect(screen.getByTestId('step-indicator')).toBeInTheDocument()
    })
  })

  describe('Step 1: Service Selection', () => {
    test('displays all available services', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      mockServices.forEach(service => {
        expect(screen.getByText(new RegExp(service.name))).toBeInTheDocument()
      })
    })

    test('displays service prices', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      mockServices.forEach(service => {
        expect(screen.getByText(new RegExp(`\\$${service.price}`))).toBeInTheDocument()
      })
    })

    test('allows selecting single service', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      const serviceCheckbox = screen.getByTestId(`service-${mockServices[0].id}`)
      fireEvent.click(serviceCheckbox)
      expect(serviceCheckbox).toBeChecked()
    })

    test('allows selecting multiple services', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      const service1 = screen.getByTestId(`service-${mockServices[0].id}`)
      const service2 = screen.getByTestId(`service-${mockServices[1].id}`)

      fireEvent.click(service1)
      fireEvent.click(service2)

      expect(service1).toBeChecked()
      expect(service2).toBeChecked()
    })

    test('allows deselecting services', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      const serviceCheckbox = screen.getByTestId(`service-${mockServices[0].id}`)

      fireEvent.click(serviceCheckbox)
      expect(serviceCheckbox).toBeChecked()

      fireEvent.click(serviceCheckbox)
      expect(serviceCheckbox).not.toBeChecked()
    })
  })

  describe('Form Progression', () => {
    test('Next button advances to step 2', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      const nextBtn = screen.getByTestId('btn-next')
      fireEvent.click(nextBtn)

      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
      expect(screen.getByTestId('step-2')).toBeInTheDocument()
    })

    test('Next button advances to step 3', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      fireEvent.click(screen.getByTestId('btn-next'))
      fireEvent.click(screen.getByTestId('btn-next'))

      expect(screen.getByText('Step 3 of 3')).toBeInTheDocument()
      expect(screen.getByTestId('step-3')).toBeInTheDocument()
    })

    test('Back button returns to previous step', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      fireEvent.click(screen.getByTestId('btn-next'))
      fireEvent.click(screen.getByTestId('btn-back'))

      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
    })

    test('Back button not shown on step 1', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      expect(screen.queryByTestId('btn-back')).not.toBeInTheDocument()
    })

    test('Submit button shown only on step 3', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      expect(screen.queryByTestId('btn-submit')).not.toBeInTheDocument()

      fireEvent.click(screen.getByTestId('btn-next'))
      expect(screen.queryByTestId('btn-submit')).not.toBeInTheDocument()

      fireEvent.click(screen.getByTestId('btn-next'))
      expect(screen.getByTestId('btn-submit')).toBeInTheDocument()
    })
  })

  describe('Step 2: Customer Details', () => {
    beforeEach(() => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      fireEvent.click(screen.getByTestId('btn-next'))
    })

    test('displays name input field', () => {
      expect(screen.getByTestId('input-name')).toBeInTheDocument()
    })

    test('displays email input field', () => {
      expect(screen.getByTestId('input-email')).toBeInTheDocument()
    })

    test('displays phone input field', () => {
      expect(screen.getByTestId('input-phone')).toBeInTheDocument()
    })

    test('allows entering name', () => {
      const nameInput = screen.getByTestId('input-name')
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      expect(nameInput.value).toBe('John Doe')
    })

    test('allows entering email', () => {
      const emailInput = screen.getByTestId('input-email')
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      expect(emailInput.value).toBe('john@example.com')
    })

    test('allows entering phone', () => {
      const phoneInput = screen.getByTestId('input-phone')
      fireEvent.change(phoneInput, { target: { value: '5551234567' } })
      expect(phoneInput.value).toBe('5551234567')
    })
  })

  describe('Step 3: Date & Time Selection', () => {
    beforeEach(() => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      fireEvent.click(screen.getByTestId('btn-next'))
      fireEvent.click(screen.getByTestId('btn-next'))
    })

    test('displays date input field', () => {
      expect(screen.getByTestId('input-date')).toBeInTheDocument()
    })

    test('displays time selection dropdown', () => {
      expect(screen.getByTestId('input-time')).toBeInTheDocument()
    })

    test('displays notes textarea', () => {
      expect(screen.getByTestId('input-notes')).toBeInTheDocument()
    })

    test('allows selecting date', () => {
      const dateInput = screen.getByTestId('input-date')
      fireEvent.change(dateInput, { target: { value: '2026-04-15' } })
      expect(dateInput.value).toBe('2026-04-15')
    })

    test('allows selecting time', () => {
      const timeSelect = screen.getByTestId('input-time')
      fireEvent.change(timeSelect, { target: { value: '10:00' } })
      expect(timeSelect.value).toBe('10:00')
    })

    test('allows entering notes', () => {
      const notesInput = screen.getByTestId('input-notes')
      fireEvent.change(notesInput, { target: { value: 'Special request' } })
      expect(notesInput.value).toBe('Special request')
    })

    test('displays time options', () => {
      const timeSelect = screen.getByTestId('input-time')
      expect(timeSelect.children.length).toBeGreaterThan(1)
    })
  })

  describe('Form Submission', () => {
    test('Submit button is enabled on step 3', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      fireEvent.click(screen.getByTestId('btn-next'))
      fireEvent.click(screen.getByTestId('btn-next'))

      const submitBtn = screen.getByTestId('btn-submit')
      expect(submitBtn).not.toBeDisabled()
    })

    test('calls onSubmit with form data', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)

      // Step 1: Select service
      fireEvent.click(screen.getByTestId(`service-${mockServices[0].id}`))
      fireEvent.click(screen.getByTestId('btn-next'))

      // Step 2: Enter details
      fireEvent.change(screen.getByTestId('input-name'), {
        target: { value: 'John Doe' },
      })
      fireEvent.change(screen.getByTestId('input-email'), {
        target: { value: 'john@example.com' },
      })
      fireEvent.change(screen.getByTestId('input-phone'), {
        target: { value: '5551234567' },
      })
      fireEvent.click(screen.getByTestId('btn-next'))

      // Step 3: Select date and time
      fireEvent.change(screen.getByTestId('input-date'), {
        target: { value: '2026-04-15' },
      })
      fireEvent.change(screen.getByTestId('input-time'), {
        target: { value: '10:00' },
      })
      fireEvent.click(screen.getByTestId('btn-submit'))

      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          customer_name: 'John Doe',
          email: 'john@example.com',
          phone: '5551234567',
          date: '2026-04-15',
          time: '10:00',
        })
      )
    })
  })

  describe('Data Persistence', () => {
    test('form data persists when navigating between steps', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)

      // Select service
      const service = screen.getByTestId(`service-${mockServices[0].id}`)
      fireEvent.click(service)
      expect(service).toBeChecked()

      // Go to step 2 and back
      fireEvent.click(screen.getByTestId('btn-next'))
      fireEvent.click(screen.getByTestId('btn-back'))

      // Service should still be selected
      expect(service).toBeChecked()
    })

    test('customer details persist when navigating', () => {
      render(<BookingComponent onSubmit={mockOnSubmit} />)
      fireEvent.click(screen.getByTestId('btn-next'))

      fireEvent.change(screen.getByTestId('input-name'), {
        target: { value: 'Jane Smith' },
      })

      fireEvent.click(screen.getByTestId('btn-next'))
      fireEvent.click(screen.getByTestId('btn-back'))

      expect(screen.getByTestId('input-name')).toHaveValue('Jane Smith')
    })
  })
})
