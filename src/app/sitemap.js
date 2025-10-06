// src/app/sitemap.js

export default async function sitemap() {
    const baseUrl = 'https://ataullahmesbah.com'; // Replace with your actual domain

    // Static pages
    const staticPages = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },

    ];

    // SEO Service Pages
    const seoPages = [
        {
            url: `${baseUrl}/seo`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/seo/technical-seo`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/seo/ecommerce-seo`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/seo/geo-sge-optimization`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        
       
    ];

    // Blog Pages (if you have blog)
    const blogPages = [
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        
    ];

    // Portfolio/Case Study Pages
    const portfolioPages = [
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        
    ];

    // Combine all pages
    const allPages = [
        ...staticPages,
        ...seoPages,
        ...blogPages,
        ...portfolioPages,
    ];

    return allPages;
}