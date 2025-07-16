// app/components/story/StoriesClient/StoriesClient.js

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiEye, FiCalendar, FiArrowRight } from 'react-icons/fi';
import Pagination from '../../Pagination/Pagination';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function StoriesClient({ stories, schema, currentPage = 1, totalPages = 1 }) {
    useEffect(() => {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }, []);

    return (
        <>
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12 py-6" data-aos="fade-in">
                    
                    <h1 className="text-3xl md:text-4xl font-medium text-white mb-3">
                        Featured Story
                    </h1>
                    <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">
                        Discover thought-provoking articles on innovation, culture, and digital trends
                    </p>

                    <div className="flex items-center justify-center mb-4">
                        <div className="flex-1 border-t border-gray-600"></div>
                        <div className="mx-4">
                            <FiArrowRight className="text-indigo-500 w-6 h-6 rotate-90" />
                        </div>
                        <div className="flex-1 border-t border-gray-600"></div>
                    </div>

                </div>

                {stories.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                        <p className="text-white text-base md:text-lg">No stories available</p>
                        <div className="flex justify-center mt-4">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <button
                                    type="button"
                                    className="relative px-3 py-1.5 bg-gray-900 rounded-lg leading-none flex items-center text-xs"
                                    onClick={() => router.push('/admin/stories/create')}
                                >
                                    <p className="text-indigo-400 group-hover:text-gray-100 transition duration-200">Create New Story</p>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {stories.map((story) => (
                                <div
                                    key={story._id}
                                    className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700 hover:border-indigo-500 transition-all duration-300"
                                    data-aos="fade-up"
                                >
                                    <div className="relative w-full aspect-[16/9]">
                                        <Image
                                            src={story.mainImage || '/images/placeholder.jpg'}
                                            alt={story.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            quality={80}
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    </div>
                                    <div className="p-5 flex flex-col h-full">
                                        <div className="flex items-center justify-between text-gray-400 text-xs md:text-sm mb-3">
                                            <span className="flex items-center">
                                                <FiCalendar className="mr-1 w-4 h-4" />
                                                {new Date(story.publishedDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                            <span className="flex items-center">
                                                <FiEye className="mr-1 w-4 h-4" /> {story.views}
                                            </span>
                                        </div>
                                        <Link href={`/featured-story/${story.slug}`}>
                                            <h2 className="text-lg font-medium text-white mb-3 hover:text-indigo-400 transition-colors duration-200">
                                                {story.title}
                                            </h2>
                                        </Link>
                                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                            {story.metaDescription.slice(0, 130)}...
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {story.tags.slice(0, 2).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-indigo-900/30 text-indigo-300 px-2.5 py-1 rounded-full text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="">
                                            <Link href={`/featured-story/${story.slug}`}>
                                                <button
                                                    type="button"
                                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition duration-200 flex items-center justify-center gap-1"
                                                >
                                                    Read More <FiArrowRight className="w-3 h-3" />
                                                </button>
                                            </Link>
                                        </div>
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
            <div className="fixed bottom-6 right-6 z-10">
                <Link href="#top">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition duration-200 flex items-center justify-center">
                        <FiArrowRight className="w-4 h-4 rotate-90" />
                    </button>
                </Link>
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </>
    );
}