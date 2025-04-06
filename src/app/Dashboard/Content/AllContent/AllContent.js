'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AllContentPage() {
    const [contents, setContents] = useState([]);
    const [filteredContents, setFilteredContents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [platformFilter, setPlatformFilter] = useState("All");
    const router = useRouter();

    const fetchContent = async () => {
        try {
            const res = await axios.get("/api/content");
            const sortedContent = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setContents(sortedContent);
            filterContent(sortedContent, searchQuery, platformFilter);
        } catch (error) {
            toast.error("Failed to fetch content");
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
    };

    const handleDelete = async (slug) => {
        if (!confirm("Are you sure you want to delete this content?")) return;
        try {
            await axios.delete(`/api/content/${slug}`);
            toast.success("Content deleted successfully");
            fetchContent();
        } catch (error) {
            toast.error("Failed to delete content");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">All Content Data</h1>

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title or link..."
                        className="w-full p-2 bg-gray-800 rounded text-white"
                    />
                    <button type="submit" className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded hover:opacity-90">
                        Search
                    </button>
                </form>
                <select
                    value={platformFilter}
                    onChange={(e) => {
                        setPlatformFilter(e.target.value);
                        filterContent(contents, searchQuery, e.target.value);
                    }}
                    className="p-2 bg-gray-800 rounded text-white"
                >
                    <option value="All">All Platforms</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                </select>
                <button
                    onClick={fetchContent}
                    className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded hover:opacity-90"
                >
                    Refresh
                </button>
            </div>

            {/* Content Table */}
            <div className="max-w-6xl mx-auto overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="p-4">Title</th>
                            <th className="p-4">Link</th>
                            <th className="p-4">Platform</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContents.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-400">No content found</td>
                            </tr>
                        ) : (
                            filteredContents.map(content => (
                                <tr key={content._id} className="border-b border-gray-700 hover:bg-gray-850">
                                    <td className="p-4">{content.title}</td>
                                    <td className="p-4">
                                        <Link href={content.link} target="_blank" className="text-indigo-400 hover:underline">
                                            {content.link}
                                        </Link>
                                    </td>
                                    <td className="p-4">{content.platform}</td>
                                    <td className="p-4 flex gap-2">
                                        <button
                                            onClick={() => router.push(`/admin-dashboard/content/edit/${content.slug}`)}
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(content.slug)}
                                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                                        >
                                            Delete
                                        </button>
                                        <Link
                                            href={content.link}
                                            target="_blank"
                                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}