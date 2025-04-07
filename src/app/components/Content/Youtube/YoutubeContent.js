"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiArrowLeft, FiYoutube, FiPlay, FiClock, FiExternalLink } from "react-icons/fi";
import Image from "next/image";
import { motion } from "framer-motion";

export default function YoutubeContent({ videos = [] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 9;

    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVideos = filteredVideos.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getYoutubeThumbnail = (url) => {
        const id = getYoutubeId(url);
        if (!id) return "/images/youtube-placeholder.jpg";
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
                >
                    <div className="flex items-center gap-4">
                        <Link
                            href="/content-creation"
                            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                        >
                            <FiArrowLeft className="text-xl" />
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                            <FiYoutube className="text-red-600 text-4xl" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
                                YouTube Videos
                            </span>
                            <span className="text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded-full ml-2">
                                {videos.length} videos
                            </span>
                        </h1>
                    </div>

                    {/* Enhanced Search Box */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative w-full md:w-80"
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search videos by title or description..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </motion.div>
                </motion.div>

                {/* Videos Grid */}
                {currentVideos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {currentVideos.map((video, index) => (
                            <motion.div
                                key={video._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-red-500/20 transition-all hover:-translate-y-1"
                            >
                                <div className="relative aspect-video">
                                    <Image
                                        src={getYoutubeThumbnail(video.link)}
                                        alt={video.title}
                                        width={640}
                                        height={360}
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target.src = "/images/youtube-placeholder.jpg")}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent group-hover:from-red-600/30 group-hover:to-transparent transition-all"></div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                            <FiPlay className="text-xl ml-1 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 left-3 bg-black/70 text-xs px-2 py-1 rounded">
                                        YouTube
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                                        {video.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                                        {video.description}
                                    </p>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center text-gray-500">
                                            <FiClock className="mr-1" />
                                            <span>{new Date(video.date).toLocaleDateString()}</span>
                                        </div>
                                        <Link
                                            href={video.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-red-500 hover:text-red-400 transition-colors"
                                        >
                                            <FiExternalLink className="mr-1" /> Watch
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">No videos found matching your search</div>
                        <button
                            onClick={() => setSearchTerm("")}
                            className="text-red-500 hover:text-red-400 underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center items-center gap-2 mt-8"
                    >
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-40 hover:bg-gray-700 transition-colors flex items-center gap-1"
                        >
                            <FiArrowLeft /> Previous
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentPage === pageNum
                                            ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-40 hover:bg-gray-700 transition-colors flex items-center gap-1"
                        >
                            Next <FiArrowLeft className="transform rotate-180" />
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}