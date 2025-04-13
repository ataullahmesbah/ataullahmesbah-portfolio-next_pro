// app/components/story/StoriesClient/StoriesClient.js

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiEye, FiClock, FiCalendar } from 'react-icons/fi';

import Pagination from '../../Pagination/Pagination';
import DynamicButton from '../../Share/Button/DynamicButton/DynamicButton';

export default function StoriesClient({ stories, schema, currentPage = 1, totalPages = 1 }) {
    return (
        <>
            <div className="max-w-7xl mx-auto ">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Featured Stories
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Discover our collection of inspiring stories across various topics
                    </p>
                </div>

                {stories.length === 0 ? (
                    <div className="bg-gray-800 rounded-xl p-8 text-center">
                        <p className="text-white text-lg">No stories available</p>
                        <DynamicButton
                            text="Create New Story"
                            alignment="center"
                            className="mt-6"
                            onClick={() => router.push('/admin/stories/create')}
                        />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {stories.map((story) => (
                                <div
                                    key={story._id}
                                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="relative h-60 w-full">
                                        <Image
                                            src={story.mainImage || '/images/placeholder.jpg'}
                                            alt={story.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20" />
                                        <div className="absolute top-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm flex items-center">
                                            <FiClock className="mr-1" /> 5 min read
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center text-gray-400 text-sm mb-3">
                                            <FiCalendar className="mr-1.5" />
                                            {new Date(story.publishedDate).toLocaleDateString()}
                                            <span className="mx-2">•</span>
                                            <FiEye className="mr-1.5" /> {story.views}
                                        </div>
                                        <Link href={`/featured-story/${story.slug}`}>
                                            <h2 className="text-xl font-bold text-white mb-3 hover:text-blue-400 transition-colors">
                                                {story.title}
                                            </h2>
                                        </Link>
                                        <p className="text-gray-300 mb-5 line-clamp-3">
                                            {story.metaDescription}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {story.tags.slice(0, 3).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <Link href={`/featured-story/${story.slug}`}>
                                            <DynamicButton
                                                text="Read Story"
                                                alignment="left"
                                                className="w-full"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            basePath="/featured-story"
                        />
                    </>
                )}
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </>
    );
}