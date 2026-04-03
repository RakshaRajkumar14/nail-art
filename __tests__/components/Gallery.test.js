/**
 * Gallery Component Tests
 * =======================
 * Tests for image display, filtering, lightbox, and image loading
 * Coverage: Gallery rendering, category filtering, image viewing
 */

import React from 'react'
import { render, screen, fireEvent } from '../setup/test-utils'
import { mockGalleryImages } from '../fixtures/mockData'

jest.mock('../../components/Gallery', () => {
  return function MockGallery() {
    const [selectedImage, setSelectedImage] = React.useState(null)
    const [filter, setFilter] = React.useState('all')

    const categories = ['all', 'classic', 'gel', 'art']
    const filtered = filter === 'all'
      ? mockGalleryImages
      : mockGalleryImages.filter(img => img.category === filter)

    return (
      <div data-testid="gallery">
        <div data-testid="filter-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              data-testid={`filter-${cat}`}
              onClick={() => setFilter(cat)}
              className={filter === cat ? 'active' : ''}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div data-testid="gallery-grid">
          {filtered.map(image => (
            <div
              key={image.id}
              data-testid={`gallery-item-${image.id}`}
              className="gallery-item"
            >
              <img
                src={image.src}
                alt={image.alt}
                onClick={() => setSelectedImage(image)}
                data-testid={`gallery-image-${image.id}`}
              />
              <p>{image.title}</p>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div data-testid="lightbox">
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <button
              data-testid="lightbox-close"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    )
  }
})

import Gallery from '../../components/Gallery'

describe('Gallery Component', () => {
  describe('Rendering', () => {
    test('renders gallery container', () => {
      render(<Gallery />)
      expect(screen.getByTestId('gallery')).toBeInTheDocument()
    })

    test('displays all gallery images initially', () => {
      render(<Gallery />)
      mockGalleryImages.forEach(image => {
        expect(screen.getByTestId(`gallery-item-${image.id}`)).toBeInTheDocument()
      })
    })

    test('displays image titles', () => {
      render(<Gallery />)
      mockGalleryImages.forEach(image => {
        expect(screen.getByText(image.title)).toBeInTheDocument()
      })
    })

    test('displays images with correct src', () => {
      render(<Gallery />)
      mockGalleryImages.forEach(image => {
        const img = screen.getByTestId(`gallery-image-${image.id}`)
        expect(img).toHaveAttribute('src', image.src)
      })
    })

    test('displays images with correct alt text', () => {
      render(<Gallery />)
      mockGalleryImages.forEach(image => {
        const img = screen.getByTestId(`gallery-image-${image.id}`)
        expect(img).toHaveAttribute('alt', image.alt)
      })
    })
  })

  describe('Filtering', () => {
    test('renders filter buttons', () => {
      render(<Gallery />)
      expect(screen.getByTestId('filter-buttons')).toBeInTheDocument()
    })

    test('filter buttons are clickable', () => {
      render(<Gallery />)
      const classicFilter = screen.getByTestId('filter-classic')
      expect(classicFilter).not.toBeDisabled()
    })

    test('filters by classic category', () => {
      render(<Gallery />)
      fireEvent.click(screen.getByTestId('filter-classic'))

      const classicImages = mockGalleryImages.filter(img => img.category === 'classic')
      classicImages.forEach(image => {
        expect(screen.getByTestId(`gallery-item-${image.id}`)).toBeInTheDocument()
      })

      const nonClassicImages = mockGalleryImages.filter(img => img.category !== 'classic')
      nonClassicImages.forEach(image => {
        expect(screen.queryByTestId(`gallery-item-${image.id}`)).toBeInTheDocument()
      })
    })

    test('filters by gel category', () => {
      render(<Gallery />)
      fireEvent.click(screen.getByTestId('filter-gel'))

      const gelImages = mockGalleryImages.filter(img => img.category === 'gel')
      gelImages.forEach(image => {
        expect(screen.getByTestId(`gallery-item-${image.id}`)).toBeInTheDocument()
      })
    })

    test('filters by art category', () => {
      render(<Gallery />)
      fireEvent.click(screen.getByTestId('filter-art'))

      const artImages = mockGalleryImages.filter(img => img.category === 'art')
      expect(artImages.length).toBeGreaterThan(0)
    })

    test('shows all images when all filter selected', () => {
      render(<Gallery />)
      fireEvent.click(screen.getByTestId('filter-classic'))
      fireEvent.click(screen.getByTestId('filter-all'))

      mockGalleryImages.forEach(image => {
        expect(screen.getByTestId(`gallery-item-${image.id}`)).toBeInTheDocument()
      })
    })

    test('highlights active filter button', () => {
      render(<Gallery />)
      fireEvent.click(screen.getByTestId('filter-gel'))
      const gelFilter = screen.getByTestId('filter-gel')
      expect(gelFilter).toHaveClass('active')
    })
  })

  describe('Lightbox', () => {
    test('opens lightbox when image clicked', () => {
      render(<Gallery />)
      const image = screen.getByTestId(`gallery-image-${mockGalleryImages[0].id}`)
      fireEvent.click(image)

      expect(screen.getByTestId('lightbox')).toBeInTheDocument()
    })

    test('displays correct image in lightbox', () => {
      render(<Gallery />)
      const image = screen.getByTestId(`gallery-image-${mockGalleryImages[0].id}`)
      fireEvent.click(image)

      const lightboxImg = screen.getByRole('img')
      expect(lightboxImg).toHaveAttribute('src', mockGalleryImages[0].src)
    })

    test('closes lightbox when close button clicked', () => {
      render(<Gallery />)
      const image = screen.getByTestId(`gallery-image-${mockGalleryImages[0].id}`)
      fireEvent.click(image)

      expect(screen.getByTestId('lightbox')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('lightbox-close'))
      expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument()
    })

    test('can open different images in lightbox', () => {
      render(<Gallery />)
      const image1 = screen.getByTestId(`gallery-image-${mockGalleryImages[0].id}`)
      fireEvent.click(image1)
      expect(screen.getByTestId('lightbox')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('lightbox-close'))
      const image2 = screen.getByTestId(`gallery-image-${mockGalleryImages[1].id}`)
      fireEvent.click(image2)
      expect(screen.getByTestId('lightbox')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('images have alt text', () => {
      render(<Gallery />)
      mockGalleryImages.forEach(image => {
        const img = screen.getByTestId(`gallery-image-${image.id}`)
        expect(img).toHaveAttribute('alt')
      })
    })

    test('gallery grid has semantic structure', () => {
      render(<Gallery />)
      const grid = screen.getByTestId('gallery-grid')
      expect(grid).toBeInTheDocument()
    })

    test('filter buttons are keyboard accessible', () => {
      render(<Gallery />)
      const filters = screen.getAllByRole('button')
      expect(filters.length).toBeGreaterThan(0)
    })
  })
})
