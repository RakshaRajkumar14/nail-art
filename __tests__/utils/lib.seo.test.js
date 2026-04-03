/**
 * SEO Utilities Tests
 * ===================
 * Tests for meta tag generation, schema markup, breadcrumbs
 * Coverage: All SEO functions and structured data generation
 */

import {
  generateMetaTags,
  generateStructuredData,
  generateServiceSEO,
  generateBreadcrumbSchema,
  generateSocialMeta,
  defaultSEO,
} from '../../lib/seo'

describe('generateMetaTags', () => {
  test('generates basic meta tags', () => {
    const tags = generateMetaTags()
    expect(tags).toHaveProperty('title')
    expect(tags).toHaveProperty('meta')
    expect(Array.isArray(tags.meta)).toBe(true)
  })

  test('includes default title', () => {
    const tags = generateMetaTags()
    expect(tags.title).toContain('Elegance Nails')
  })

  test('includes default description', () => {
    const tags = generateMetaTags()
    const descMeta = tags.meta.find(m => m.name === 'description')
    expect(descMeta).toBeTruthy()
    expect(descMeta.content).toContain('nail')
  })

  test('allows custom title', () => {
    const customTitle = 'Custom Page Title'
    const tags = generateMetaTags({ title: customTitle })
    expect(tags.title).toBe(customTitle)
  })

  test('allows custom description', () => {
    const customDesc = 'Custom description'
    const tags = generateMetaTags({ description: customDesc })
    const descMeta = tags.meta.find(m => m.name === 'description')
    expect(descMeta.content).toBe(customDesc)
  })

  test('includes Open Graph tags', () => {
    const tags = generateMetaTags()
    const ogTags = tags.meta.filter(m => m.property && m.property.startsWith('og:'))
    expect(ogTags.length).toBeGreaterThan(0)
  })

  test('includes Twitter card tags', () => {
    const tags = generateMetaTags()
    const twitterTags = tags.meta.filter(m => m.name && m.name.startsWith('twitter:'))
    expect(twitterTags.length).toBeGreaterThan(0)
  })

  test('includes viewport meta tag', () => {
    const tags = generateMetaTags()
    const viewport = tags.meta.find(m => m.name === 'viewport')
    expect(viewport).toBeTruthy()
    expect(viewport.content).toContain('width=device-width')
  })

  test('includes robots meta tag', () => {
    const tags = generateMetaTags()
    const robots = tags.meta.find(m => m.name === 'robots')
    expect(robots).toBeTruthy()
    expect(robots.content).toContain('index')
  })

  test('supports noindex option', () => {
    const tags = generateMetaTags({ noindex: true })
    const robots = tags.meta.find(m => m.name === 'robots')
    expect(robots.content).toContain('noindex')
  })

  test('generates canonical link', () => {
    const tags = generateMetaTags({ canonical: 'https://example.com/page' })
    expect(tags.link).toBeTruthy()
    expect(tags.link[0].href).toBe('https://example.com/page')
  })

  test('includes keywords', () => {
    const tags = generateMetaTags()
    const keywords = tags.meta.find(m => m.name === 'keywords')
    expect(keywords).toBeTruthy()
    expect(keywords.content).toContain('nail')
  })
})

