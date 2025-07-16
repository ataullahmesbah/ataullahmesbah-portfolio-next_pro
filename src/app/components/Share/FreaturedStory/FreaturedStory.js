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
    const { data: session, status } = useSession();

    useEffect(() => {
        async function fetchLatestStory() {
            try {
                const res = await fetch('/api/feature', {
                    next: { revalidate: 3600 }, // Cache for 1 hour
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch story');
                }
                const stories = await res.json();
                const latestStory = Array.isArray(stories)
                    ? stories.find((s) => s.status === 'published')
                    : null;
                setStory(latestStory);
            } catch (error) {
                console.error('Error fetching story:', error);
                toast.error('Failed to load featured story');
                setStory(null);
            }
        }

        fetchLatestStory();
    }, []);

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
                        <div className="lg:w-1/2 relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                            <Image
                                src={story.mainImage || '/images/placeholder.jpg'}
                                alt={story.title}
                                fill
                                className="object-contain w-full h-full"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                quality={80}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-black/50 lg:to-transparent" />
                        </div>

                        {/* Right Side: Details */}
                        <div className="lg:w-1/2 p-4 lg:p-5 flex flex-col justify-center">
                            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                                Featured Story
                            </h3>
                            <Link href={`/featured-story/${story.slug}`}>
                                <h2 className="text-base amsfonts text-gray-200 mb-2 hover:text-blue-200 transition-colors">
                                    {story.title}
                                </h2>
                            </Link>
                            <p className="text-gray-300 mb-3 text-xs line-clamp-3">
                                {story.metaDescription.slice(0, 140)}...
                            </p>
                            <div className="flex gap-3 items-center">
                                <div className="items-center text-gray-400 text-xs space-y-1">
                                    <span className="text-white font-medium">
                                        By <UserLink author={story.author} />
                                    </span>
                                    <span className="mx-2"></span>
                                    <span className="flex items-center">
                                        <FiCalendar className="mr-1 w-4 h-4" />
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