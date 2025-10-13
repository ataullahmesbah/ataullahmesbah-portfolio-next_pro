// app/(with-layout)/featured-story/[slug]/page.js

import StoryDetailClient from '@/app/components/Story/StoryDetailClient/StoryDetailClient';
import { notFound } from 'next/navigation';

function calculateReadingTime(contentBlocks) {
    if (!Array.isArray(contentBlocks)) return 0;
    const text = contentBlocks.reduce((acc, block) => {
        if (['paragraph', 'heading', 'code'].includes(block.type) && block.content) {
            return acc + block.content;
        }
        return acc;
    }, '');
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200);
}

async function fetchStory(slug) {
    try {
        console.log('Fetching story for slug:', slug);
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/feature/${slug}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        console.log('Response status:', res.status);
        if (!res.ok) {
            if (res.status === 404) {
                console.log('Story not found - 404');
                return null;
            }
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const story = await res.json();
        console.log('Story fetched successfully:', story.title);
        story.contentBlocks = Array.isArray(story.contentBlocks) ? story.contentBlocks : [];
        return story;
    } catch (error) {
        console.error('Error fetching story:', error);
        return null;
    }
}

async function fetchRelatedStories(category, excludeId) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/feature?category=${encodeURIComponent(category)}&excludeId=${excludeId}&limit=3`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
            }
        );
        if (!res.ok) throw new Error('Failed to fetch related stories');
        const { stories } = await res.json();
        return stories.map(story => ({
            ...story,
            contentBlocks: Array.isArray(story.contentBlocks) ? story.contentBlocks : [],
            readingTime: calculateReadingTime(story.contentBlocks),
        }));
    } catch (error) {
        console.error('Error fetching related stories:', error);
        return [];
    }
}

export async function generateMetadata({ params }) {
    const story = await fetchStory(params.slug);
    if (!story) {
        return {
            title: 'Story Not Found | Ataullah Mesbah',
            description: 'The requested story could not be found.',
        };
    }

    return {
        title: story.metaTitle || `${story.title} | Ataullah Mesbah`,
        description: story.metaDescription || story.shortDescription || 'Read this captivating story.',
        keywords: story.tags?.join(', ') || 'story, tech, travel, seo, personal',
        openGraph: {
            title: story.metaTitle || story.title,
            description: story.metaDescription || story.shortDescription || 'Read this captivating story.',
            images: [story.mainImage || '/images/placeholder.jpg'],
            url: `https://ataullahmesbah.com/featured-story/${story.slug}`,
            type: 'article',
            publishedTime: story.publishedDate,
            authors: [story.author || 'Ataullah Mesbah'],
        },
        twitter: {
            card: 'summary_large_image',
            title: story.metaTitle || story.title,
            description: story.metaDescription || story.shortDescription || 'Read this captivating story.',
            images: [story.mainImage || '/images/placeholder.jpg'],
        },
    };
}

export default async function StoryDetail({ params }) {
    const story = await fetchStory(params.slug);
    if (!story) {
        console.log('Story not found, showing 404');
        notFound();
    }

    const relatedStories = await fetchRelatedStories(story.category || 'featured', story._id);
    const readingTime = calculateReadingTime(story.contentBlocks);

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: story.metaTitle || story.title,
        description: story.metaDescription || story.shortDescription || 'A captivating story from Ataullah Mesbah.',
        image: story.mainImage || '/images/placeholder.jpg',
        author: { '@type': 'Person', name: story.author || 'Ataullah Mesbah' },
        publisher: {
            '@type': 'Organization',
            name: 'Ataullah Mesbah',
            logo: { '@type': 'ImageObject', url: 'https://ataullahmesbah.com/images/logo.png' },
        },
        datePublished: new Date(story.publishedDate).toISOString(),
        dateModified: story.updatedAt
            ? new Date(story.updatedAt).toISOString()
            : new Date(story.publishedDate).toISOString(),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://ataullahmesbah.com/featured-story/${story.slug}`,
        },
        wordCount: Array.isArray(story.contentBlocks)
            ? story.contentBlocks.reduce((acc, block) => acc + (block.content?.split(/\s+/).length || 0), 0)
            : 0,
        keywords: story.tags || [],
    };

    return (
        <StoryDetailClient
            story={{ ...story, readingTime }}
            schema={schema}
            relatedStories={relatedStories}
        />
    );
}