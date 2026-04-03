import type { NextApiRequest, NextApiResponse } from 'next';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ApiResponse {
  success: boolean;
  reply?: string;
  suggestions?: string[];
  actions?: any[];
  error?: string;
}

/**
 * AI CHATBOT ENDPOINT
 * ===================
 * Intelligent customer support chatbot
 * Ready to integrate with ChatGPT, Claude, or other LLMs
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const {
      message = '',
      conversationHistory = [],
      context = 'general',
    } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    // TODO: Integrate with AI provider (OpenAI, Anthropic, etc.)
    // Current implementation returns intelligent mock responses
    // Replace with actual AI API call when provider is configured

    const { reply, suggestions, actions } = await generateAIResponse({
      message,
      conversationHistory,
      context,
    });

    return res.status(200).json({
      success: true,
      reply,
      suggestions,
      actions,
    });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process chat',
    });
  }
}

async function generateAIResponse({
  message,
  conversationHistory = [],
  context = 'general',
}: {
  message: string;
  conversationHistory?: ChatMessage[];
  context?: string;
}): Promise<{
  reply: string;
  suggestions: string[];
  actions: any[];
}> {
  const lowerMessage = message.toLowerCase();

  // Booking-related queries
  if (
    lowerMessage.includes('book') ||
    lowerMessage.includes('appointment') ||
    lowerMessage.includes('schedule')
  ) {
    return {
      reply:
        "I'd love to help you book an appointment! 💅 What type of service are you interested in? We offer manicures, gel extensions, nail art, and more.",
      suggestions: [
        'Gel Manicure',
        'Nail Extensions',
        'Nail Art',
        'View all services',
      ],
      actions: [
        {
          type: 'navigate',
          target: '/booking',
          label: 'Start Booking',
        },
      ],
    };
  }

  // Pricing queries
  if (
    lowerMessage.includes('price') ||
    lowerMessage.includes('cost') ||
    lowerMessage.includes('how much') ||
    lowerMessage.includes('expensive')
  ) {
    return {
      reply:
        'Great question! Our services range from $25 to $150, depending on the service and complexity. Here are our main price ranges:\n\n• Basic Manicure: $25-35\n• Gel Manicure: $45-60\n• Extensions: $60-80\n• Nail Art: $50-100+',
      suggestions: ['View full pricing', 'Book now', 'Special offers'],
      actions: [],
    };
  }

  // Hours/Availability
  if (
    lowerMessage.includes('hour') ||
    lowerMessage.includes('open') ||
    lowerMessage.includes('available') ||
    lowerMessage.includes('time')
  ) {
    return {
      reply:
        "✨ Our hours are:\n\n• Monday - Friday: 9:00 AM - 7:00 PM\n• Saturday: 10:00 AM - 6:00 PM\n• Sunday: Closed\n\nWe typically have same-day availability. Would you like to book?",
      suggestions: ['Book appointment', 'Check availability', 'Contact us'],
      actions: [
        {
          type: 'navigate',
          target: '/booking',
          label: 'Check Availability',
        },
      ],
    };
  }

  // Location/Directions
  if (
    lowerMessage.includes('location') ||
    lowerMessage.includes('address') ||
    lowerMessage.includes('where') ||
    lowerMessage.includes('directions')
  ) {
    return {
      reply:
        "📍 You can find us at:\n\nElegance Nails\n123 Elegance Street\nBeautiful City, BC 12345\n\nWe're easy to find with plenty of parking available!",
      suggestions: ['Get directions', 'Call us', 'Visit website'],
      actions: [
        {
          type: 'link',
          href: 'https://maps.google.com/?q=Elegance+Nails',
          label: 'Get Directions',
        },
      ],
    };
  }

  // Services inquiry
  if (
    lowerMessage.includes('service') ||
    lowerMessage.includes('what do you offer') ||
    lowerMessage.includes('what can you do')
  ) {
    return {
      reply:
        "We offer a wide range of premium nail services! 💎\n\n✨ Popular Services:\n• Gel Manicure\n• Acrylic Extensions\n• Nail Art & Design\n• French Polish\n• Bridal Nails\n• Natural Nail Care\n\nWhich service interests you?",
      suggestions: [
        'Gel Manicure',
        'Nail Extensions',
        'Nail Art',
        'View all',
      ],
      actions: [
        {
          type: 'navigate',
          target: '/services',
          label: 'View All Services',
        },
      ],
    };
  }

  // Cancellation/Modification
  if (
    lowerMessage.includes('cancel') ||
    lowerMessage.includes('change') ||
    lowerMessage.includes('reschedule') ||
    lowerMessage.includes('modify')
  ) {
    return {
      reply:
        'I can help with that! To cancel or reschedule your appointment, please:\n\n1. Message us on WhatsApp\n2. Call us at +1 (234) 567-8900\n3. Email us at support@elegancenails.com\n\nPlease note: Cancellations must be made 24 hours in advance.',
      suggestions: ['Contact WhatsApp', 'Call us', 'Email us'],
      actions: [
        {
          type: 'link',
          href: 'https://wa.me/1234567890',
          label: 'WhatsApp us',
        },
      ],
    };
  }

  // Payment methods
  if (
    lowerMessage.includes('payment') ||
    lowerMessage.includes('accept') ||
    lowerMessage.includes('card') ||
    lowerMessage.includes('cash')
  ) {
    return {
      reply:
        'We accept multiple payment methods for your convenience:\n\n💳 Credit & Debit Cards (Visa, Mastercard, American Express)\n💰 Cash\n📱 Digital Wallets (Apple Pay, Google Pay)\n🏦 Bank Transfer (for deposits)\n\nAll payments are secure and encrypted.',
      suggestions: ['Book now', 'More info', 'Contact us'],
      actions: [],
    };
  }

  // Default response
  return {
    reply:
      "Hello! 👋 Welcome to Elegance Nails! I'm here to help. You can ask me about:\n\n• 📅 Booking an appointment\n• 💳 Pricing and services\n• 🕐 Our hours\n• 📍 Our location\n• 🎨 Our nail designs\n\nWhat can I help you with?",
    suggestions: [
      'Book appointment',
      'View services',
      'Ask about pricing',
      'Contact us',
    ],
    actions: [
      {
        type: 'navigate',
        target: '/booking',
        label: 'Start Booking',
      },
    ],
  };
}
