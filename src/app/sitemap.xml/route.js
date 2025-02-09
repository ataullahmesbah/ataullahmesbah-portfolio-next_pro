import { getAllPages } from '@/lib/getAllPages';

export async function GET() {
    const pages = await getAllPages(); // Fetch Dynamic Pages

    const siteUrl = 'https://ataullahmesbah.com';
    const urls = pages.map((page) => `
    <url>
      <loc>${siteUrl}/${page.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
