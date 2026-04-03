import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse {
  success: boolean;
  recommendations?: any[];
  error?: string;
}

/**
 * AI RECOMMENDATIONS ENDPOINT
 * ===========================
 * Placeholder for AI-powered nail recommendations
 * Ready to integrate with OpenAI, Anthropic, or other AI providers
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
      skinTone = 'medium',
      nailLength = 'medium',
      style = 'classic',
      budget = 100,
      occasion = 'casual',
    } = req.body;

    // TODO: Integrate with AI provider
    // Current implementation returns mock recommendations
    // Replace with actual AI API call when provider is configured

    const recommendations = getMockRecommendations({
      skinTone,
      nailLength,
      style,
      budget,
      occasion,
    });

    return res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error: any) {
    console.error('AI recommendations error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get recommendations',
    });
  }
}

function getMockRecommendations(preferences: any) {
  const allRecommendations = [
    {
      id: 1,
      name: 'Classic French',
      description: 'Timeless and elegant for any occasion',
      serviceId: 'french-manicure',
      price: 35,
      duration: 45,
      colors: ['White', 'Natural Pink'],
      why: 'Perfect for your style and skin tone',
    },
    {
      id: 2,
      name: 'Gel Extensions',
      description: 'Long-lasting and versatile',
      serviceId: 'gel-extensions',
      price: 60,
      duration: 60,
      colors: ['Nude', 'Rose Gold', 'Blush Pink'],
      why: 'Great for the length you prefer',
    },
    {
      id: 3,
      name: 'Ombre Nails',
      description: 'Trendy gradient effect',
      serviceId: 'ombre-nails',
      price: 55,
      duration: 50,
      colors: ['Pink to Purple', 'Coral to Peach', 'Blue to Purple'],
      why: 'Matches your modern aesthetic',
    },
    {
      id: 4,
      name: 'Bridal Nails',
      description: 'Perfect for special occasions',
      serviceId: 'bridal-nails',
      price: 75,
      duration: 60,
      colors: ['Ivory', 'Champagne', 'Gold Accents'],
      why: 'Ideal for celebrations',
    },
    {
      id: 5,
      name: 'Nail Art Design',
      description: 'Custom artistic designs',
      serviceId: 'nail-art',
      price: 50,
      duration: 45,
      styles: ['Floral', 'Geometric', 'Minimalist'],
      why: 'Express your creativity',
    },
  ];

  // Filter based on preferences
  let filtered = allRecommendations;

  // Filter by budget
  filtered = filtered.filter((r) => r.price <= budget);

  // Filter by occasion
  if (occasion === 'special') {
    filtered = filtered.filter(
      (r) =>
        r.serviceId === 'bridal-nails' ||
        r.serviceId === 'nail-art' ||
        r.serviceId === 'ombre-nails'
    );
  } else if (occasion === 'casual') {
    filtered = filtered.filter(
      (r) =>
        r.serviceId === 'french-manicure' ||
        r.serviceId === 'gel-extensions' ||
        r.serviceId === 'nail-art'
    );
  }

  return filtered.slice(0, 5); // Return top 5 recommendations
}
