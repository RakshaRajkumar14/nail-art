export interface ShivyaService {
  id: string;
  name: string;
  bookingName?: string;
  duration: number;
  price: number;
  category: 'signature' | 'extension' | 'acrylic' | 'art' | 'enhancement';
  description: string;
  eyebrow: string;
  image: string;
}

export const SHIVYA_SITE_NAME = "Shivya's Nail Studio";
export const SHIVYA_SITE_SHORT_NAME = "Shivya's";
export const SHIVYA_BOOKING_START_ROUTE = '/services';

export const SHIVYA_SERVICES: ShivyaService[] = [
  {
    id: 'gel-full-set',
    name: 'Gel Full Set',
    bookingName: 'Gilded Gel Full Set',
    duration: 60,
    price: 85,
    category: 'extension',
    eyebrow: 'Sculpted length',
    description:
      'Premium hard gel sculpted for weightless durability and a crystal-clear finish that looks naturally sophisticated.',
    image: '/images/luxe/service-extensions.jpg',
  },
  {
    id: 'only-polish',
    name: 'Only Polish',
    duration: 30,
    price: 35,
    category: 'signature',
    eyebrow: 'Refined essential',
    description:
      'Pure, polished perfection. Cuticle care, shaping, and your choice of high-performance lacquer — nothing more, nothing less.',
    image: '/images/luxe/service-gel-manicure.jpg',
  },
  {
    id: 'acrylic-full-set',
    name: 'Acrylic Full Set',
    duration: 60,
    price: 75,
    category: 'acrylic',
    eyebrow: 'Lasting strength',
    description:
      'The gold standard in strength. Perfectly balanced architecture tailored to your natural nail shape, finished to your chosen gloss.',
    image: '/images/luxe/gallery-nails.jpg',
  },
  {
    id: 'natural-manicure',
    name: 'Natural Manicure',
    duration: 30,
    price: 45,
    category: 'art',
    eyebrow: 'Editorial detail',
    description:
      'A thoughtful ritual for your natural nails — detailed shaping, cuticle work, hand massage, and a flawless tinted finish.',
    image: '/images/luxe/service-nail-art.jpg',
  },
  {
    id: 'clean-manicure',
    name: 'Clean Manicure',
    duration: 30,
    price: 30,
    category: 'signature',
    eyebrow: 'Pure clarity',
    description:
      'A clean slate for your nails. Gentle shaping, buff, and a nude or clear finish for effortless everyday elegance.',
    image: '/images/luxe/service-gel-manicure.jpg',
  },
];

export const SHIVYA_ENHANCEMENTS: ShivyaService[] = [
  {
    id: 'paraffin-wax',
    name: 'Paraffin Wax',
    duration: 15,
    price: 15,
    category: 'enhancement',
    eyebrow: 'Deep hydration',
    description: 'Deep hydration for soft, supple hands.',
    image: '',
  },
  {
    id: 'shimmer-finish',
    name: 'Shimmer Finish',
    duration: 10,
    price: 20,
    category: 'enhancement',
    eyebrow: 'Fine crystal veil',
    description: 'Textured topcoating for a light-catching finish.',
    image: '',
  },
  {
    id: 'detox-soak',
    name: 'Detox Soak',
    duration: 20,
    price: 18,
    category: 'enhancement',
    eyebrow: 'Mineral renewal',
    description: 'Magnesium and charcoal ritual for restoration.',
    image: '',
  },
];

export const SHIVYA_HOME_FEATURES = [
  {
    title: 'Private, Unhurried Sessions',
    description: 'One guest at a time for calm, focused nail artistry.',
  },
  {
    title: 'Clean Luxury Standards',
    description: 'Careful prep, thoughtful hygiene, and polished finishing details.',
  },
  {
    title: 'Custom Design Guidance',
    description: 'Bring your references and we shape every detail around your look.',
  },
  {
    title: 'Easy Booking Flow',
    description: 'Choose services first, then lock in your date and time in minutes.',
  },
];

export const SHIVYA_BOOKING_STEPS = [
  { step: '01', title: 'Select Service', description: 'Choose from our curated treatment menu.' },
  { step: '02', title: 'Choose Date', description: 'Pick a date and time that suits your schedule.' },
  { step: '03', title: 'Confirm Instantly', description: 'Your spot is reserved the moment you confirm.' },
  { step: '04', title: 'Receive Reminder', description: 'A gentle reminder arrives before your session.' },
];

export const SHIVYA_SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'Pinterest', href: '#' },
  { label: 'Journal', href: '#' },
];

export const SHIVYA_PRIMARY_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Book', href: '/book' },
  { label: 'Studio', href: '/#studio' },
];

export const SHIVYA_FOOTER_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Book', href: '/services' },
  { label: 'Contact', href: '/#contact' },
];

export const SHIVYA_DEFAULT_SERVICE = SHIVYA_SERVICES[0];
