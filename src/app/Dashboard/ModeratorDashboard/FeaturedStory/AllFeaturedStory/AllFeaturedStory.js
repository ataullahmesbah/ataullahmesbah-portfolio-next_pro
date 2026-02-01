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
    const [totalPages, setTotalPages] = useState(1);
    const storiesPerPage = 10;

    const fetchStories = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/feature');
            if (!res.ok) throw new Error('Failed to fetch stories');

            const data = await res.json();

            // ✅ FIX: Check the API response structure
            console.log('API Response:', data);

            // API returns { stories: [], total: ..., page: ..., pages: ... }
            if (data.stories && Array.isArray(data.stories)) {
                setStories(data.stories);
                setFilteredStories(data.stories);
                setTotalPages(data.pages || 1);
            } else if (Array.isArray(data)) {
                // If API directly returns array (old format)
                setStories(data);
                setFilteredStories(data);
                setTotalPages(Math.ceil(data.length / storiesPerPage));
            } else {
                console.error('Invalid data format:', data);
                toast.error('Invalid data format received');
                setStories([]);
                setFilteredStories([]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Error loading stories');
            setStories([]);
            setFilteredStories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredStories(stories);
        } else {
            const filtered = stories.filter(story =>
                story && story.title &&
                story.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredStories(filtered);
        }
        setCurrentPage(1); // Reset to first page on search
    }, [searchQuery, stories]);

    const handleRefresh = () => {
        fetchStories();
        setSearchQuery('');
        toast.success('Page refreshed!');
    };

    // ✅ FIX: Safe pagination logic
    const indexOfLastStory = currentPage * storiesPerPage;
    const indexOfFirstStory = indexOfLastStory - storiesPerPage;

    // Ensure filteredStories is an array before slicing
    const currentStories = Array.isArray(filteredStories)
        ? filteredStories.slice(indexOfFirstStory, indexOfLastStory)
        : [];

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-purple-300">Loading stories...</p>
                </div>
            </div>
        );
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
                        <Link
                            href="/moderator-dashboard/featured-story/attach-story"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
                        >
                            Create New Story
                        </Link>
                    </div>
                </div>

                {currentStories.length === 0 ? (
                    <div className="bg-gray-900 rounded-lg p-8 text-center">
                        <p className="text-purple-300 text-lg">
                            {stories.length === 0 ? 'No stories available' : 'No stories match your search'}
                        </p>
                        {stories.length === 0 && (
                            <Link
                                href="/moderator-dashboard/featured-story/attach-story"
                                className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300"
                            >
                                Create First Story
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto mb-6">
                            <table className="min-w-full bg-gray-900 rounded-lg shadow-lg">
                                <thead>
                                    <tr className="bg-gray-800 text-purple-200">
                                        <th className="py-3 px-4 md:px-6 text-left">Title</th>
                                        <th className="py-3 px-4 md:px-6 text-left">Category</th>
                                        <th className="py-3 px-4 md:px-6 text-left">Views</th>
                                        <th className="py-3 px-4 md:px-6 text-left">Author</th>
                                        <th className="py-3 px-4 md:px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentStories.map((story) => (
                                        <tr key={story._id || story.id} className="border-b border-gray-700 hover:bg-gray-800">
                                            <td className="py-4 px-4 md:px-6 text-purple-300">
                                                <div className="font-medium">{story.title || 'Untitled'}</div>
                                                {story.shortDescription && (
                                                    <div className="text-sm text-gray-400 mt-1">{story.shortDescription.substring(0, 50)}...</div>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 md:px-6">
                                                <span className="inline-block bg-gray-700 text-purple-300 px-3 py-1 rounded-full text-sm">
                                                    {story.category || 'featured'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 md:px-6 text-purple-300">
                                                {story.views || 0}
                                            </td>
                                            <td className="py-4 px-4 md:px-6 text-purple-300">
                                                {story.author || 'Unknown'}
                                            </td>
                                            <td className="py-4 px-4 md:px-6 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link href={`/featured-story/${story.slug || story._id}`}>
                                                        <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-all duration-300">
                                                            View
                                                        </button>
                                                    </Link>
                                                    <Link href={`/moderator-dashboard/featured-story/edit/${story.slug || story._id}`}>
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
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    Previous
                                </button>

                                {/* Show first page */}
                                {currentPage > 3 && (
                                    <button
                                        onClick={() => paginate(1)}
                                        className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 transition-all duration-300"
                                    >
                                        1
                                    </button>
                                )}

                                {/* Show ellipsis if needed */}
                                {currentPage > 4 && (
                                    <span className="px-2 text-purple-300">...</span>
                                )}

                                {/* Show page numbers around current page */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page =>
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    )
                                    .map(page => (
                                        <button
                                            key={page}
                                            onClick={() => paginate(page)}
                                            className={`px-4 py-2 rounded transition-all duration-300 ${currentPage === page
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-700 text-purple-200 hover:bg-gray-600'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                {/* Show ellipsis if needed */}
                                {currentPage < totalPages - 3 && (
                                    <span className="px-2 text-purple-300">...</span>
                                )}

                                {/* Show last page */}
                                {currentPage < totalPages - 2 && totalPages > 1 && (
                                    <button
                                        onClick={() => paginate(totalPages)}
                                        className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 transition-all duration-300"
                                    >
                                        {totalPages}
                                    </button>
                                )}

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        <div className="text-center mt-4 text-gray-400 text-sm">
                            Showing {currentStories.length} of {filteredStories.length} stories
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}