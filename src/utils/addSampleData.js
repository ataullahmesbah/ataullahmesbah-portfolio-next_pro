// utils/addSampleData.js (একবার রান করার জন্য)
import dbConnect from '@/lib/dbMongoose';
import Blog from '@/models/Blog';

async function addSampleBlogs() {
    try {
        await dbConnect();

        const sampleBlog = {
            title: "Getting Started with Next.js 14",
            slug: "getting-started-with-nextjs-14",
            mainImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
            shortDescriptions: ["Learn Next.js 14 features", "App Router tutorial"],
            author: "Ataullah Mesbah",
            content: [
                {
                    type: "text",
                    data: "Next.js 14 introduces many exciting new features...",
                    tag: "p"
                }
            ],
            keyPoints: ["New App Router", "Server Components", "Improved Performance"],
            publishDate: new Date(),
            metaTitle: "Next.js 14 Tutorial - Complete Guide",
            metaDescription: "Learn how to use Next.js 14 with App Router, Server Components and new features in this complete tutorial.",
            tags: ["nextjs", "react", "tutorial"],
            categories: ["Web Development", "JavaScript"],
            views: 150,
            readTime: 5
        };

        await Blog.create(sampleBlog);
        console.log('✅ Sample blog added successfully!');

    } catch (error) {
        console.error('❌ Error adding sample blog:', error);
    }
}

addSampleBlogs();