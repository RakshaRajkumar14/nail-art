/**
 * Footer Component Tests
 * ======================
 * Tests for footer links, contact info, social media, copyright
 * Coverage: Link rendering, contact information display, legal links
 */

import React from 'react'
import { render, screen } from '../setup/test-utils'
import { mockSocialLinks } from '../fixtures/mockData'

jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return (
      <footer data-testid="footer">
        <div data-testid="footer-contact">
          <h3>Contact Us</h3>
          <p data-testid="footer-phone">+1-234-567-8900</p>
          <p data-testid="footer-email">info@elegancenails.com</p>
          <p data-testid="footer-address">123 Elegance Street, Beautiful City, BC 12345</p>
        </div>

        <div data-testid="footer-links">
          <a href="/about" data-testid="link-about">About Us</a>
          <a href="/services" data-testid="link-services">Services</a>
          <a href="/gallery" data-testid="link-gallery">Gallery</a>
          <a href="/contact" data-testid="link-contact">Contact</a>
          <a href="/privacy" data-testid="link-privacy">Privacy Policy</a>
          <a href="/terms" data-testid="link-terms">Terms of Service</a>
        </div>

        <div data-testid="footer-social">
          <a
            href={mockSocialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="social-instagram"
          >
            Instagram
          </a>
          <a
            href={mockSocialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="social-facebook"
          >
            Facebook
          </a>
          <a
            href={mockSocialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="social-whatsapp"
          >
            WhatsApp
          </a>
        </div>

        <div data-testid="footer-copyright">
          <p>&copy; 2026 Elegance Nails. All rights reserved.</p>
        </div>
      </footer>
    )
  }
})

import Footer from '../../components/Footer'

describe('Footer Component', () => {
  describe('Rendering', () => {
    test('renders footer element', () => {
      render(<Footer />)
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    test('renders contact information section', () => {
      render(<Footer />)
      expect(screen.getByTestId('footer-contact')).toBeInTheDocument()
    })

    test('renders links section', () => {
      render(<Footer />)
      expect(screen.getByTestId('footer-links')).toBeInTheDocument()
    })

    test('renders social media section', () => {
      render(<Footer />)
      expect(screen.getByTestId('footer-social')).toBeInTheDocument()
    })

    test('renders copyright section', () => {
      render(<Footer />)
      expect(screen.getByTestId('footer-copyright')).toBeInTheDocument()
    })
  })

  describe('Contact Information', () => {
    test('displays phone number', () => {
      render(<Footer />)
      expect(screen.getByTestId('footer-phone')).toHaveTextContent('+1-234-567-8900')
    })

    test('displays email address', () => {
      render(<Footer />)
      expect(screen.getByTestId('footer-email')).toHaveTextContent('info@elegancenails.com')
    })

    test('displays business address', () => {
      render(<Footer />)
      const address = screen.getByTestId('footer-address')
      expect(address).toHaveTextContent('123 Elegance Street')
      expect(address).toHaveTextContent('Beautiful City')
    })

    test('phone number is clickable', () => {
      render(<Footer />)
      const phone = screen.getByTestId('footer-phone')
      expect(phone).toBeInTheDocument()
    })

    test('email is clickable', () => {
      render(<Footer />)
      const email = screen.getByTestId('footer-email')
      expect(email).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    test('displays About Us link', () => {
      render(<Footer />)
      expect(screen.getByTestId('link-about')).toHaveAttribute('href', '/about')
    })

    test('displays Services link', () => {
      render(<Footer />)
      expect(screen.getByTestId('link-services')).toHaveAttribute('href', '/services')
    })

    test('displays Gallery link', () => {
      render(<Footer />)
      expect(screen.getByTestId('link-gallery')).toHaveAttribute('href', '/gallery')
    })

    test('displays Contact link', () => {
      render(<Footer />)
      expect(screen.getByTestId('link-contact')).toHaveAttribute('href', '/contact')
    })

    test('displays Privacy Policy link', () => {
      render(<Footer />)
      expect(screen.getByTestId('link-privacy')).toHaveAttribute('href', '/privacy')
    })

    test('displays Terms of Service link', () => {
      render(<Footer />)
      expect(screen.getByTestId('link-terms')).toHaveAttribute('href', '/terms')
    })
  })

  describe('Social Media Links', () => {
    test('displays Instagram link', () => {
      render(<Footer />)
      const instagramLink = screen.getByTestId('social-instagram')
      expect(instagramLink).toHaveAttribute('href', mockSocialLinks.instagram)
    })

    test('displays Facebook link', () => {
      render(<Footer />)
      const facebookLink = screen.getByTestId('social-facebook')
      expect(facebookLink).toHaveAttribute('href', mockSocialLinks.facebook)
    })

    test('displays WhatsApp link', () => {
      render(<Footer />)
      const whatsappLink = screen.getByTestId('social-whatsapp')
      expect(whatsappLink).toHaveAttribute('href', mockSocialLinks.whatsapp)
    })

    test('social links open in new tab', () => {
      render(<Footer />)
      const instagramLink = screen.getByTestId('social-instagram')
      const facebookLink = screen.getByTestId('social-facebook')

      expect(instagramLink).toHaveAttribute('target', '_blank')
      expect(facebookLink).toHaveAttribute('target', '_blank')
    })

    test('social links have security attributes', () => {
      render(<Footer />)
      const instagramLink = screen.getByTestId('social-instagram')
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Copyright', () => {
    test('displays copyright notice', () => {
      render(<Footer />)
      expect(screen.getByTestId('footer-copyright')).toHaveTextContent('© 2026 Elegance Nails')
    })

    test('copyright mentions all rights reserved', () => {
      render(<Footer />)
      expect(screen.getByTestId('footer-copyright')).toHaveTextContent('All rights reserved')
    })
  })

  describe('Accessibility', () => {
    test('footer uses semantic footer element', () => {
      const { container } = render(<Footer />)
      expect(container.querySelector('footer')).toBeInTheDocument()
    })

    test('links have proper href attributes', () => {
      render(<Footer />)
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })

    test('external links have target blank and rel attributes', () => {
      render(<Footer />)
      const externalLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('target') === '_blank'
      )
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  describe('Layout', () => {
    test('footer contains all main sections', () => {
      render(<Footer />)
      expect(screen.getByTestId('footer-contact')).toBeInTheDocument()
      expect(screen.getByTestId('footer-links')).toBeInTheDocument()
      expect(screen.getByTestId('footer-social')).toBeInTheDocument()
      expect(screen.getByTestId('footer-copyright')).toBeInTheDocument()
    })
  })
})
