'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '@/app/components/Loader/Loader';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';

export default function AllFeaturedStories() {
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchStories = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/feature');
            if (!res.ok) throw new Error('Failed to fetch stories');
            const data = await res.json();
            setStories(data);
            setFilteredStories(data);
        } catch (error) {
            toast.error('Error loading stories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    useEffect(() => {
        setFilteredStories(
            stories.filter(story =>
                story.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, stories]);

    const handleDelete = async (slug) => {
        if (!confirm('Are you sure you want to delete this story?')) return;

        try {
            const res = await fetch(`/api/feature/${slug}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete story');
            setStories(stories.filter((story) => story.slug !== slug));
            setFilteredStories(filteredStories.filter((story) => story.slug !== slug));
            toast.success('Story deleted successfully!');
        } catch (error) {
            toast.error('Error deleting story');
        }
    };

    const handleRefresh = () => {
        fetchStories();
        setSearchQuery('');
        toast.success('Page refreshed!');
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-800 py-12 px-4">
            <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-white">All Featured Stories</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white"
                            title="Refresh"
                        >
                            <FiRefreshCw className="text-xl" />
                        </button>
                        <Link href="/admin-dashboard/story/add-featured-story" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                            Create New Story
                        </Link>
                    </div>
                </div>

                {filteredStories.length === 0 ? (
                    <div className="bg-gray-700 rounded-lg p-8 text-center">
                        <p className="text-white text-lg">No stories found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-700 rounded-lg shadow-lg">
                            <thead>
                                <tr className="bg-gray-600 text-white">
                                    <th className="py-3 px-6 text-left">Title</th>
                                    <th className="py-3 px-6 text-left">Views</th>
                                    <th className="py-3 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStories.map((story) => (
                                    <tr key={story._id} className="border-b border-gray-600 hover:bg-gray-650">
                                        <td className="py-4 px-6 text-white">{story.title}</td>
                                        <td className="py-4 px-6 text-white">{story.views}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={`/featured-story/${story.slug}`}>
                                                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">
                                                        View
                                                    </button>
                                                </Link>
                                                <Link href={`/admin-dashboard/story/edit-featured-story/${story.slug}`}>
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}