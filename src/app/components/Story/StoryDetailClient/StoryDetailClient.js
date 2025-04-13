// app/components/story/StoryDetailClient/StoryDetailClient.js
'use client';

import React from 'react'; // Add this import
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiCalendar, FiEye } from 'react-icons/fi';

export default function StoryDetailClient({ story, schema, relatedStories = [] }) {
    const renderContentBlock = (block, index) => {
        switch (block.type) {
            case 'paragraph':
                return <p key={index} className="text-gray-300 leading-relaxed mb-6">{block.content}</p>;
            case 'heading':
                // Alternative solution using JSX instead of React.createElement
                const HeadingTag = `h${block.level || 2}`;
                return (
                    <HeadingTag
                        key={index}
                        className={`text-white font-bold mb-4 ${block.level === 1 ? 'text-3xl' :
                                block.level === 2 ? 'text-2xl' : 'text-xl'
                            }`}
                    >
                        {block.content}
                    </HeadingTag>
                );
            case 'image':
                return (
                    <div key={index} className="my-8">
                        <div className="relative h-80 md:h-96 rounded-xl overflow-hidden">
                            <Image
                                src={block.imageUrl || '/images/placeholder.jpg'}
                                alt={block.caption || 'Story image'}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {block.caption && (
                            <p className="text-gray-400 text-sm mt-3 text-center">
                                {block.caption}
                            </p>
                        )}
                    </div>
                );
            case 'video':
                return (
                    <div key={index} className="my-8">
                        <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                            <iframe
                                src={block.content}
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                        {block.caption && (
                            <p className="text-gray-400 text-sm mt-3 text-center">
                                {block.caption}
                            </p>
                        )}
                    </div>
                );
            case 'code':
                return (
                    <pre key={index} className="bg-gray-800 rounded-lg p-4 my-6 overflow-x-auto">
                        <code className="text-gray-300">{block.content}</code>
                    </pre>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 ">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/featured-story" className="text-blue-400 hover:text-blue-300 transition">
                        &larr; Back to Stories
                    </Link>
                </div>

                <article className="mb-16">
                    <div className="mb-6">
                        <span className="inline-block bg-blue-900/50 text-blue-300 px-4 py-1 rounded-full text-sm mb-4">
                            {story.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {story.title}
                        </h1>
                        <div className="flex items-center text-gray-400 text-sm mb-6">
                            <span className="flex items-center mr-4">
                                <FiCalendar className="mr-1.5" />
                                {new Date(story.publishedDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                                <FiEye className="mr-1.5" /> {story.views} views
                            </span>
                        </div>
                    </div>

                    <div className="relative h-80 md:h-96 rounded-xl overflow-hidden mb-8">
                        <Image
                            src={story.mainImage || '/images/placeholder.jpg'}
                            alt={story.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-xl text-gray-300 mb-8">{story.shortDescription}</p>

                        {story.contentBlocks.map(renderContentBlock)}

                        {story.keyPoints?.length > 0 && (
                            <div className="bg-gray-800/50 rounded-xl p-6 my-8 border border-gray-700">
                                <h2 className="text-2xl font-bold text-white mb-4">Key Takeaways</h2>
                                <ul className="space-y-3">
                                    {story.keyPoints.map((point, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="text-blue-400 mr-2 mt-1">•</span>
                                            <span className="text-gray-300">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {story.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-8">
                                {story.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </article>

                {relatedStories.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-white mb-6">More {story.category} Stories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedStories.map((related) => (
                                <Link
                                    key={related._id}
                                    href={`/featured-story/${related.slug}`}
                                    className="group"
                                >
                                    <div className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg border border-gray-700">
                                        <div className="relative h-40">
                                            <Image
                                                src={related.mainImage || '/images/placeholder.jpg'}
                                                alt={related.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                                {related.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm line-clamp-2">
                                                {related.metaDescription}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </div>
    );
}