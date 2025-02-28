import { getAllPages } from "@/models/getAllPages";

export default async function sitemap() {
  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'; // Use environment variable
  const pages = await getAllPages(); // Fetch Dynamic Pages

  // Generate URLs for all pages
  const urls = pages.map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Add static pages (if any)
  const staticPages = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [...staticPages, ...urls];
}