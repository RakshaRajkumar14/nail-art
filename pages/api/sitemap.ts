/**
 * Sitemap API Route
 * Generates dynamic XML sitemap for SEO
 * Usage: GET /api/sitemap
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:3000';

async function generateSitemap() {
  const sitemap = [];

  // Static pages
  const staticPages = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/services', changefreq: 'weekly', priority: 0.9 },
    { url: '/gallery', changefreq: 'weekly', priority: 0.8 },
    { url: '/book', changefreq: 'daily', priority: 0.9 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    { url: '/bookings', changefreq: 'daily', priority: 0.7 },
  ];

  // Add static pages
  for (const page of staticPages) {
    sitemap.push({
      url: `${BASE_URL}${page.url}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  // Fetch services from database
  try {
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, updated_at');

    if (!servicesError && services) {
      for (const service of services) {
        sitemap.push({
          url: `${BASE_URL}/services/${service.id}`,
          lastmod: new Date(service.updated_at).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.error('Error fetching services for sitemap:', error);
  }

  return sitemap;
}

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateXml(sitemap: any[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const item of sitemap) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(item.url)}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Cache the sitemap for 24 hours
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=172800');
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');

    const sitemap = await generateSitemap();
    const xml = generateXml(sitemap);

    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
