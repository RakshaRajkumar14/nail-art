/**
 * Mock Data Fixtures
 * ==================
 * Reusable mock data for tests
 */

export const mockServices = [
  {
    id: '1',
    name: 'Classic Manicure',
    description: 'Traditional manicure with polish',
    price: 25,
    duration: 30,
    category: 'manicure',
    image: '/services/manicure.jpg',
  },
  {
    id: '2',
    name: 'Gel Manicure',
    description: 'Long-lasting gel polish application',
    price: 40,
    duration: 45,
    category: 'gel',
    image: '/services/gel.jpg',
  },
  {
    id: '3',
    name: 'Nail Extensions',
    description: 'Beautiful acrylic or gel extensions',
    price: 60,
    duration: 60,
    category: 'extensions',
    image: '/services/extensions.jpg',
  },
  {
    id: '4',
    name: 'Pedicure',
    description: 'Relaxing foot care and polish',
    price: 35,
    duration: 45,
    category: 'pedicure',
    image: '/services/pedicure.jpg',
  },
  {
    id: '5',
    name: 'Nail Art',
    description: 'Custom designs and artwork',
    price: 50,
    duration: 60,
    category: 'art',
    image: '/services/nail-art.jpg',
  },
]

export const mockBookings = [
  {
    id: '1',
    customer_name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '5551234567',
    selected_services: ['1', '2'],
    date: '2026-04-15',
    time: '10:00',
    notes: 'Prefer red polish',
    total_price: 65,
    status: 'confirmed',
    created_at: '2026-03-30T10:00:00Z',
  },
  {
    id: '2',
    customer_name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '5559876543',
    selected_services: ['3'],
    date: '2026-04-16',
    time: '14:00',
    notes: '',
    total_price: 60,
    status: 'pending',
    created_at: '2026-03-30T11:00:00Z',
  },
  {
    id: '3',
    customer_name: 'Carol Davis',
    email: 'carol@example.com',
    phone: '5555555555',
    selected_services: ['4', '5'],
    date: '2026-04-17',
    time: '15:30',
    notes: 'First time client',
    total_price: 85,
    status: 'completed',
    created_at: '2026-03-30T12:00:00Z',
  },
]

export const mockUsers = [
  {
    id: '1',
    name: 'Elegance Salon',
    email: 'info@elegancenails.com',
    phone: '+1-234-567-8900',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Test Customer',
    email: 'customer@example.com',
    phone: '5551234567',
    role: 'customer',
  },
]

export const mockAvailableTimes = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
]

export const mockGalleryImages = [
  {
    id: '1',
    title: 'Classic Red Nails',
    src: '/gallery/red-nails.jpg',
    category: 'classic',
    alt: 'Beautiful red nail polish',
  },
  {
    id: '2',
    title: 'Gel Extensions',
    src: '/gallery/gel-extensions.jpg',
    category: 'gel',
    alt: 'Professional gel extensions',
  },
  {
    id: '3',
    title: 'Nail Art Design',
    src: '/gallery/nail-art.jpg',
    category: 'art',
    alt: 'Intricate nail art design',
  },
  {
    id: '4',
    title: 'French Manicure',
    src: '/gallery/french.jpg',
    category: 'classic',
    alt: 'Elegant French manicure',
  },
  {
    id: '5',
    title: 'Ombre Nails',
    src: '/gallery/ombre.jpg',
    category: 'art',
    alt: 'Beautiful ombre effect',
  },
]

export const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah',
    text: 'Best nail service in town! Highly recommended.',
    rating: 5,
    date: '2026-03-28',
  },
  {
    id: '2',
    name: 'Emma',
    text: 'Professional and friendly staff. Will come back again!',
    rating: 5,
    date: '2026-03-25',
  },
  {
    id: '3',
    name: 'Jessica',
    text: 'Great designs and beautiful results.',
    rating: 4,
    date: '2026-03-20',
  },
]

export const mockAPIResponses = {
  services: {
    success: {
      status: 200,
      data: mockServices,
      message: 'Services fetched successfully',
    },
    error: {
      status: 500,
      error: 'Failed to fetch services',
      message: 'Internal server error',
    },
  },
  bookings: {
    create: {
      status: 201,
      data: mockBookings[0],
      message: 'Booking created successfully',
    },
    fetch: {
      status: 200,
      data: mockBookings,
      message: 'Bookings fetched successfully',
    },
    error: {
      status: 400,
      error: 'Invalid booking data',
      message: 'Missing required fields',
    },
  },
  availableTimes: {
    success: {
      status: 200,
      data: mockAvailableTimes,
      message: 'Available times fetched',
    },
    noSlots: {
      status: 200,
      data: [],
      message: 'No available slots',
    },
  },
}

export const mockFormData = {
  validBooking: {
    customer_name: 'John Doe',
    email: 'john@example.com',
    phone: '5551234567',
    selected_services: ['1', '2'],
    date: '2026-04-15',
    time: '10:00',
    notes: 'No special requests',
  },
  invalidBooking: {
    customer_name: '',
    email: 'invalid-email',
    phone: '123', // Too short
    selected_services: [],
    date: '',
    time: '',
  },
  partialBooking: {
    customer_name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '5559876543',
    selected_services: ['1'],
    date: '2026-04-16',
    // Missing time
  },
}

export const mockEmailConfig = {
  to: 'customer@example.com',
  subject: 'Booking Confirmation',
  template: 'booking-confirmation',
  data: {
    customerName: 'John Doe',
    bookingId: '123',
    date: '2026-04-15',
    time: '10:00',
  },
}

export const mockNavigation = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const mockSocialLinks = {
  instagram: 'https://instagram.com/elegancenails',
  whatsapp: 'https://wa.me/1234567890',
  facebook: 'https://facebook.com/elegancenails',
}

export const mockEnvVariables = {
  NEXT_PUBLIC_INSTAGRAM_URL: 'https://instagram.com/elegancenails',
  NEXT_PUBLIC_WHATSAPP_NUMBER: '1234567890',
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-key-12345',
  NEXT_PUBLIC_APP_URL: 'https://elegancenails.com',
}
