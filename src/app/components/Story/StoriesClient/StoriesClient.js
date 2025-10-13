// app/components/Story/StoriesClient.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { FiEye, FiCalendar, FiArrowRight, FiArrowUp } from 'react-icons/fi';

import AOS from 'aos';
import 'aos/dist/aos.css';
import Pagination from '../../Pagination/Pagination';

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
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700 animate-pulse">
            <div className="relative w-full aspect-[16/9] bg-gray-700"></div>
            <div className="p-5">
                <div className="flex items-center justify-between text-gray-400 text-xs md:text-sm mb-3">
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-700 rounded mb-1"></div>
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-5 bg-indigo-900/30 rounded-full w-16"></div>
                    <div className="h-5 bg-indigo-900/30 rounded-full w-20"></div>
                </div>
                <div className="h-8 bg-indigo-600 rounded-md"></div>
            </div>
        </div>
    );

    return (
        <>
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12 py-6" data-aos="fade-down">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Featured Stories
                    </h1>
                    <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Discover thought-provoking articles on innovation, culture, and digital trends
                    </p>
                    <div className="flex items-center justify-center mt-6">
                        <div className="flex-1 border-t border-gray-600 max-w-xs"></div>
                        <div className="mx-4 text-indigo-500">
                            <FiArrowRight className="w-6 h-6 rotate-90 animate-pulse" />
                        </div>
                        <div className="flex-1 border-t border-gray-600 max-w-xs"></div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 text-center text-red-300">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {[...Array(9)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : stories.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                        <p className="text-white text-lg mb-4">No stories available at the moment</p>
                        {isAdmin && (
                            <button
                                type="button"
                                className="relative px-6 py-3 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition duration-300"
                                onClick={() => router.push('/admin/stories/create')}
                            >
                                Create New Story
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {stories.map((story, index) => (
                                <div
                                    key={story._id}
                                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-indigo-500 hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="relative w-full aspect-[16/9]">
                                        <Image
                                            src={story.mainImage || '/images/placeholder.jpg'}
                                            alt={story.title}
                                            fill
                                            className="object-cover transition-transform duration-500 hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            quality={90}
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAAAAAAAAAAAAAAAAAAAAAA//8QAFQEBAQAAAAAAAAAAAAAAAAAABgj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdKqgA/9k="
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90" />
                                    </div>
                                    <div className="p-6 flex flex-col relative z-10">
                                        <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                                            <span className="flex items-center gap-1">
                                                <FiCalendar className="w-4 h-4" />
                                                {new Date(story.publishedDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiEye className="w-4 h-4" /> {story.views || 0}
                                            </span>
                                        </div>
                                        <Link href={`/featured-story/${story.slug}`}>
                                            <h2 className="text-xl font-semibold text-white mb-3 hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
                                                {story.title}
                                            </h2>
                                        </Link>
                                        <p className="text-gray-300 text-sm mb-5 line-clamp-3 leading-relaxed">
                                            {story.metaDescription}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {story.tags.slice(0, 4).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-indigo-900/40 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <Link href={`/featured-story/${story.slug}`}>
                                            <button
                                                type="button"
                                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                            >
                                                Read More <FiArrowRight className="w-4 h-4" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            basePath="/featured-story"
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-xl transition duration-300 transform hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <FiArrowUp className="w-5 h-5" />
                </button>
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </>
    );
}