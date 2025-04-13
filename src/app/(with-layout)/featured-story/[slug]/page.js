// app/(with-layout)/featured-story/[slug]/page.js
import StoryDetailClient from '@/app/components/Story/StoryDetailClient/StoryDetailClient';
import dbConnect from '@/lib/dbMongoose';
import FeaturedStory from '@/models/FeaturedStory';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    try {
        await dbConnect();
        const story = await FeaturedStory.findOne({ slug: params.slug.toLowerCase() }).lean();
        if (!story) return { title: 'Story Not Found' };

        return {
            title: `${story.metaTitle || story.title} | Ataullah Mesbah`,
            description: story.metaDescription,
            keywords: story.tags.join(', '),
            openGraph: {
                title: story.metaTitle || story.title,
                description: story.metaDescription,
                images: [story.mainImage],
                url: `https://ataullahmesbah.com/featured-story/${story.slug}`,
                type: 'article',
            },
            twitter: {
                card: 'summary_large_image',
                title: story.metaTitle || story.title,
                description: story.metaDescription,
                images: [story.mainImage],
            },
        };
    } catch (error) {
        console.error('Metadata error:', error);
        return { title: 'Story Not Found' };
    }
}

async function fetchStory(slug) {
    try {
        await dbConnect();
        const story = await FeaturedStory.findOne({ slug: slug.toLowerCase() }).lean();
        if (!story) return null;

        // Increment views
        await FeaturedStory.updateOne({ slug: slug.toLowerCase() }, { $inc: { views: 1 } });
        return story;
    } catch (error) {
        console.error('Error fetching story:', error);
        return null;
    }
}

export default async function StoryDetail({ params }) {
    const story = await fetchStory(params.slug);
    if (!story) notFound();

    // Get related stories (same category)
    const relatedStories = await FeaturedStory.find({
        status: 'published',
        category: story.category,
        _id: { $ne: story._id }
    })
        .sort({ publishedDate: -1 })
        .limit(3)
        .lean();

    // Schema Markup for Article
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: story.title,
        description: story.metaDescription,
        image: story.mainImage,
        author: { '@type': 'Person', name: story.author },
        publisher: {
            '@type': 'Organization',
            name: 'Your Site Name',
            logo: { '@type': 'ImageObject', url: 'https://ataullahmesbah.com/images/logo.png' },
        },
        datePublished: story.publishedDate,
        dateModified: story.updatedAt || story.publishedDate,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://ataullahmesbah.com/featured-story/${story.slug}`,
        },
    };

    return (
        <StoryDetailClient
            story={story}
            schema={schema}
            relatedStories={relatedStories}
        />
    );
}