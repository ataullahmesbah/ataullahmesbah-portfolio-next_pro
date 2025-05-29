// app/(with-layout)/featured-story/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { FiCalendar } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import UserLink from '../../Profile/ProfileLink/UserLink';

export default function FeaturedStory() {
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    useEffect(() => {
        async function fetchLatestStory() {
            try {
                const res = await fetch('/api/feature', {
                    cache: 'no-store',
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch story');
                }
                const stories = await res.json();
                // Get the latest published story
                const latestStory = Array.isArray(stories)
                    ? stories.find(s => s.status === 'published')
                    : null;
                setStory(latestStory);
            } catch (error) {
                console.error('Error fetching story:', error);
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
            <div className=" flex items-center justify-center px-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="flex items-center justify-center px-4">
                <p className="text-white text-base">No featured story available</p>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
                        {/* Left Side: Image */}
                        <div className="lg:w-1/2 relative h-64 lg:h-auto">
                            <Image
                                src={story.mainImage || '/images/placeholder.jpg'}
                                alt={story.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-black/50 lg:to-transparent" />
                        </div>

                        {/* Right Side: Details */}
                        <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                            <h3 className="text-lg font-semibold text-blue-400 uppercase tracking-wider mb-3">
                                Featured Story
                            </h3>
                            <Link href={`/featured-story/${story.slug}`}>
                                <h2 className="text-2xl font-bold text-white mb-3 hover:text-blue-400 transition-colors">
                                    {story.title}
                                </h2>
                            </Link>
                            <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                                {story.metaDescription.slice(0, 130)}...
                            </p>
                            <div className="flex gap-3 items-center">
                                

                                <div className="items-center text-gray-400 text-sm space-y-1">
                                    
                                    <span className="text-white font-medium">By <UserLink author={story.author} /></span>
                                    <span className="mx-2"></span>
                                    <span className="flex items-center">
                                        <FiCalendar className="mr-1" />
                                        {new Date(story.publishedDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}