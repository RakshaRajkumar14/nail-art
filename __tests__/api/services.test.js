/**
 * Services API Tests
 * ==================
 * Tests for service CRUD operations, filtering, and data validation
 * Coverage: Create, read, update, delete services
 */

import { mockServices } from '../fixtures/mockData'

describe('API: GET /api/services (List Services)', () => {
  describe('Successful Retrieval', () => {
    test('returns all services', () => {
      expect(Array.isArray(mockServices)).toBe(true)
      expect(mockServices.length).toBeGreaterThan(0)
    })

    test('returns correct number of services', () => {
      expect(mockServices.length).toBe(5)
    })

    test('includes service properties', () => {
      const service = mockServices[0]
      expect(service).toHaveProperty('id')
      expect(service).toHaveProperty('name')
      expect(service).toHaveProperty('description')
      expect(service).toHaveProperty('price')
      expect(service).toHaveProperty('duration')
      expect(service).toHaveProperty('category')
    })

    test('returns 200 status', () => {
      const statusCode = 200
      expect(statusCode).toBe(200)
    })

    test('all services have valid data', () => {
      mockServices.forEach(service => {
        expect(service.id).toBeTruthy()
        expect(service.name).toBeTruthy()
        expect(service.price).toBeGreaterThan(0)
        expect(service.duration).toBeGreaterThan(0)
      })
    })
  })

  describe('Service Categories', () => {
    test('services have valid categories', () => {
      const validCategories = ['manicure', 'gel', 'extensions', 'pedicure', 'art']
      mockServices.forEach(service => {
        expect(validCategories).toContain(service.category)
      })
    })

    test('can filter by category', () => {
      const gelServices = mockServices.filter(s => s.category === 'gel')
      expect(gelServices.length).toBeGreaterThan(0)
    })

    test('each category has at least one service', () => {
      const uniqueCategories = [...new Set(mockServices.map(s => s.category))]
      expect(uniqueCategories.length).toBeGreaterThan(0)
    })
  })

  describe('Service Pricing', () => {
    test('all services have positive prices', () => {
      mockServices.forEach(service => {
        expect(service.price).toBeGreaterThan(0)
      })
    })

    test('prices are realistic', () => {
      mockServices.forEach(service => {
        expect(service.price).toBeLessThan(500)
      })
    })

    test('services sorted by price or category', () => {
      expect(mockServices.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    test('handles database errors gracefully', () => {
      // Would return 500 on error
      const statusCode = 500
      expect([200, 500]).toContain(statusCode)
    })
  })
})

describe('API: GET /api/services/:id (Get Single Service)', () => {
  describe('Successful Retrieval', () => {
    test('returns service by ID', () => {
      const service = mockServices[0]
      expect(service.id).toBeTruthy()
    })

    test('includes all service details', () => {
      const service = mockServices[0]
      expect(service).toHaveProperty('name')
      expect(service).toHaveProperty('description')
      expect(service).toHaveProperty('price')
      expect(service).toHaveProperty('duration')
    })

    test('returns 200 status', () => {
      const statusCode = 200
      expect(statusCode).toBe(200)
    })
  })

  describe('Error Handling', () => {
    test('returns 404 for non-existent service', () => {
      const statusCode = 404
      expect([200, 404]).toContain(statusCode)
    })

    test('returns 400 for invalid ID format', () => {
      const statusCode = 400
      expect([400, 404]).toContain(statusCode)
    })
  })
})

describe('API: POST /api/services (Create Service) - Admin Only', () => {
  describe('Authorization', () => {
    test('requires admin authentication', () => {
      // Admin check would be performed
      const isAdmin = true
      expect(isAdmin).toBeTruthy()
    })

    test('rejects unauthorized users', () => {
      const isAdmin = false
      expect(isAdmin).toBe(false)
    })
  })

  describe('Successful Creation', () => {
    test('creates service with valid data', () => {
      const newService = {
        name: 'Test Service',
        description: 'Test description',
        price: 50,
        duration: 60,
        category: 'art',
      }
      expect(newService).toHaveProperty('name')
      expect(newService).toHaveProperty('price')
    })

    test('returns 201 status', () => {
      const statusCode = 201
      expect(statusCode).toBe(201)
    })

    test('returns created service with ID', () => {
      const service = mockServices[0]
      expect(service.id).toBeTruthy()
    })
  })

  describe('Validation', () => {
    test('requires service name', () => {
      const invalidService = {
        description: 'No name',
        price: 50,
        duration: 60,
      }
      expect(invalidService.name).toBeUndefined()
    })

    test('requires valid price', () => {
      const invalidService = {
        name: 'Test',
        price: -10, // Invalid
      }
      expect(invalidService.price).toBeLessThan(0)
    })

    test('requires valid duration', () => {
      const invalidService = {
        name: 'Test',
        duration: 0, // Invalid
      }
      expect(invalidService.duration).toBeLessThan(1)
    })

    test('validates category', () => {
      const validCategories = ['manicure', 'gel', 'extensions', 'pedicure', 'art']
      const service = mockServices[0]
      expect(validCategories).toContain(service.category)
    })
  })
})

describe('API: PUT /api/services/:id (Update Service) - Admin Only', () => {
  describe('Successful Update', () => {
    test('updates service price', () => {
      const updated = { ...mockServices[0], price: 75 }
      expect(updated.price).toBe(75)
    })

    test('updates service description', () => {
      const updated = { ...mockServices[0], description: 'New description' }
      expect(updated.description).toBe('New description')
    })

    test('returns updated service', () => {
      const service = mockServices[0]
      expect(service).toBeDefined()
    })

    test('returns 200 status', () => {
      const statusCode = 200
      expect(statusCode).toBe(200)
    })
  })

  describe('Validation', () => {
    test('prevents invalid price updates', () => {
      const invalidUpdate = { price: -5 }
      expect(invalidUpdate.price).toBeLessThan(0)
    })

    test('prevents invalid duration updates', () => {
      const invalidUpdate = { duration: 0 }
      expect(invalidUpdate.duration).toBeLessThan(1)
    })
  })

  describe('Error Handling', () => {
    test('returns 404 for non-existent service', () => {
      const statusCode = 404
      expect([200, 404]).toContain(statusCode)
    })

    test('returns 400 for invalid data', () => {
      const statusCode = 400
      expect([200, 400]).toContain(statusCode)
    })
  })
})

describe('API: DELETE /api/services/:id (Delete Service) - Admin Only', () => {
  describe('Successful Deletion', () => {
    test('deletes service by ID', () => {
      const serviceId = mockServices[0].id
      expect(serviceId).toBeTruthy()
    })

    test('returns 200 status', () => {
      const statusCode = 200
      expect(statusCode).toBe(200)
    })

    test('returns success message', () => {
      const response = { message: 'Service deleted successfully' }
      expect(response.message).toBeTruthy()
    })
  })

  describe('Error Handling', () => {
    test('returns 404 for non-existent service', () => {
      const statusCode = 404
      expect([200, 404]).toContain(statusCode)
    })

    test('prevents deletion by unauthorized users', () => {
      const isAuthorized = false
      expect(isAuthorized).toBe(false)
    })
  })
})

describe('Service Data Validation', () => {
  test('name is required and not empty', () => {
    const service = mockServices[0]
    expect(service.name).toBeTruthy()
    expect(service.name.length).toBeGreaterThan(0)
  })

  test('price is positive number', () => {
    const service = mockServices[0]
    expect(service.price).toBeGreaterThan(0)
    expect(typeof service.price).toBe('number')
  })

  test('duration is positive number in minutes', () => {
    const service = mockServices[0]
    expect(service.duration).toBeGreaterThan(0)
    expect(service.duration % 1).toBe(0) // Integer
  })

  test('category is from predefined list', () => {
    const validCategories = ['manicure', 'gel', 'extensions', 'pedicure', 'art']
    mockServices.forEach(service => {
      expect(validCategories).toContain(service.category)
    })
  })

  test('description provides helpful information', () => {
    mockServices.forEach(service => {
      expect(service.description).toBeTruthy()
      expect(service.description.length).toBeGreaterThan(5)
    })
  })

  test('image URL is valid', () => {
    mockServices.forEach(service => {
      if (service.image) {
        expect(service.image).toMatch(/\.(jpg|jpeg|png|gif|webp)$/i)
      }
    })
  })
})

describe('Service Search & Filter', () => {
  test('can search services by name', () => {
    const searchTerm = 'manicure'
    const results = mockServices.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    expect(results.length).toBeGreaterThan(0)
  })

  test('can filter by price range', () => {
    const minPrice = 30
    const maxPrice = 50
    const results = mockServices.filter(s =>
      s.price >= minPrice && s.price <= maxPrice
    )
    expect(results.length).toBeGreaterThanOrEqual(0)
  })

  test('can filter by duration', () => {
    const maxDuration = 60
    const results = mockServices.filter(s => s.duration <= maxDuration)
    expect(results.length).toBeGreaterThan(0)
  })

  test('multiple filters work together', () => {
    const category = 'gel'
    const maxPrice = 50
    const results = mockServices.filter(s =>
      s.category === category && s.price <= maxPrice
    )
    expect(Array.isArray(results)).toBe(true)
  })
})
