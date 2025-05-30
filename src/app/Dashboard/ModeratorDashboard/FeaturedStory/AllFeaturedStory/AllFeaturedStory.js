// src/app/moderator-dashboard/featured-story/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';

export default function AllFeaturedStoriesMod() {
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const storiesPerPage = 10;

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
        setCurrentPage(1); // Reset to first page on search
    }, [searchQuery, stories]);

    const handleRefresh = () => {
        fetchStories();
        setSearchQuery('');
        toast.success('Page refreshed!');
    };

    // Pagination Logic
    const indexOfLastStory = currentPage * storiesPerPage;
    const indexOfFirstStory = indexOfLastStory - storiesPerPage;
    const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory);
    const totalPages = Math.ceil(filteredStories.length / storiesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div className="min-h-screen bg-gray-950 text-center text-purple-300 py-10">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-4 md:px-6">
            <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-purple-400">All Featured Stories</h1>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-purple-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 text-white transition-all duration-300"
                            title="Refresh"
                        >
                            <FiRefreshCw className="text-xl" />
                        </button>
                        <Link href="/moderator-dashboard/featured-story/attach-story" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300">
                            Create New Story
                        </Link>
                    </div>
                </div>

                {currentStories.length === 0 ? (
                    <div className="bg-gray-900 rounded-lg p-8 text-center">
                        <p className="text-purple-300 text-lg">No stories found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-900 rounded-lg shadow-lg">
                            <thead>
                                <tr className="bg-gray-800 text-purple-200">
                                    <th className="py-3 px-4 md:px-6 text-left">Title</th>
                                    <th className="py-3 px-4 md:px-6 text-left">Views</th>
                                    <th className="py-3 px-4 md:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStories.map((story) => (
                                    <tr key={story._id} className="border-b border-gray-700 hover:bg-gray-800">
                                        <td className="py-4 px-4 md:px-6 text-purple-300">{story.title}</td>
                                        <td className="py-4 px-4 md:px-6 text-purple-300">{story.views}</td>
                                        <td className="py-4 px-4 md:px-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={`/featured-story/${story.slug}`}>
                                                    <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-all duration-300">
                                                        View
                                                    </button>
                                                </Link>
                                                <Link href={`/moderator-dashboard/featured-story/edit/${story.slug}`}>
                                                    <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-all duration-300">
                                                        Edit
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 space-x-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50 transition-all duration-300"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-purple-200 hover:bg-gray-600'} transition-all duration-300`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50 transition-all duration-300"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}