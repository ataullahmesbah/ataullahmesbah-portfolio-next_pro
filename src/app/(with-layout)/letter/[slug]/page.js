// src/app/letter/[slug]/page.js
import React from 'react';
import Image from 'next/image';
import Head from 'next/head';

export async function generateMetadata({ params }) {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/newsletter/letter/${params.slug}`);
    const newsletter = await res.json();

    if (!newsletter || res.status !== 200) {
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
            url: `${process.env.NEXTAUTH_URL}/letter/${newsletter.slug}`,
        },
    };
}

const NewsletterDetailPage = async ({ params }) => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/newsletter/letter/${params.slug}`);
    const newsletter = await res.json();

    if (!newsletter || res.status !== 200) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6 md:p-10">
                <h1 className="text-4xl font-normal text-center">Newsletter Not Found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6 md:p-10">
            <Head>
                <title>{newsletter.metaTitle}</title>
                <meta name="description" content={newsletter.metaDescription} />
                <meta property="og:title" content={newsletter.metaTitle} />
                <meta property="og:description" content={newsletter.metaDescription} />
                <meta property="og:image" content={newsletter.mainImage} />
                <meta property="og:url" content={`${process.env.NEXTAUTH_URL}/letter/${newsletter.slug}`} />
            </Head>

            <div className="max-w-4xl mx-auto">
                <Image
                    src={newsletter.mainImage}
                    alt={newsletter.imageAlt}
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
                <div className="prose prose-invert max-w-none mb-6">
                    {newsletter.content.map((section, index) => (
                        <div key={index}>
                            {section.tag === 'p' && <p>{section.content}</p>}
                            {section.tag === 'h1' && <h1>{section.content}</h1>}
                            {section.tag === 'h2' && <h2>{section.content}</h2>}
                            {section.tag === 'h3' && <h3>{section.content}</h3>}
                            {section.tag === 'h4' && <h4>{section.content}</h4>}
                            {section.tag === 'h5' && <h5>{section.content}</h5>}
                            {section.tag === 'h6' && <h6>{section.content}</h6>}
                            {section.bulletPoints.length > 0 && (
                                <ul className="list-disc pl-5">
                                    {section.bulletPoints.map((point, i) => (
                                        <li key={i}>{point}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                {newsletter.gallery.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-normal text-gray-100 mb-4">Gallery</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {newsletter.gallery.map((image, index) => (
                                <Image
                                    key={index}
                                    src={image.url}
                                    alt={image.alt}
                                    width={300}
                                    height={200}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                )}
                <div className="mt-6">
                    <p className="text-gray-400">Author: {newsletter.author}</p>
                </div>
            </div>
        </div>
    );
};

export default NewsletterDetailPage;