/**
 * Robots.txt API Route
 * Dynamically generates robots.txt content
 * Usage: GET /api/robots
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://yourdomain.com';

export default function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=604800'); // Cache for 1 week

  const robotsContent = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /.next/
Disallow: /_next/
Disallow: /private/
Disallow: /admin-login
Disallow: /*?*
Allow: /*?utm_source=
Allow: /*?utm_medium=
Allow: /*?utm_campaign=

# Crawl delay in seconds
Crawl-delay: 0.5

# Request rate
Request-rate: 1/1s

# Specific bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 0

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-pages.xml
Sitemap: ${BASE_URL}/sitemap-services.xml
`;

  res.status(200).send(robotsContent);
}
