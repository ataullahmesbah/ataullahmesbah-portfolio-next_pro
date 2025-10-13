// app/components/Story/StoriesClient.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Pagination from '../../Pagination/Pagination';
import { FiEye, FiCalendar, FiArrowRight, FiArrowUp, FiClock, FiPlay } from 'react-icons/fi';
import { motion } from 'framer-motion';



export default function StoriesClient({ initialStories, schema, currentPage = 1, totalPages = 1 }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [stories, setStories] = useState(initialStories);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isAdmin = session?.user?.isAdmin;

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
        });
    }, []);

    useEffect(() => {
        setStories(initialStories);
    }, [initialStories]);

    const handlePageChange = async (newPage) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feature?page=${newPage}&limit=9`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });
            if (!res.ok) {
                throw new Error('Failed to fetch stories');
            }
            const data = await res.json();
            setStories(data.stories);
            router.push(`/featured-story?page=${newPage}`, { scroll: false });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const SkeletonCard = () => (
        <div className="">
            <div className="relative w-full aspect-[16/9] bg-gray-700/50"></div>
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-5 bg-gray-700/50 rounded-full w-20"></div>
                    <div className="flex gap-3">
                        <div className="h-5 bg-gray-700/50 rounded w-12"></div>
                        <div className="h-5 bg-gray-700/50 rounded w-12"></div>
                    </div>
                </div>
                <div className="h-6 bg-gray-700/50 rounded mb-3"></div>
                <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
                <div className="h-4 bg-gray-700/50 rounded mb-4 w-3/4"></div>
                <div className="h-10 bg-purple-600/30 rounded-lg"></div>
            </div>
        </div>
    );

    return (
        <>
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="text-center mb-12 py-8" data-aos="fade-down">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                            Featured Stories
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                            Discover captivating stories about technology, innovation, and digital experiences
                        </p>
                        <div className="flex items-center justify-center mt-8">
                            <div className="flex-1 border-t border-gray-700 max-w-xs"></div>
                            <div className="mx-6 text-purple-500">
                                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex-1 border-t border-gray-700 max-w-xs"></div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-8 text-center text-red-300 backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : stories.length === 0 ? (
                        <div className="bg-gray-800/30 rounded-2xl p-12 text-center border border-gray-700/50 backdrop-blur-sm">
                            <p className="text-white text-xl mb-6 font-light">No stories available at the moment</p>
                            {isAdmin && (
                                <button
                                    type="button"
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                                    onClick={() => router.push('/admin/stories/create')}
                                >
                                    Create New Story
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Stories Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                                {stories.map((story, index) => (
                                    <div
                                        key={story._id}
                                        className="group bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10"
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                    >
                                        {/* Image Container */}
                                        <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-700/30">
                                            <Image
                                                src={story.mainImage || '/images/placeholder.jpg'}
                                                alt={story.title}
                                                width={800}
                                                height={450}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 400px"
                                                quality={85}
                                                loading="lazy"
                                                placeholder="blur"
                                                blurDataURL="data:image/jpeg;base64,/9j/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAAAAAAAAAAAAAAAAAAAAAA//8QAFQEBAQAAAAAAAAAAAAAAAAAABgj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdKqgA/9k="
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-purple-600/90 text-purple-100 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                                                    {story.category || 'Story'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section - Fix Height Issues */}
                                        <div className="p-6 flex flex-col min-h-[280px]">
                                            {/* Meta Info */}
                                            <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                                                <div className="flex items-center gap-1">
                                                    <FiCalendar className="w-4 h-4 text-purple-400" />
                                                    <span>
                                                        {new Date(story.publishedDate).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <FiClock className="w-4 h-4 text-blue-400" />
                                                        {story.readingTime || 5} min
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FiEye className="w-4 h-4 text-green-400" />
                                                        {story.views || 0}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <Link href={`/featured-story/${story.slug}`} className="mb-3">
                                                <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2 leading-tight">
                                                    {story.title}
                                                </h2>
                                            </Link>

                                            {/* Description - Fallback system */}
                                            <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed font-light flex-grow">
                                                {story.shortDescription || story.metaDescription || 'Discover this amazing story...'}
                                            </p>


                                            {/* Author Section - Conditional Display */}
                                            {(story.author || story.readingTime) && (
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto pt-4 border-t border-gray-700/50">
                                                    {/* Author Info */}
                                                    {story.author && (
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                                {story.author.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-white text-sm font-medium truncate">{story.author}</p>

                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Read Story Button */}
                                                    <Link
                                                        href={`/featured-story/${story.slug}`}
                                                        className="group relative bg-gray-900/60 backdrop-blur-md border border-gray-600/30 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-gray-800/80 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-400/20 overflow-hidden w-full sm:w-fit justify-center"
                                                    >
                                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-r-full group-hover:h-10 transition-all duration-300" />
                                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                        <motion.div
                                                            animate={{ rotate: [0, 10, 0] }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                        >
                                                            <FiPlay className="relative group-hover:scale-110 transition-transform duration-300" />
                                                        </motion.div>
                                                        <span className="relative text-sm">Read Story</span>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mb-12" data-aos="fade-up">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    basePath="/featured-story"
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Scroll to Top Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-3 rounded-xl shadow-2xl shadow-purple-500/20 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                    aria-label="Scroll to top"
                >
                    <FiArrowUp className="w-5 h-5" />
                </button>
            </div>

            {/* Schema Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </>
    );
}