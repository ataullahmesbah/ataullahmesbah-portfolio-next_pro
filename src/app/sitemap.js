// src/app/sitemap.js
import { MetadataRoute } from "next";
import FeaturedStory from "@/models/FeaturedStory";
import Blog from "@/models/Blog";
import Products from "@/models/Products";
import dbConnect from "@/lib/dbMongoose";

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ataullahmesbah.com";

  try {
    await dbConnect();

    const stories = await FeaturedStory.find({ status: "published" })
      .select("slug updatedAt")
      .lean();

    const blogs = await Blog.find({ status: "published" })
      .select("slug category updatedAt")
      .lean();

    const products = await Products.find({ status: "active" })
      .select("slug updatedAt")
      .lean();

    let categories = [];
    try {
      const res = await fetch(`${baseUrl}/api/blog/categories`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        categories = Array.isArray(data) ? data : [];
      }
    } catch (err) {
      console.warn("Category fetch failed:", err.message);
    }

    let apiProducts = [];
    try {
      const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        apiProducts = Array.isArray(data) ? data : [];
      }
    } catch (err) {
      console.warn("API product fetch failed:", err.message);
    }

    const staticPages = [
      { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/letter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/mesbahoffwego`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/newsletter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
      { url: `${baseUrl}/featured-story`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
      { url: `${baseUrl}/web-development`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/seo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/seo/technical-seo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/seo/ecommerce-seo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/seo/geo-sge-optimization`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/content-creation`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/return-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
      { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
      { url: `${baseUrl}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    ];

    const storyPages = stories.map((story) => ({
      url: `${baseUrl}/featured-story/${story.slug}`,
      lastModified: story.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const blogPages = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const categoryPages = Array.isArray(categories)
      ? categories
          .map((category) => {
            const categoryName =
              typeof category === "string"
                ? category
                : category?.slug || category?.name || "";

            if (!categoryName) return null;

            return {
              url: `${baseUrl}/blog/category/${encodeURIComponent(
                categoryName.toLowerCase().trim().replace(/\s+/g, "-")
              )}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.6,
            };
          })
          .filter(Boolean)
      : [];

    const productPages = products.map((p) => ({
      url: `${baseUrl}/shop/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    const apiProductPages = apiProducts.map((p) => ({
      url: `${baseUrl}/shop/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    return [
      ...staticPages,
      ...storyPages,
      ...blogPages,
      ...categoryPages,
      ...productPages,
      ...apiProductPages,
    ];
  } catch (error) {
    console.error("❌ Sitemap generation error:", error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}