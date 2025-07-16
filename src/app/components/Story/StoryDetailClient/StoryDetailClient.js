'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiCalendar, FiEye } from 'react-icons/fi';

export default function StoryDetailClient({ story, schema, relatedStories = [] }) {
    const renderContentBlock = (block, index) => {
        switch (block.type) {
            case 'paragraph':
                return <p key={index} className="text-gray-300 leading-relaxed mb-4 text-sm md:text-base">{block.content}</p>;
            case 'heading':
                const HeadingTag = `h${block.level || 2}`;
                return (
                    <HeadingTag
                        key={index}
                        className={`text-white font-bold mb-3 ${block.level === 1 ? 'text-2xl md:text-3xl' :
                            block.level === 2 ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
                            }`}
                    >
                        {block.content}
                    </HeadingTag>
                );
            case 'image':
                return (
                    <div key={index} className="my-6">
                        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                            <Image
                                src={block.imageUrl || '/images/placeholder.jpg'}
                                alt={block.caption || 'Story image'}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                quality={80}
                                loading="lazy"
                            />
                        </div>
                        {block.caption && (
                            <p className="text-gray-400 text-xs md:text-sm mt-2 text-center">
                                {block.caption}
                            </p>
                        )}
                    </div>
                );
            case 'video':
                return (
                    <div key={index} className="my-6">
                        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                            <iframe
                                src={block.content}
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                        {block.caption && (
                            <p className="text-gray-400 text-xs md:text-sm mt-2 text-center">
                                {block.caption}
                            </p>
                        )}
                    </div>
                );
            case 'code':
                return (
                    <pre key={index} className="bg-gray-900 rounded-lg p-3 my-4 overflow-x-auto">
                        <code className="text-gray-300 text-xs md:text-sm">{block.content}</code>
                    </pre>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-3 sm:px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/featured-story" className="text-blue-400 hover:text-blue-300 transition text-sm">
                        ← Back to Stories
                    </Link>
                </div>

                <article className="mb-12">
                    <div className="mb-4">
                        <span className="inline-block bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-xs md:text-sm mb-3">
                            {story.category}
                        </span>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            {story.title}
                        </h1>
                        <div className="flex items-center text-gray-400 text-xs md:text-sm mb-4">
                            <span className="flex items-center mr-4">
                                <FiCalendar className="mr-1 w-4 h-4" />
                                {new Date(story.publishedDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                            <span className="flex items-center">
                                <FiEye className="mr-1 w-4 h-4" /> {story.views} views
                            </span>
                        </div>
                    </div>

                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-6">
                        <Image
                            src={story.mainImage || '/images/placeholder.jpg'}
                            alt={story.title}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={80}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-base md:text-lg text-gray-300 mb-6">{story.shortDescription}</p>

                        {story.contentBlocks.map(renderContentBlock)}

                        {story.keyPoints?.length > 0 && (
                            <div className="bg-gray-800/50 rounded-lg p-4 my-6 border border-gray-700">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Key Takeaways</h2>
                                <ul className="space-y-2">
                                    {story.keyPoints.map((point, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="text-blue-400 mr-2 mt-1">•</span>
                                            <span className="text-gray-300 text-sm md:text-base">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {story.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-6">
                                {story.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs md:text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </article>

                {relatedStories.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">More {story.category} Stories</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedStories.map((related) => (
                                <Link
                                    key={related._id}
                                    href={`/featured-story/${related.slug}`}
                                    className="group h-full"
                                >
                                    <div className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg border border-gray-700 h-full flex flex-col">
                                        <div className="relative w-full aspect-[16/9] overflow-hidden">
                                            <Image
                                                src={related.mainImage || '/images/placeholder.jpg'}
                                                alt={related.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                quality={80}
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="text-base text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                                {related.title}
                                            </h3>
                                            <p className="text-gray-400 text-xs md:text-sm line-clamp-2 mb-3">
                                                {related.metaDescription}
                                            </p>
                                            <div className="mt-auto flex items-center text-xs text-gray-500">
                                                <FiCalendar className="mr-1 w-3 h-3" />
                                                {new Date(related.publishedDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </div>
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
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        ...schema,
                        publisher: {
                            '@type': 'Organization',
                            name: 'Ataullah Mesbah',
                            logo: { '@type': 'ImageObject', url: 'https://ataullahmesbah.com/images/logo.png' },
                        },
                    })
                }}
            />
        </div>
    );
}