// src/app/(with-layout)/blog/[slug]/page.js

import React from 'react';
import Image from 'next/image';
import CommentForm from '@/app/components/Share/CommentForm/CommentForm';

export async function generateMetadata({ params }) {
    const blog = await getBlog(params.slug);
    return {
        title: blog.metaTitle,
        description: blog.metaDescription,
    };
}


async function getBlog(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/${slug}`, { cache: 'no-store' }); // Fetch blog by slug
    if (!res.ok) throw new Error('Failed to fetch blog');
    return res.json();
}

export default async function BlogDetailsPage({ params }) {
    const { slug } = params;
    const blog = await getBlog(slug);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
            <div className="relative h-96 mb-8">
                <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>
            <p className="text-gray-600 mb-4">By {blog.author} | Published on {new Date(blog.publishDate).toLocaleDateString()}</p>
            <div className="prose max-w-none">
                {blog.content.map((section, index) => (
                    <div key={index}>
                        {section.type === 'text' && <p>{section.data}</p>}
                        {section.type === 'image' && (
                            <Image
                                src={section.data}
                                alt={section.alt}
                                width={800}
                                height={400}
                                className="my-4 rounded-lg"
                            />
                        )}
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Key Points</h2>
            <ul className="list-disc pl-6 mb-8">
                {blog.keyPoints.map((point, index) => (
                    <li key={index} className="mb-2">{point}</li>
                ))}
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Comments</h2>
            <div className="space-y-4">
                {blog.comments.map((comment, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                        <p className="font-semibold">{comment.user}</p>
                        <p className="text-gray-600">{comment.comment}</p>
                    </div>
                ))}
            </div>

            <CommentForm blogSlug={slug} />
        </div>
    );
}