describe('generateStructuredData', () => {
  test('generates organization schema', () => {
    const schema = generateStructuredData('organization')
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('Elegance Nails')
  })

  test('organization schema includes contact info', () => {
    const schema = generateStructuredData('organization')
    expect(schema.contactPoint).toBeTruthy()
    expect(schema.contactPoint.telephone).toBeTruthy()
  })

  test('organization schema includes address', () => {
    const schema = generateStructuredData('organization')
    expect(schema.address).toBeTruthy()
    expect(schema.address['@type']).toBe('PostalAddress')
  })

  test('organization schema includes social links', () => {
    const schema = generateStructuredData('organization')
    expect(schema.sameAs).toBeTruthy()
    expect(Array.isArray(schema.sameAs)).toBe(true)
  })

  test('generates service schema', () => {
    const schema = generateStructuredData('service')
    expect(schema['@type']).toBe('Service')
    expect(schema.name).toContain('Nail')
  })

  test('service schema includes provider', () => {
    const schema = generateStructuredData('service')
    expect(schema.provider).toBeTruthy()
    expect(schema.provider.name).toBe('Elegance Nails')
  })

  test('generates local business schema', () => {
    const schema = generateStructuredData('localBusiness')
    expect(schema['@type']).toBe('LocalBusiness')
    expect(schema.address).toBeTruthy()
  })

  test('local business schema includes hours', () => {
    const schema = generateStructuredData('localBusiness')
    expect(schema.openingHoursSpecification).toBeTruthy()
    expect(Array.isArray(schema.openingHoursSpecification)).toBe(true)
  })

  test('local business schema includes rating', () => {
    const schema = generateStructuredData('localBusiness')
    expect(schema.aggregateRating).toBeTruthy()
    expect(schema.aggregateRating.ratingValue).toBeTruthy()
  })

  test('generates FAQ schema', () => {
    const schema = generateStructuredData('faq')
    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toBeTruthy()
  })

  test('FAQ schema includes questions', () => {
    const schema = generateStructuredData('faq')
    expect(schema.mainEntity.length).toBeGreaterThan(0)
    expect(schema.mainEntity[0]['@type']).toBe('Question')
  })

  test('returns null for unknown type', () => {
    const schema = generateStructuredData('unknown')
    expect(schema).toBeNull()
  })
})

describe('generateServiceSEO', () => {
  test('generates service SEO data', () => {
    const seo = generateServiceSEO({
      serviceName: 'Gel Manicure',
      price: '40',
      duration: '45 minutes',
    })
    expect(seo).toHaveProperty('title')
    expect(seo).toHaveProperty('description')
    expect(seo).toHaveProperty('schema')
  })

  test('includes service name in title', () => {
    const seo = generateServiceSEO({
      serviceName: 'Gel Manicure',
      price: '40',
    })
    expect(seo.title).toContain('Gel Manicure')
  })

  test('includes price in description', () => {
    const seo = generateServiceSEO({
      serviceName: 'Gel Manicure',
      price: '40',
      description: 'Premium gel polish',
    })
    expect(seo.description).toContain('40')
  })

  test('includes duration in description', () => {
    const seo = generateServiceSEO({
      serviceName: 'Gel Manicure',
      duration: '45 minutes',
    })
    expect(seo.description).toContain('45 minutes')
  })

  test('schema is product type', () => {
    const seo = generateServiceSEO({ serviceName: 'Test' })
    expect(seo.schema['@type']).toBe('Product')
  })

  test('schema includes offer', () => {
    const seo = generateServiceSEO({ serviceName: 'Test', price: '50' })
    expect(seo.schema.offers).toBeTruthy()
    expect(seo.schema.offers.price).toBe('50')
  })

  test('schema includes currency', () => {
    const seo = generateServiceSEO({ serviceName: 'Test' })
    expect(seo.schema.offers.priceCurrency).toBe('USD')
  })

  test('uses custom image when provided', () => {
    const customImage = 'https://example.com/custom.jpg'
    const seo = generateServiceSEO({ serviceName: 'Test', image: customImage })
    expect(seo.ogImage).toBe(customImage)
    expect(seo.schema.image).toBe(customImage)
  })
})

