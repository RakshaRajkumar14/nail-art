/**
 * SEO UTILITIES - Meta Tags & Structured Data
 * ==========================================
 * Generates SEO-optimized meta tags and structured schema markup
 */

export const defaultSEO = {
  title: "Shivya's Nail Studio - Luxury Nail Art & Booking",
  description:
    "Book luxury nail art services online at Shivya's Nail Studio. Custom sets, gel extensions, and polished treatments with a services-first booking flow.",
  canonical: 'https://shivyasnailstudio.com',
  ogImage: 'https://shivyasnailstudio.com/og-image.jpg',
  twitterHandle: '@shivyasnailstudio',
  keywords: [
    'nail art',
    'nail salon',
    'gel manicure',
    'nail extensions',
    'nail booking',
    'nail services',
  ],
};

/**
 * Generate meta tags for HTML head
 */
export function generateMetaTags({
  title = defaultSEO.title,
  description = defaultSEO.description,
  canonical,
  ogImage = defaultSEO.ogImage,
  ogType = 'website',
  twitterHandle = defaultSEO.twitterHandle,
  noindex = false,
}) {
  return {
    // Basic Meta Tags
    title,
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        name: 'keywords',
        content: defaultSEO.keywords.join(', '),
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      // Open Graph
      {
        property: 'og:title',
        content: title,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:type',
        content: ogType,
      },
      {
        property: 'og:image',
        content: ogImage,
      },
      {
        property: 'og:site_name',
        content: "Shivya's Nail Studio",
      },
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: title,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:image',
        content: ogImage,
      },
      {
        name: 'twitter:creator',
        content: twitterHandle,
      },
      // Additional
      {
        name: 'robots',
        content: noindex ? 'noindex, nofollow' : 'index, follow',
      },
      {
        httpEquiv: 'x-ua-compatible',
        content: 'ie=edge',
      },
      {
        name: 'language',
        content: 'English',
      },
      {
        name: 'revisit-after',
        content: '7 days',
      },
    ],
    link: canonical ? [{ rel: 'canonical', href: canonical }] : [],
  };
}

/**
 * Generate structured data schema markup (JSON-LD)
 */
export function generateStructuredData(type = 'organization') {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shivyasnailstudio.com';

  if (type === 'organization') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: "Shivya's Nail Studio",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: defaultSEO.description,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        telephone: '+1-234-567-8900',
        email: 'hello@shivyasnalstudio.com',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Elegance Street',
        addressLocality: 'Beautiful City',
        addressRegion: 'BC',
        postalCode: '12345',
        addressCountry: 'US',
      },
      sameAs: [
        'https://instagram.com/shivyasnalstudio',
        'https://pinterest.com/shivyasnalstudio',
        'https://wa.me/1234567890',
      ],
    };
  }

  if (type === 'service') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Nail Art & Salon Services',
      provider: {
        '@type': 'Organization',
        name: "Shivya's Nail Studio",
      },
      description: 'Premium nail art, manicures, and salon services',
      url: baseUrl,
      image: `${baseUrl}/service-image.jpg`,
      areaServed: {
        '@type': 'City',
        name: 'Beautiful City',
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${baseUrl}/services`,
      },
    };
  }

  if (type === 'localBusiness') {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': baseUrl,
      name: "Shivya's Nail Studio",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: defaultSEO.description,
      image: `${baseUrl}/salon-image.jpg`,
      telephone: '+1-234-567-8900',
      email: 'hello@shivyasnalstudio.com',
      priceRange: '€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Elegance Street',
        addressLocality: 'Beautiful City',
        addressRegion: 'BC',
        postalCode: '12345',
        addressCountry: 'US',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '19:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '10:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Sunday',
          opens: '00:00',
          closes: '00:00',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '250',
      },
    };
  }

  if (type === 'faq') {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I book an appointment?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can book an appointment through our website, call us, or message us on WhatsApp.',
          },
        },
        {
          '@type': 'Question',
          name: 'What payment methods do you accept?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We accept cash, credit cards, debit cards, and digital payment options.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is your cancellation policy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cancellations must be made 24 hours in advance for a full refund.',
          },
        },
      ],
    };
  }

  return null;
}

/**
 * SEO Meta Tags for Service Pages
 */
export function generateServiceSEO({
  serviceName = 'Nail Service',
  description = 'Premium nail service',
  price = '0',
  duration = '60 minutes',
  image = '',
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shivyasnailstudio.com';

  return {
    title: `${serviceName} - Shivya's Nail Studio | Luxury Nail Services`,
    description: `${description}. Duration: ${duration}. Starting at €${price}. Book your appointment online today.`,
    ogImage: image || `${baseUrl}/service-image.jpg`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: serviceName,
      description: description,
      image: image || `${baseUrl}/service-image.jpg`,
      brand: {
        '@type': 'Brand',
        name: "Shivya's Nail Studio",
      },
      offers: {
        '@type': 'Offer',
        url: `${baseUrl}/services/${serviceName.toLowerCase().replace(/\s/g, '-')}`,
        priceCurrency: 'EUR',
        price: price,
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: "Shivya's Nail Studio",
        },
      },
    },
  };
}

/**
 * Next.js Head Component Helper
 * Usage in _app.js or _document.js
 */
export function HeadMetaTags({ meta = [] }) {
  return (
    <>
      {meta.map((tag, index) => {
        if (tag.property) {
          return <meta key={index} property={tag.property} content={tag.content} />;
        }
        if (tag.httpEquiv) {
          return (
            <meta key={index} httpEquiv={tag.httpEquiv} content={tag.content} />
          );
        }
        return <meta key={index} name={tag.name} content={tag.content} />;
      })}
    </>
  );
}

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Social Meta Tags
 */
export function generateSocialMeta({
  title,
  description,
  image,
  url,
}) {
  return {
    // Open Graph
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogUrl: url,
    ogType: 'website',
    // Twitter
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    twitterCard: 'summary_large_image',
    // LinkedIn
    linkedinTitle: title,
    linkedinDescription: description,
  };
}
