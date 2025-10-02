// src/app/sitemap.xml/route.js
import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import Blog from '@/models/Blog';
import Product from '@/models/Product';
import Category from '@/models/Category';

// Cache configuration
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
let cachedSitemap = null;
let lastGenerated = null;

export async function GET() {
  try {
    // Check cache
    if (cachedSitemap && lastGenerated && (Date.now() - lastGenerated) < CACHE_DURATION) {
      return new Response(cachedSitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      });
    }

    await dbConnect();

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Static pages with better organization
    const staticPages = [
      {
        url: `${baseUrl}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/shop`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/web-development`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/seo`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
    ];

    // Parallel data fetching for better performance
    const [profiles, blogs, products, categories] = await Promise.all([
      UserProfile.find({}, 'username updatedAt').lean(),
      Blog.find({}, 'slug updatedAt').lean(),
      Product.find({}, 'slug updatedAt').lean(),
      Category.find({}, 'slug updatedAt').lean(),
    ]);

    // Generate URLs with better error handling
    const generateUrls = (items, basePath, field = 'slug') => 
      items.map(item => ({
        url: `${baseUrl}${basePath}${item[field]}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    const profileUrls = generateUrls(profiles, '/u/', 'username');
    const blogUrls = generateUrls(blogs, '/blog/');
    const productUrls = generateUrls(products, '/shop/product/');
    const categoryUrls = generateUrls(categories, '/shop/category/');

    // Combine all URLs
    const allUrls = [
      ...staticPages,
      ...profileUrls,
      ...blogUrls,
      ...productUrls,
      ...categoryUrls,
    ];

    // Generate XML with proper formatting
    const sitemapXml = generateSitemapXML(allUrls);

    // Cache the result
    cachedSitemap = sitemapXml;
    lastGenerated = Date.now();

    return new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Fallback to basic sitemap if database fails
    const fallbackSitemap = generateFallbackSitemap();
    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

function generateSitemapXML(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${urls.map(page => `
    <url>
      <loc>${escapeXML(page.url)}</loc>
      <lastmod>${page.lastModified.toISOString()}</lastmod>
      <changefreq>${page.changeFrequency}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `).join('')}
</urlset>`;
}

function generateFallbackSitemap() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const fallbackUrls = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/shop`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];

  return generateSitemapXML(fallbackUrls);
}

function escapeXML(string) {
  return string.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return char;
    }
  });
}