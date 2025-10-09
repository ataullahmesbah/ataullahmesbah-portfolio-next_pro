// src/app/sitemap.js
import { MetadataRoute } from "next";
import FeaturedStory from "@/models/FeaturedStory";
import Blog from "@/models/Blog";
import Products from "@/models/Products";
import dbConnect from "@/lib/dbMongoose";

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ataullahmesbah.com";

    try {
        await dbConnect();

        // 🔹 Featured Stories (dynamic)
        const stories = await FeaturedStory.find({ status: "published" })
            .select("slug updatedAt")
            .lean();

        // 🔹 Blogs (dynamic)
        const blogs = await Blog.find({ status: "published" })
            .select("slug category updatedAt")
            .lean();

        // 🔹 Products (dynamic)
        const products = await Products.find({ status: "active" })
            .select("slug updatedAt")
            .lean();

        // 🔹 Fetch Blog Categories via API route (if needed)
        // if categories stored in DB, you can fetch from Blog model directly instead of API
        let categories = [];
        try {
            const res = await fetch(`${baseUrl}/api/blog/categories`, { cache: "no-store" });
            if (res.ok) categories = await res.json();
        } catch (err) {
            console.warn("Category fetch failed:", err.message);
        }

        // 🔹 Fetch Products via API (for additional products not stored in DB)
        let apiProducts = [];
        try {
            const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
            if (res.ok) apiProducts = await res.json();
        } catch (err) {
            console.warn("API product fetch failed:", err.message);
        }

        // 🔹 Static Pages
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
            "/shop",
            "/blog",
            // Add policy pages
            "/return-policy",
            "/privacy-policy",
            "/terms-of-service",
        ].map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: new Date(),
        }));

        // 🔹 Dynamic Featured Story URLs
        const storyPages = stories.map((story) => ({
            url: `${baseUrl}/featured-story/${story.slug}`,
            lastModified: story.updatedAt || new Date(),
        }));

        // 🔹 Dynamic Blog URLs
        const blogPages = blogs.map((blog) => ({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: blog.updatedAt || new Date(),
        }));

        // 🔹 Dynamic Blog Categories URLs

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
                        lastModified: new Date().toISOString(),
                        changeFrequency: "weekly",
                        priority: 0.6,
                    };
                })
                .filter(Boolean)
            : [];


        // 🔹 Dynamic Product URLs (from DB)
        const productPages = products.map((p) => ({
            url: `${baseUrl}/shop/${p.slug}`,
            lastModified: p.updatedAt || new Date(),
        }));

        // 🔹 Dynamic Product URLs (from API)
        const apiProductPages = apiProducts.map((p) => ({
            url: `${baseUrl}/shop/${p.slug}`,
            lastModified: p.updatedAt || new Date(),
        }));

        // ✅ Merge all sections
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

        // fallback — return home page only
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
            },
        ];
    }
}
