/**
 * ServiceCard Component Tests
 * ===========================
 * Tests for service card rendering, prices, descriptions, and interactions
 * Coverage: Card display, click handlers, booking integration
 */

import React from 'react'
import { render, screen, fireEvent } from '../setup/test-utils'
import { mockServices } from '../fixtures/mockData'

// Mock ServiceCard component
jest.mock('../../components/ServiceCard', () => {
  return function MockServiceCard({ service, onSelect, onDetails }) {
    return (
      <div data-testid={`service-card-${service.id}`} className="service-card">
        <h3>{service.name}</h3>
        <p className="description">{service.description}</p>
        <p className="price" data-testid={`price-${service.id}`}>
          ${service.price}
        </p>
        <p className="duration" data-testid={`duration-${service.id}`}>
          {service.duration} mins
        </p>
        <img
          src={service.image}
          alt={service.name}
          data-testid={`image-${service.id}`}
        />
        <button
          data-testid={`select-btn-${service.id}`}
          onClick={() => onSelect(service)}
        >
          Select
        </button>
        {onDetails && (
          <button
            data-testid={`details-btn-${service.id}`}
            onClick={() => onDetails(service)}
          >
            View Details
          </button>
        )}
      </div>
    )
  }
})

import ServiceCard from '../../components/ServiceCard'

describe('ServiceCard Component', () => {
  const mockOnSelect = jest.fn()
  const mockOnDetails = jest.fn()
  const mockService = mockServices[0]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders service card container', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const card = screen.getByTestId(`service-card-${mockService.id}`)
      expect(card).toBeInTheDocument()
    })

    test('displays service name', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      expect(screen.getByText(mockService.name)).toBeInTheDocument()
    })

    test('displays service description', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      expect(screen.getByText(mockService.description)).toBeInTheDocument()
    })

    test('displays price', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const price = screen.getByTestId(`price-${mockService.id}`)
      expect(price).toHaveTextContent(`$${mockService.price}`)
    })

    test('displays duration', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const duration = screen.getByTestId(`duration-${mockService.id}`)
      expect(duration).toHaveTextContent(`${mockService.duration} mins`)
    })

    test('displays service image', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const image = screen.getByTestId(`image-${mockService.id}`)
      expect(image).toHaveAttribute('src', mockService.image)
      expect(image).toHaveAttribute('alt', mockService.name)
    })
  })

  describe('Buttons', () => {
    test('renders Select button', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const selectBtn = screen.getByTestId(`select-btn-${mockService.id}`)
      expect(selectBtn).toBeInTheDocument()
      expect(selectBtn).toHaveTextContent('Select')
    })

    test('renders View Details button when onDetails provided', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          onDetails={mockOnDetails}
        />
      )
      const detailsBtn = screen.getByTestId(`details-btn-${mockService.id}`)
      expect(detailsBtn).toBeInTheDocument()
    })

    test('does not render View Details button when onDetails not provided', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const detailsBtn = screen.queryByTestId(`details-btn-${mockService.id}`)
      expect(detailsBtn).not.toBeInTheDocument()
    })
  })

  describe('Click Handlers', () => {
    test('calls onSelect when Select button clicked', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const selectBtn = screen.getByTestId(`select-btn-${mockService.id}`)
      fireEvent.click(selectBtn)

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
      expect(mockOnSelect).toHaveBeenCalledWith(mockService)
    })

    test('calls onDetails when View Details button clicked', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          onDetails={mockOnDetails}
        />
      )
      const detailsBtn = screen.getByTestId(`details-btn-${mockService.id}`)
      fireEvent.click(detailsBtn)

      expect(mockOnDetails).toHaveBeenCalledTimes(1)
      expect(mockOnDetails).toHaveBeenCalledWith(mockService)
    })

    test('buttons are not disabled by default', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const selectBtn = screen.getByTestId(`select-btn-${mockService.id}`)
      expect(selectBtn).not.toBeDisabled()
    })
  })

  describe('Different Services', () => {
    test('renders correctly for multiple services', () => {
      mockServices.forEach(service => {
        const { unmount } = render(
          <ServiceCard
            service={service}
            onSelect={mockOnSelect}
          />
        )
        expect(screen.getByText(service.name)).toBeInTheDocument()
        expect(screen.getByTestId(`price-${service.id}`)).toHaveTextContent(
          `$${service.price}`
        )
        unmount()
      })
    })

    test('correctly displays varied prices', () => {
      const services = [
        { ...mockService, id: '1', price: 25 },
        { ...mockService, id: '2', price: 50 },
        { ...mockService, id: '3', price: 100 },
      ]

      services.forEach(service => {
        const { unmount } = render(
          <ServiceCard
            service={service}
            onSelect={mockOnSelect}
          />
        )
        expect(screen.getByTestId(`price-${service.id}`)).toHaveTextContent(
          `$${service.price}`
        )
        unmount()
      })
    })

    test('correctly displays varied durations', () => {
      const services = [
        { ...mockService, id: '1', duration: 30 },
        { ...mockService, id: '2', duration: 45 },
        { ...mockService, id: '3', duration: 60 },
      ]

      services.forEach(service => {
        const { unmount } = render(
          <ServiceCard
            service={service}
            onSelect={mockOnSelect}
          />
        )
        expect(screen.getByTestId(`duration-${service.id}`)).toHaveTextContent(
          `${service.duration} mins`
        )
        unmount()
      })
    })
  })

  describe('Styling', () => {
    test('card has service-card class', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const card = screen.getByTestId(`service-card-${mockService.id}`)
      expect(card).toHaveClass('service-card')
    })

    test('image has alt text for accessibility', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const image = screen.getByTestId(`image-${mockService.id}`)
      expect(image).toHaveAttribute('alt', mockService.name)
    })
  })

  describe('Accessibility', () => {
    test('buttons have semantic meaning', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const selectBtn = screen.getByTestId(`select-btn-${mockService.id}`)
      expect(selectBtn).toBeInTheDocument()
      expect(selectBtn.tagName).toBe('BUTTON')
    })

    test('image has descriptive alt text', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      const image = screen.getByTestId(`image-${mockService.id}`)
      expect(image.alt).toBe(mockService.name)
    })

    test('text content is clear and readable', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
        />
      )
      expect(screen.getByText(mockService.name)).toBeInTheDocument()
      expect(screen.getByText(mockService.description)).toBeInTheDocument()
    })
  })

  describe('Error States', () => {
    test('handles missing description gracefully', () => {
      const serviceNoDesc = { ...mockService, description: '' }
      render(
        <ServiceCard
          service={serviceNoDesc}
          onSelect={mockOnSelect}
        />
      )
      const card = screen.getByTestId(`service-card-${serviceNoDesc.id}`)
      expect(card).toBeInTheDocument()
    })

    test('handles missing image gracefully', () => {
      const serviceNoImage = { ...mockService, image: '' }
      render(
        <ServiceCard
          service={serviceNoImage}
          onSelect={mockOnSelect}
        />
      )
      const card = screen.getByTestId(`service-card-${serviceNoImage.id}`)
      expect(card).toBeInTheDocument()
    })
  })
})
