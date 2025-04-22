import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import Blog from '@/models/Blog';

export default async function sitemap() {
    await dbConnect();

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Fetch user profiles
    const profiles = await UserProfile.find({}, 'username').lean();
    const profileUrls = profiles.map(profile => ({
        url: `${baseUrl}/u/${profile.username}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Fetch blog pages
    const blogs = await Blog.find({}, { slug: 1, _id: 0 }).lean();
    const blogUrls = blogs.map(blog => ({
        url: `${baseUrl}/${blog.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    return [...staticPages, ...profileUrls, ...blogUrls];
}