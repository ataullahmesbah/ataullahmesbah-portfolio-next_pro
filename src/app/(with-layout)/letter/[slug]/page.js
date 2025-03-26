// src/app/newsletter/[slug]/page.js
import React, { useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';

export async function generateMetadata({ params }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/newsletter/letter?slug=${params.slug}`);
    const newsletter = await res.json();

    if (!newsletter) {
        return {
            title: 'Newsletter Not Found',
            description: 'The newsletter you are looking for does not exist.',
        };
    }

    return {
        title: newsletter.metaTitle,
        description: newsletter.metaDescription,
        openGraph: {
            title: newsletter.metaTitle,
            description: newsletter.metaDescription,
            images: [newsletter.mainImage],
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletter/${newsletter.slug}`,
        },
    };
}

const NewsletterDetailPage = async ({ params }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/newsletter/letter?slug=${params.slug}`);
    const newsletter = await res.json();

    if (!newsletter) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
                <h1 className="text-4xl font-normal text-center">Newsletter Not Found</h1>
            </div>
        );
    }

    // Increment views
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/newsletter/letter`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newsletter._id, views: newsletter.views + 1 }),
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6 md:p-10">
            <Head>
                <title>{newsletter.metaTitle}</title>
                <meta name="description" content={newsletter.metaDescription} />
                <meta property="og:title" content={newsletter.metaTitle} />
                <meta property="og:description" content={newsletter.metaDescription} />
                <meta property="og:image" content={newsletter.mainImage} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/newsletter/${newsletter.slug}`} />
            </Head>

            <div className="max-w-4xl mx-auto">
                <Image
                    src={newsletter.mainImage}
                    alt={newsletter.title}
                    width={800}
                    height={400}
                    className="w-full h-96 object-cover rounded-lg mb-6"
                />
                <h1 className="text-4xl font-normal text-gray-100 mb-4">{newsletter.title}</h1>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">{newsletter.category}</span>
                    <span className="text-gray-400">
                        {new Date(newsletter.publishDate).toLocaleDateString()} | {newsletter.views} Views
                    </span>
                </div>
                <p className="text-lg text-gray-300 mb-6">{newsletter.description}</p>
                <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: newsletter.content }}
                />
                <div className="mt-6">
                    <p className="text-gray-400">Author: {newsletter.author}</p>
                </div>
            </div>
        </div>
    );
};

export default NewsletterDetailPage;