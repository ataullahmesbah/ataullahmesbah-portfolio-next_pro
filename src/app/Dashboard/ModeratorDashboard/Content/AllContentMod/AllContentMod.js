// src/app/moderator-dashboard/content/page.js
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaSearch } from 'react-icons/fa'; // Added for search icon

export default function AllContentMod() {
    const [contents, setContents] = useState([]);
    const [filteredContents, setFilteredContents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [platformFilter, setPlatformFilter] = useState("All");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Added for pagination
    const contentsPerPage = 10; // Added for pagination
    const router = useRouter();
    const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/content");
            const sortedContent = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setContents(sortedContent);
            filterContent(sortedContent, searchQuery, platformFilter);
            toast.success("Content loaded successfully");
        } catch (error) {
            toast.error("Failed to fetch content");
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const filterContent = (data, query, platform) => {
        let filtered = [...data];
        if (query) {
            filtered = filtered.filter(
                content =>
                    content.title.toLowerCase().includes(query.toLowerCase()) ||
                    content.link.toLowerCase().includes(query.toLowerCase())
            );
        }
        if (platform !== "All") {
            filtered = filtered.filter(content => content.platform === platform);
        }
        setFilteredContents(filtered);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        filterContent(contents, searchQuery, platformFilter);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleRefresh = () => {
        fetchContent();
        setCurrentPage(1); // Reset to first page on refresh
    };

    // Pagination Logic
    const indexOfLastContent = currentPage * contentsPerPage;
    const indexOfFirstContent = indexOfLastContent - contentsPerPage;
    const currentContents = filteredContents.slice(indexOfFirstContent, indexOfLastContent);
    const totalPages = Math.ceil(filteredContents.length / contentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
            <div className="py-6 space-y-4 text-center">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-700">
                    All Content Data
                </h1>
                <p className="text-base text-purple-300">
                    Want to see my latest videos?{" "}
                    <Link
                        href={`${NEXTAUTH_URL}/content-creation`}
                        className="text-purple-400 hover:text-purple-500 underline transition-colors"
                    >
                        Visit this page
                    </Link>{" "}
                    to explore my content creation journey!
                </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row gap-3 items-center">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title or link..."
                        className="w-full sm:w-64 p-3 bg-gray-800 border border-gray-700 rounded-lg text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                    <button
                        type="submit"
                        className="flex items-center px-4 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 text-white font-semibold transition-all duration-300"
                    >
                        <FaSearch size={16} className="mr-2" />
                        Search
                    </button>
                </form>
                <select
                    value={platformFilter}
                    onChange={(e) => {
                        setPlatformFilter(e.target.value);
                        filterContent(contents, searchQuery, e.target.value);
                        setCurrentPage(1); // Reset to first page on filter
                    }}
                    className="w-full sm:w-40 p-3 bg-gray-800 border border-gray-700 rounded-lg text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                    <option value="All">All Platforms</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                </select>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 text-white font-semibold disabled:opacity-50 transition-all duration-300"
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* Content Table */}
            <div className="max-w-6xl mx-auto overflow-x-auto bg-gray-900 rounded-lg shadow-lg">
                {loading && <div className="text-center py-4 text-purple-300">Loading...</div>}
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-purple-200">
                            <th className="p-4">Title</th>
                            <th className="p-4">Link</th>
                            <th className="p-4">Platform</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentContents.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-purple-300">No content found</td>
                            </tr>
                        ) : (
                            currentContents.map(content => (
                                <tr key={content._id} className="border-b border-gray-700 hover:bg-gray-800 transition-all">
                                    <td className="p-4 text-purple-300">{content.title}</td>
                                    <td className="p-4">
                                        <Link href={content.link} target="_blank" className="text-purple-400 hover:text-purple-500 hover:underline">
                                            {content.link}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-purple-300">{content.platform}</td>
                                    <td className="p-4 flex gap-2">
                                        <button
                                            onClick={() => router.push(`/moderator-dashboard/content-creation/edit/${content.slug}`)}
                                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm text-white transition-all duration-300"
                                        >
                                            Update
                                        </button>
                                        <Link
                                            href={content.link}
                                            target="_blank"
                                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white transition-all duration-300"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-2 p-4">
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
        </div>
    );
}