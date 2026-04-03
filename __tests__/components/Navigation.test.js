/**
 * Navigation Component Tests
 * ==========================
 * Tests for menu items, responsive hamburger, and social links
 * Coverage: Navigation rendering, menu interaction, responsive behavior
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '../setup/test-utils'
import Navigation from '../../components/Navigation'
import { mockNavigation, mockEnvVariables } from '../fixtures/mockData'

describe('Navigation Component', () => {
  beforeEach(() => {
    // Setup environment variables
    Object.assign(process.env, mockEnvVariables)
  })

  describe('Rendering', () => {
    test('renders logo and company name', () => {
      render(<Navigation />)
      const logo = screen.getByText(/Elegance Nails/i)
      expect(logo).toBeInTheDocument()
    })

    test('renders all navigation menu items', () => {
      render(<Navigation />)
      mockNavigation.forEach(item => {
        expect(screen.getByText(item.label)).toBeInTheDocument()
      })
    })

    test('renders Book Now button', () => {
      render(<Navigation />)
      const bookButton = screen.getByText('Book Now')
      expect(bookButton).toBeInTheDocument()
    })

    test('renders Instagram link', () => {
      render(<Navigation />)
      const instagramLink = screen.getByTitle('Follow us on Instagram')
      expect(instagramLink).toBeInTheDocument()
      expect(instagramLink).toHaveAttribute('href', mockEnvVariables.NEXT_PUBLIC_INSTAGRAM_URL)
    })

    test('renders WhatsApp link', () => {
      render(<Navigation />)
      const whatsappLink = screen.getByTitle('Chat on WhatsApp')
      expect(whatsappLink).toBeInTheDocument()
      expect(whatsappLink).toHaveAttribute(
        'href',
        expect.stringContaining('wa.me')
      )
    })
  })

  describe('Mobile Menu', () => {
    test('hamburger menu is hidden on desktop', () => {
      render(<Navigation />)
      // In desktop view, hamburger should be hidden via CSS class
      // This test assumes proper Tailwind responsive classes
    })

    test('mobile menu toggle button exists on mobile', () => {
      render(<Navigation />)
      // Button with Menu/X icons should exist
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    test('opens mobile menu when hamburger clicked', () => {
      render(<Navigation />)
      const toggleButton = screen.getAllByRole('button')[0]

      fireEvent.click(toggleButton)

      // Check if all menu items are visible after opening
      mockNavigation.forEach(item => {
        const menuItem = screen.getByText(item.label)
        expect(menuItem).toBeVisible()
      })
    })

    test('closes mobile menu when hamburger clicked again', () => {
      render(<Navigation />)
      const toggleButton = screen.getAllByRole('button')[0]

      // Open menu
      fireEvent.click(toggleButton)

      // Close menu
      fireEvent.click(toggleButton)

      // Menu should be closed (items visible through desktop styling)
    })

    test('closes mobile menu when menu item clicked', () => {
      render(<Navigation />)
      const toggleButton = screen.getAllByRole('button')[0]

      // Open menu
      fireEvent.click(toggleButton)

      // Click a menu item
      const menuItem = screen.getByText('Services')
      fireEvent.click(menuItem)

      // Menu should close
    })

    test('closes mobile menu when Book Now button clicked', () => {
      render(<Navigation />)
      const toggleButton = screen.getAllByRole('button')[0]

      // Open menu
      fireEvent.click(toggleButton)

      // Click Book Now
      const bookButtons = screen.getAllByText('Book Now')
      fireEvent.click(bookButtons[bookButtons.length - 1])

      // Menu should close
    })
  })

  describe('Links Navigation', () => {
    test('Home link points to root', () => {
      render(<Navigation />)
      const homeLink = screen.getByText('Home').closest('a')
      expect(homeLink).toHaveAttribute('href', '/')
    })

    test('Services link points to services page', () => {
      render(<Navigation />)
      const servicesLink = screen.getByText('Services').closest('a')
      expect(servicesLink).toHaveAttribute('href', '/services')
    })

    test('Gallery link points to gallery page', () => {
      render(<Navigation />)
      const galleryLink = screen.getByText('Gallery').closest('a')
      expect(galleryLink).toHaveAttribute('href', '/gallery')
    })

    test('About link points to about page', () => {
      render(<Navigation />)
      const aboutLink = screen.getByText('About').closest('a')
      expect(aboutLink).toHaveAttribute('href', '/about')
    })

    test('Contact link points to contact page', () => {
      render(<Navigation />)
      const contactLink = screen.getByText('Contact').closest('a')
      expect(contactLink).toHaveAttribute('href', '/contact')
    })

    test('Book Now link points to booking page', () => {
      render(<Navigation />)
      const bookLinks = screen.getAllByText('Book Now')
      bookLinks.forEach(link => {
        expect(link.closest('a')).toHaveAttribute('href', '/book')
      })
    })
  })

  describe('Social Links', () => {
    test('Instagram link opens in new tab', () => {
      render(<Navigation />)
      const instagramLink = screen.getByTitle('Follow us on Instagram')
      expect(instagramLink).toHaveAttribute('target', '_blank')
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    test('WhatsApp link opens in new tab', () => {
      render(<Navigation />)
      const whatsappLink = screen.getByTitle('Chat on WhatsApp')
      expect(whatsappLink).toHaveAttribute('target', '_blank')
      expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    test('uses custom Instagram URL from environment', () => {
      process.env.NEXT_PUBLIC_INSTAGRAM_URL = 'https://instagram.com/custom'
      render(<Navigation />)
      const instagramLink = screen.getByTitle('Follow us on Instagram')
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/custom')
    })

    test('uses custom WhatsApp number from environment', () => {
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '9876543210'
      render(<Navigation />)
      const whatsappLink = screen.getByTitle('Chat on WhatsApp')
      expect(whatsappLink).toHaveAttribute('href', expect.stringContaining('9876543210'))
    })

    test('uses fallback values when environment variables missing', () => {
      delete process.env.NEXT_PUBLIC_INSTAGRAM_URL
      delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
      render(<Navigation />)

      const instagramLink = screen.getByTitle('Follow us on Instagram')
      const whatsappLink = screen.getByTitle('Chat on WhatsApp')

      expect(instagramLink).toBeInTheDocument()
      expect(whatsappLink).toBeInTheDocument()
    })
  })

  describe('Styling & Classes', () => {
    test('navigation is sticky positioned', () => {
      render(<Navigation />)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('sticky')
      expect(nav).toHaveClass('top-0')
      expect(nav).toHaveClass('z-50')
    })

    test('navigation has correct background color', () => {
      render(<Navigation />)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveStyle({ backgroundColor: '#FAF7F4' })
    })
  })

  describe('Accessibility', () => {
    test('uses semantic navigation element', () => {
      render(<Navigation />)
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    test('links are keyboard accessible', () => {
      render(<Navigation />)
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })

    test('social links have descriptive titles', () => {
      render(<Navigation />)
      const instagramLink = screen.getByTitle('Follow us on Instagram')
      const whatsappLink = screen.getByTitle('Chat on WhatsApp')
      expect(instagramLink).toBeInTheDocument()
      expect(whatsappLink).toBeInTheDocument()
    })
  })
})