describe('generateBreadcrumbSchema', () => {
  test('generates breadcrumb schema', () => {
    const breadcrumbs = [
      { name: 'Home', url: 'https://example.com' },
      { name: 'Services', url: 'https://example.com/services' },
    ]
    const schema = generateBreadcrumbSchema(breadcrumbs)
    expect(schema['@type']).toBe('BreadcrumbList')
  })

  test('includes itemListElement', () => {
    const breadcrumbs = [{ name: 'Home', url: 'https://example.com' }]
    const schema = generateBreadcrumbSchema(breadcrumbs)
    expect(schema.itemListElement).toBeTruthy()
  })

  test('sets correct positions', () => {
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Gel Manicure', url: '/services/gel-manicure' },
    ]
    const schema = generateBreadcrumbSchema(breadcrumbs)
    expect(schema.itemListElement[0].position).toBe(1)
    expect(schema.itemListElement[1].position).toBe(2)
    expect(schema.itemListElement[2].position).toBe(3)
  })

  test('handles empty breadcrumbs', () => {
    const schema = generateBreadcrumbSchema([])
    expect(schema.itemListElement).toEqual([])
  })
})

describe('generateSocialMeta', () => {
  test('generates social meta tags', () => {
    const social = generateSocialMeta({
      title: 'Test Page',
      description: 'Test Description',
      image: 'https://example.com/image.jpg',
      url: 'https://example.com',
    })
    expect(social).toHaveProperty('ogTitle')
    expect(social).toHaveProperty('twitterTitle')
  })

  test('includes OG tags', () => {
    const social = generateSocialMeta({
      title: 'Test',
      description: 'Desc',
      image: 'img.jpg',
      url: 'url',
    })
    expect(social.ogTitle).toBe('Test')
    expect(social.ogDescription).toBe('Desc')
  })

  test('includes Twitter tags', () => {
    const social = generateSocialMeta({
      title: 'Test',
      description: 'Desc',
      image: 'img.jpg',
    })
    expect(social.twitterTitle).toBe('Test')
    expect(social.twitterCard).toBe('summary_large_image')
  })

  test('includes LinkedIn tags', () => {
    const social = generateSocialMeta({
      title: 'Test',
      description: 'Desc',
    })
    expect(social.linkedinTitle).toBe('Test')
  })
})

describe('defaultSEO', () => {
  test('includes title', () => {
    expect(defaultSEO.title).toBeTruthy()
  })

  test('includes description', () => {
    expect(defaultSEO.description).toBeTruthy()
  })

  test('includes keywords', () => {
    expect(Array.isArray(defaultSEO.keywords)).toBe(true)
    expect(defaultSEO.keywords.length).toBeGreaterThan(0)
  })

  test('includes social handles', () => {
    expect(defaultSEO.twitterHandle).toBeTruthy()
  })

  test('keywords contain relevant terms', () => {
    expect(defaultSEO.keywords.some(k => k.includes('nail'))).toBe(true)
  })
})

describe('SEO Integration', () => {
  test('can generate complete page SEO', () => {
    const metaTags = generateMetaTags({
      title: 'Services - Elegance Nails',
      description: 'Browse our nail services',
      canonical: 'https://elegancenails.com/services',
    })
    const schema = generateStructuredData('service')
    const breadcrumbs = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://elegancenails.com' },
      { name: 'Services', url: 'https://elegancenails.com/services' },
    ])

    expect(metaTags).toBeTruthy()
    expect(schema).toBeTruthy()
    expect(breadcrumbs).toBeTruthy()
  })

  test('service page has complete SEO', () => {
    const serviceSEO = generateServiceSEO({
      serviceName: 'Gel Manicure',
      description: 'Beautiful gel manicure service',
      price: '40',
      duration: '45 minutes',
    })

    expect(serviceSEO.title).toBeTruthy()
    expect(serviceSEO.description).toBeTruthy()
    expect(serviceSEO.schema).toBeTruthy()
  })

  test('local business schema for homepage', () => {
    const schema = generateStructuredData('localBusiness')
    const metaTags = generateMetaTags()

    expect(schema).toHaveProperty('address')
    expect(schema).toHaveProperty('openingHoursSpecification')
    expect(metaTags).toHaveProperty('meta')
  })
})
