'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '@/app/components/Loader/Loader';
import Image from 'next/image';

export default function AllFeaturedStories() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/feature');
                if (!res.ok) throw new Error('Failed to fetch stories');
                const data = await res.json();
                setStories(data);
            } catch (error) {
                toast.error('Error loading stories');
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    const handleDelete = async (slug) => {
        if (!confirm('Are you sure you want to delete this story?')) return;

        try {
            const res = await fetch(`/api/feature/${slug}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete story');
            setStories(stories.filter((story) => story.slug !== slug));
            toast.success('Story deleted successfully!');
        } catch (error) {
            toast.error('Error deleting story');
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-800 py-12 px-4">
            <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">All Featured Stories</h1>
                    <Link href="/admin/Story/CreateFeaturedStory" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                        Create New Story
                    </Link>
                </div>

                {stories.length === 0 ? (
                    <div className="bg-gray-700 rounded-lg p-8 text-center">
                        <p className="text-white text-lg">No stories found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story) => (
                            <div key={story._id} className="bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="relative h-48">
                                    <Image
                                        src={story.image}
                                        alt={story.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-white mb-2">{story.title}</h2>
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{story.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-400">Views: {story.views}</span>
                                        <div className="flex space-x-2">
                                            <Link href={`/featured-story/${story.slug}`}>
                                                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">
                                                    View
                                                </button>
                                            </Link>
                                            <Link href={`/admin/Story/EditFeaturedStory/${story.slug}`}>
                                                <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition">
                                                    Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(story.slug)}
                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}