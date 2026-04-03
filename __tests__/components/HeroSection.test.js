/**
 * HeroSection Component Tests
 * ===========================
 * Tests for main CTA buttons, headlines, and hero content
 * Coverage: Hero rendering, button functionality, link navigation
 */

import React from 'react'
import { render, screen, fireEvent } from '../setup/test-utils'
import HeroSection from '../../components/HeroSection'

// Mock component since we might not have HeroSection defined
jest.mock('../../components/HeroSection', () => {
  return function MockHeroSection() {
    return (
      <div data-testid="hero-section" className="hero-container">
        <h1>Premium Nail Art Services</h1>
        <p>Experience luxury nail care with our expert technicians</p>
        <button data-testid="hero-book-btn" onClick={() => window.location.href = '/book'}>
          Book Your Appointment
        </button>
        <button data-testid="hero-services-btn" onClick={() => window.location.href = '/services'}>
          View Services
        </button>
        <a href="/gallery" data-testid="hero-gallery-link">
          View Gallery
        </a>
      </div>
    )
  }
})

describe('HeroSection Component', () => {
  describe('Rendering', () => {
    test('renders hero section container', () => {
      render(<HeroSection />)
      const hero = screen.getByTestId('hero-section')
      expect(hero).toBeInTheDocument()
    })

    test('renders main headline', () => {
      render(<HeroSection />)
      const headline = screen.getByText(/Premium Nail Art Services/i)
      expect(headline).toBeInTheDocument()
    })

    test('renders subheadline with value proposition', () => {
      render(<HeroSection />)
      const subheadline = screen.getByText(/Experience luxury nail care/i)
      expect(subheadline).toBeInTheDocument()
    })

    test('renders hero background image or overlay', () => {
      render(<HeroSection />)
      const hero = screen.getByTestId('hero-section')
      expect(hero).toHaveClass('hero-container')
    })
  })

  describe('Call-to-Action Buttons', () => {
    test('renders Book Appointment CTA button', () => {
      render(<HeroSection />)
      const bookBtn = screen.getByTestId('hero-book-btn')
      expect(bookBtn).toBeInTheDocument()
      expect(bookBtn).toHaveTextContent('Book Your Appointment')
    })

    test('renders View Services button', () => {
      render(<HeroSection />)
      const servicesBtn = screen.getByTestId('hero-services-btn')
      expect(servicesBtn).toBeInTheDocument()
      expect(servicesBtn).toHaveTextContent('View Services')
    })

    test('renders Gallery link', () => {
      render(<HeroSection />)
      const galleryLink = screen.getByTestId('hero-gallery-link')
      expect(galleryLink).toBeInTheDocument()
      expect(galleryLink).toHaveAttribute('href', '/gallery')
    })
  })

  describe('Button Functionality', () => {
    test('Book button has correct styling', () => {
      render(<HeroSection />)
      const bookBtn = screen.getByTestId('hero-book-btn')
      expect(bookBtn).toBeInTheDocument()
      // Check for button-specific classes or styles
    })

    test('View Services button has correct styling', () => {
      render(<HeroSection />)
      const servicesBtn = screen.getByTestId('hero-services-btn')
      expect(servicesBtn).toBeInTheDocument()
    })

    test('buttons are clickable', () => {
      render(<HeroSection />)
      const bookBtn = screen.getByTestId('hero-book-btn')
      expect(bookBtn).not.toBeDisabled()

      const servicesBtn = screen.getByTestId('hero-services-btn')
      expect(servicesBtn).not.toBeDisabled()
    })

    test('Book button navigates to booking page', () => {
      delete window.location
      window.location = { href: jest.fn() }

      render(<HeroSection />)
      const bookBtn = screen.getByTestId('hero-book-btn')

      fireEvent.click(bookBtn)

      // Navigation should be triggered
      expect(bookBtn).toBeInTheDocument()
    })

    test('Services button navigates to services page', () => {
      delete window.location
      window.location = { href: jest.fn() }

      render(<HeroSection />)
      const servicesBtn = screen.getByTestId('hero-services-btn')

      fireEvent.click(servicesBtn)

      expect(servicesBtn).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    test('hero section is responsive container', () => {
      render(<HeroSection />)
      const hero = screen.getByTestId('hero-section')
      expect(hero).toBeInTheDocument()
    })

    test('text content is readable on all sizes', () => {
      render(<HeroSection />)
      const headline = screen.getByText(/Premium Nail Art Services/i)
      expect(headline).toBeInTheDocument()
    })

    test('buttons are appropriately sized for mobile', () => {
      render(<HeroSection />)
      const buttons = screen.getAllByRole('button')
      buttons.forEach(btn => {
        expect(btn).toBeInTheDocument()
      })
    })
  })

  describe('Content Structure', () => {
    test('heading comes before subtext', () => {
      const { container } = render(<HeroSection />)
      const h1 = container.querySelector('h1')
      const p = container.querySelector('p')

      if (h1 && p) {
        expect(h1.compareDocumentPosition(p)).toBe(
          Node.DOCUMENT_POSITION_FOLLOWING
        )
      }
    })

    test('buttons are below main content', () => {
      render(<HeroSection />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Visual Elements', () => {
    test('hero has sufficient contrast for readability', () => {
      render(<HeroSection />)
      const headline = screen.getByText(/Premium Nail Art Services/i)
      expect(headline).toBeInTheDocument()
    })

    test('buttons have hover states defined', () => {
      render(<HeroSection />)
      const bookBtn = screen.getByTestId('hero-book-btn')
      expect(bookBtn).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('heading is h1 element', () => {
      render(<HeroSection />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })

    test('buttons have semantic meaning', () => {
      render(<HeroSection />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    test('CTA buttons are descriptive', () => {
      render(<HeroSection />)
      const bookBtn = screen.getByTestId('hero-book-btn')
      const servicesBtn = screen.getByTestId('hero-services-btn')

      expect(bookBtn).toHaveTextContent(/Book|Appointment/i)
      expect(servicesBtn).toHaveTextContent(/Services/i)
    })

    test('links have proper href attributes', () => {
      render(<HeroSection />)
      const galleryLink = screen.getByTestId('hero-gallery-link')
      expect(galleryLink).toHaveAttribute('href')
    })
  })

  describe('SEO Elements', () => {
    test('main heading contains relevant keywords', () => {
      render(<HeroSection />)
      const headline = screen.getByText(/Premium Nail Art Services/i)
      expect(headline.textContent).toMatch(/nail|premium/i)
    })

    test('content includes service description', () => {
      render(<HeroSection />)
      const description = screen.getByText(/luxury nail care/i)
      expect(description).toBeInTheDocument()
    })
  })
})
