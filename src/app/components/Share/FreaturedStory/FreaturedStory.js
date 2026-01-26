'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { FiCalendar, FiClock, FiEye, FiArrowRight } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import UserLink from '../../Profile/ProfileLink/UserLink';

export default function FeaturedStory() {
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    useEffect(() => {
        async function fetchLatestStory() {
            try {
                setLoading(true);
                const res = await fetch('/api/feature?limit=1&sort=latest');

                if (!res.ok) {
                    throw new Error('Failed to fetch story');
                }

                const data = await res.json();

                // API response structure check
                const stories = data.stories || data;
                const latestStory = Array.isArray(stories)
                    ? stories[0] // First story is the latest
                    : stories;

                if (latestStory && latestStory.status === 'published') {
                    setStory(latestStory);
                } else {
                    setStory(null);
                }
            } catch (error) {

                toast.error('Failed to load featured story');
                setStory(null);
            } finally {
                setLoading(false);
            }
        }

        fetchLatestStory();
    }, []);

    if (loading) {
        return (
            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
                    <div className="animate-pulse">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Image Skeleton */}
                            <div className="lg:w-1/2">
                                <div className="w-full aspect-[16/9] bg-gray-700 rounded-xl"></div>
                            </div>
                            {/* Content Skeleton */}
                            <div className="lg:w-1/2 space-y-4">
                                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-700 rounded"></div>
                                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Featured Story</h3>
                    <p className="text-gray-400 text-sm">Check back later for new stories</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">


                {/* Featured Story Card */}
                <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10">
                    <div className="flex flex-col lg:flex-row">
                        {/* Image Section */}
                        <div className="lg:w-1/2 relative overflow-hidden">
                            <div className="relative w-full aspect-[16/9] lg:aspect-auto lg:h-full">
                                <Image
                                    src={story.mainImage || '/images/placeholder.jpg'}
                                    alt={story.mainImageAlt || story.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    quality={85}
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/60 lg:via-transparent lg:to-transparent" />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-purple-600/90 text-purple-100 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm capitalize">
                                        {story.category || 'featured'}
                                    </span>
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent lg:hidden" />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                            <div className="space-y-4">
                                {/* Featured Badge */}
                                <div className="flex items-center gap-2">
                                    <span className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                        Featured
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                        Latest Story
                                    </span>
                                </div>

                                {/* Title */}
                                <Link href={`/featured-story/${story.slug}`}>
                                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3 hover:text-purple-300 transition-colors duration-300 line-clamp-2 leading-tight group-hover:translate-x-1 transition-transform">
                                        {story.title}
                                    </h2>
                                </Link>

                                {/* Description */}
                                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                                    {story.shortDescription || story.metaDescription}
                                </p>

                                {/* Stats - Responsive */}
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-400 text-xs">
                                    {/* Published Date */}
                                    <span className="flex items-center gap-1 flex-shrink-0">
                                        <FiCalendar className="w-3 h-3 text-purple-400 flex-shrink-0" />
                                        <span className="hidden xs:inline">
                                            {new Date(story.publishedDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span className="xs:hidden">
                                            {new Date(story.publishedDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </span>

                                    {/* Reading Time - Always visible */}
                                    <span className="flex items-center gap-1 flex-shrink-0">
                                        <FiClock className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                        <span>{story.readingTime || 5} min</span>
                                    </span>

                                    {/* Views - Hidden on very small screens */}
                                    <span className="hidden sm:flex items-center gap-1 flex-shrink-0">
                                        <FiEye className="w-3 h-3 text-green-400 flex-shrink-0" />
                                        <span>{story.views || 0} views</span>
                                    </span>

                                    {/* Mobile Views - Compact version */}
                                    <span className="sm:hidden flex items-center gap-1 flex-shrink-0">
                                        <FiEye className="w-3 h-3 text-green-400 flex-shrink-0" />
                                        <span>{story.views || 0}</span>
                                    </span>
                                </div>

                                {/* Author Info - Compact & Elegant (Enhanced Responsive) */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-gray-700/50">
                                    {/* Author Section */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {/* Avatar */}
                                        <div className="relative group flex-shrink-0">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-transform group-hover:scale-110">
                                                {story.author?.charAt(0)?.toUpperCase() || 'A'}
                                            </div>
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>
                                        </div>

                                        {/* Author Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col xs:flex-row xs:items-center xs:gap-2">
                                                <p className="text-white text-sm font-medium truncate">
                                                    By{' '}
                                                    <UserLink
                                                        author={story.author}
                                                        className="text-gray-300 hover:text-white transition-colors"
                                                    />
                                                </p>
                                                {/* Mobile Stats */}
                                                <div className="flex items-center gap-2 mt-1 xs:mt-0 sm:hidden">
                                                    <span className="text-gray-500 text-xs">•</span>
                                                    <span className="text-gray-500 text-xs flex items-center gap-1">
                                                        <FiClock className="w-3 h-3" />
                                                        {story.readingTime || 5} min
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Desktop Author Title */}
                                            <p className="text-gray-500 text-xs hidden sm:block">Published author</p>
                                        </div>
                                    </div>

                                    {/* Read More Button */}
                                    <div className="flex sm:flex-shrink-0">
                                        <Link
                                            href={`/featured-story/${story.slug}`}
                                            className="group/btn inline-flex items-center gap-2 text-purple-300 hover:text-white bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 hover:border-purple-400/50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm w-full sm:w-auto justify-center sm:justify-start"
                                        >
                                            <span className="whitespace-nowrap">Read More</span>
                                            <FiArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 flex-shrink-0" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
}