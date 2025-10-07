export const dynamic = 'force-dynamic'; // Ensure fresh sitemap generation

import { MetadataRoute } from "next";

export default async function sitemap() {
    // 🏠 Dynamic base URL - works both locally & in production
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ataullahmesbah.com";

    // ---- 🧭 1. Static Pages ----
    const staticPages = [
        "",
        "/about",
        "/contact",
        "/letter",
        "/projects",
        "/mesbahoffwego",
        "/newsletter",
        "/featured-story",
        "/web-development",
        "/seo",
        "/seo/technical-seo",
        "/seo/ecommerce-seo",
        "/seo/geo-sge-optimization",
        "/content-creation",
        "/faq",
    ].map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly",
        priority: path === "" ? 1.0 : 0.8,
    }));

    // ---- 📝 2. Dynamic Blog Pages ----
    let blogs = [];
    try {
        const res = await fetch(`${baseUrl}/api/blog`, {
            cache: 'no-store', // Prevent caching for fresh data
            headers: {
                'Cache-Control': 'no-cache',
            },
        });
        if (!res.ok) {
            console.error(`Failed to fetch blogs, status: ${res.status}`);
        } else {
            blogs = await res.json();
            if (!Array.isArray(blogs)) {
                console.error("Invalid blog data: not an array");
                blogs = [];
            }
        }
    } catch (error) {
        console.error("Blog fetch error:", error.message);
    }

    const blogPages = blogs
        .filter((blog) => blog.slug && typeof blog.slug === 'string') // Ensure valid slug
        .map((blog) => ({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString(),
            changeFrequency: "weekly",
            priority: 0.7,
        }));

    // ---- 🗂️ 3. Dynamic Category Pages ----
    let categories = [];
    try {
        const res = await fetch(`${baseUrl}/api/blog/categories`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
            },
        });
        if (!res.ok) {
            console.error(`Failed to fetch categories, status: ${res.status}`);
        } else {
            categories = await res.json();
            if (!Array.isArray(categories)) {
                console.error("Invalid category data: not an array");
                categories = [];
            }
        }
    } catch (error) {
        console.error("Category fetch error:", error.message);
    }

    const categoryPages = categories
        .filter((category) => category && typeof category === 'string') // Ensure valid category
        .map((category) => ({
            url: `${baseUrl}/blog/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
            priority: 0.6,
        }));

    // ---- 🧩 4. Combine All Pages ----
    return [...staticPages, ...blogPages, ...categoryPages];
}