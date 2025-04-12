'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

export default function FeaturedStory() {
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/feature');
                if (!res.ok) throw new Error('Failed to fetch stories');
                const data = await res.json();
                setStory(data[0]); // Show the latest story
            } catch (error) {
                toast.error('Error loading featured story');
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <p className="text-white text-lg">No featured story available</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 py-12 px-4">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Featured Story</h1>
                <div className="bg-gray-700 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                    <div className="relative h-64">
                        <Image
                            src={story.image}
                            alt={story.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg"
                        />
                    </div>
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-white mb-2">{story.title}</h2>
                        <p className="text-gray-300 mb-4">{story.description}</p>
                        <Link href={`/featured-story/${story.slug}`}>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                Read More
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}