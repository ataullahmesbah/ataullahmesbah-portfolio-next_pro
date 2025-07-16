// app/(with-layout)/featured-story/page.js

import StoriesClient from '@/app/components/Story/StoriesClient/StoriesClient';
import dbConnect from '@/lib/dbMongoose';
import FeaturedStory from '@/models/FeaturedStory';

export async function generateMetadata() {
    return {
        title: 'Featured Stories | Ataullah Mesbah',
        description: 'Dive into captivating stories on tech, travel, and more.',
        keywords: 'featured stories, tech, travel, SEO, personal stories',
        openGraph: {
            title: 'Featured Stories | Ataullah Mesbah',
            description: 'Dive into captivating stories on tech, travel, and more.',
            images: ['/images/og-image.jpg'],
            url: 'https://ataullahmesbah.com/featured-story',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Featured Stories | Ataullah Mesbah',
            description: 'Dive into captivating stories on tech, travel, and more.',
            images: ['/images/og-image.jpg'],
        },
    };
}

async function fetchStories(page = 1, limit = 6) {
    try {
        await dbConnect();
        const skip = (page - 1) * limit;

        const [stories, total] = await Promise.all([
            FeaturedStory.find({ status: 'published' })
                .sort({ publishedDate: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            FeaturedStory.countDocuments({ status: 'published' }),
        ]);

        return {
            stories,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error('Error fetching stories:', error);
        return { stories: [], total: 0, page: 1, pages: 1 };
    }
}

export default async function FeaturedStories({ searchParams }) {
    const page = parseInt(searchParams.page) || 1;
    const { stories, total, pages } = await fetchStories(page);

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: stories.map((story, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Article',
                headline: story.title,
                description: story.metaDescription,
                image: story.mainImage,
                url: `https://ataullahmesbah.com/featured-story/${story.slug}`,
                author: { '@type': 'Person', name: story.author },
                datePublished: story.publishedDate,
                publisher: {
                    '@type': 'Organization',
                    name: 'Ataullah Mesbah',
                    logo: { '@type': 'ImageObject', url: 'https://ataullahmesbah.com/images/logo.png' },
                },
            },
        })),
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-3 sm:px-4 lg:px-6">
            <StoriesClient
                stories={stories}
                schema={schema}
                currentPage={page}
                totalPages={pages}
            />
        </div>
    );
}