// app/(with-layout)/featured-story/page.js
import FeaturedSchema from '@/app/components/Schema/FeaturedSchema/FeaturedSchema';
import StoriesClient from '@/app/components/Story/StoriesClient/StoriesClient';

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

async function fetchStories(page = 1, limit = 9) {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/feature?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
            next: { revalidate: 60 } // Optional: revalidate every 60 seconds
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching stories:', error);
        return { stories: [], total: 0, page: 1, pages: 1 };
    }
}

export default async function FeaturedStories({ searchParams }) {
    const page = parseInt(searchParams.page) || 1;
    const data = await fetchStories(page);
    const { stories, pages, total } = data;

    const schema = FeaturedSchema(stories);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-3 sm:px-4 lg:px-6">
            <StoriesClient
                initialStories={stories}
                schema={schema}
                currentPage={page}
                totalPages={pages}
                totalStories={total}
            />
        </div>
    );
}