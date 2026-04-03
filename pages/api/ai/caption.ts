import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse {
  success: boolean;
  caption?: string;
  alternatives?: string[];
  error?: string;
}

/**
 * AI CAPTION GENERATOR ENDPOINT
 * =============================
 * Generates engaging Instagram captions for nail designs
 * Ready to integrate with vision AI + GPT
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
      imageUrl = '',
      nailDesign = 'classic',
      hashtags = true,
      tone = 'professional',
    } = req.body;

    // TODO: Integrate with vision API to analyze image
    // Then generate caption with GPT-4

    const caption = generateCaption({
      nailDesign,
      tone,
      hashtags,
    });

    const alternatives = generateAlternativeCaptions({
      nailDesign,
      hashtags,
    });

    return res.status(200).json({
      success: true,
      caption,
      alternatives,
    });
  } catch (error: any) {
    console.error('Caption generation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate caption',
    });
  }
}

function generateCaption({
  nailDesign,
  tone,
  hashtags,
}: {
  nailDesign: string;
  tone: string;
  hashtags: boolean;
}): string {
  const captions: Record<string, Record<string, string>> = {
    classic: {
      professional:
        '✨ Timeless elegance never goes out of style. Our Classic Manicure is the perfect blend of sophistication and simplicity. Book your appointment today!',
      casual:
        '✨ Nothing beats a classic look! Clean nails, happy vibes. Ready to glow? 💅',
      playful:
        "✨ Prove that simple is ALWAYS in style. Our classic manicure is a vibe! 💫",
    },
    gel: {
      professional:
        '💎 Long-lasting brilliance. Our Gel Manicure keeps your nails flawless for weeks. Experience the difference of premium quality.',
      casual:
        '💎 Gel nails that last! No chipping, all glam. Tag someone who needs this look! 💅✨',
      playful:
        '💎 Gel nails > regular nails? We think YES! Come get your shine on! 🌟',
    },
    ombre: {
      professional:
        '🌅 The gradient effect that steals the show. Our Ombre Nails combine trend and elegance. Discover your perfect color blend.',
      casual:
        '🌅 Obsessed with ombre everything! What color combo would you choose? 💕✨',
      playful:
        '🌅 Rainbow vibes only! Our ombre nails are everything you need to slay this season! 🎨💅',
    },
    french: {
      professional:
        '🤍 Parisian perfection. The French Manicure - a timeless icon of refined beauty. Elegant. Sophisticated. Eternal.',
      casual:
        '🤍 Classic French nails never fail. The perfect date night look! 💫',
      playful:
        '🤍 French tips = instant elegant energy! Who else is team French? 👑',
    },
    art: {
      professional:
        '🎨 Canvas meets creativity. Our custom nail art transforms your nails into a masterpiece. Express yourself, uniquely.',
      casual:
        '🎨 Art on your nails! Which design would you rock? 💕✨',
      playful:
        '🎨 Your nails are your canvas! Book your custom design now and be the main character! 👑✨',
    },
    bridal: {
      professional:
        '💍 Your special day deserves perfect nails. Our Bridal Nails service ensures you shine from every angle. Forever beautiful.',
      casual:
        '💍 Bride vibes! Getting your nails ready for the big day? Let us help! ✨',
      playful:
        '💍 Something blue, something pink, something PERFECT! Bridal nails that slay! 💫👰',
    },
  };

  let caption =
    captions[nailDesign]?.[tone] || captions.classic.professional;

  if (hashtags) {
    const hashtagList =
      ' #NailArt #ManiPedi #NailDesign #NailSalon #EleganceNails #BookNow #BeautyServices #NailInspo';
    caption += hashtagList;
  }

  return caption;
}

function generateAlternativeCaptions({
  nailDesign,
  hashtags,
}: {
  nailDesign: string;
  hashtags: boolean;
}): string[] {
  const alternatives: Record<string, string[]> = {
    classic: [
      "✨ Clean beauty. Because simplicity is always in season. Book your classic manicure!",
      "💅 Understated elegance. The foundation of every great nail look.",
      "✨ Timeless. Always. Forever. Your classic manicure awaits.",
    ],
    gel: [
      "💎 Gel magic! ✨ Long-lasting glam that keeps up with you.",
      "💪 Strong nails, stronger confidence. Get your gels done!",
      "✨ Chip-proof. Gloss-proof. Just pure perfection.",
    ],
    ombre: [
      "🌈 Gradient goals achieved! Which blend are you vibing with?",
      "🎨 Color melting at its finest. Your next obsession awaits.",
      "✨ Smooth transitions, flawless results. Ombre nails perfected.",
    ],
    french: [
      "🤍 Forever iconic. Forever elegant. The French manicure.",
      "👑 Parisian-inspired perfection on your fingertips.",
      "✨ White tips, strong energy, pure class.",
    ],
    art: [
      "🎨 Your imagination + our skills = nail art goals!",
      "🖼️ Every nail is a canvas. What's your masterpiece?",
      "✨ Custom designs that make you feel like an artist.",
    ],
    bridal: [
      "💍 Your nails, your moment, your perfection. Bridal beauty starts here!",
      "✨ Every bride deserves flawless nails. Let us make you shine!",
      "👰 Wedding ready with our premium bridal nail services.",
    ],
  };

  let caps = alternatives[nailDesign] || alternatives.classic;

  if (hashtags) {
    const hashtag =
      ' #NailArt #ManiPedi #NailDesign #NailSalon #EleganceNails';
    caps = caps.map((c) => c + hashtag);
  }

  return caps;
}
