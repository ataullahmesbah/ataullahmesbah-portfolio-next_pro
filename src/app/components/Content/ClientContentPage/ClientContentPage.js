"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FiYoutube, FiArrowRight, FiPlay, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ClientContentCreation({ youtubeVideos, youtubeCount }) {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const modalRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 9; // 3x3 grid

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setSelectedVideo(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get current videos for pagination
    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = youtubeVideos.slice(indexOfFirstVideo, indexOfLastVideo);
    const totalPages = Math.ceil(youtubeVideos.length / videosPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    // YouTube ID extraction
    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleVideoClick = (video) => {
        setIsLoading(true);
        const youtubeId = getYoutubeId(video.link);

        if (!youtubeId) {
            console.error("Invalid YouTube URL");
            setIsLoading(false);
            return;
        }

        setSelectedVideo({
            ...video,
            embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`
        });
    };

    const getYoutubeThumbnail = (url) => {
        const id = getYoutubeId(url);
        if (!id) return "/images/youtube-placeholder.jpg";
        return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden border-b border-gray-800">
            <header className="relative py-24 md:py-32 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/content-bg-pattern.png')] opacity-10 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-900/80 via-gray-900/90 to-purple-900/80"></div>

                <div className="relative max-w-5xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 animate-gradient">
                            YouTube Content Showcase
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                    >
                        Engaging stories that connect, inspire, and leave a lasting impact through visual storytelling.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link
                            href="#youtube"
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-red-500/30 inline-flex"
                        >
                            <FiYoutube className="text-xl" /> YouTube Videos ({youtubeCount})
                        </Link>
                    </motion.div>
                </div>
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        rotate: [0, 10, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-20 left-10 w-16 h-16 rounded-full bg-pink-600/20 blur-xl"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                        rotate: [0, -10, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-purple-600/20 blur-xl"
                />
            </header>


            {/* YouTube Videos Section - 3x3 Grid */}
            <section id="youtube" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {currentVideos.map(video => {
                        const youtubeId = getYoutubeId(video.link);
                        if (!youtubeId) return null;

                        return (
                            <motion.div
                                key={video._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="group relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-red-500/20"
                                onClick={() => handleVideoClick(video)}
                            >
                                {/* Video thumbnail and details */}
                                <div className="relative aspect-video">
                                    <Image
                                        src={getYoutubeThumbnail(video.link)}
                                        alt={video.title}
                                        width={640}
                                        height={360}
                                        className="w-full h-full object-cover rounded-t-2xl"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent group-hover:from-red-600/50 group-hover:to-pink-600/50 transition-all duration-300" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                                            <FiPlay className="text-xl ml-1 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col space-y-4">
                                    <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-2">
                                        {video.description}
                                    </p>
                                    <div className="flex justify-between items-center text-sm text-gray-400">
                                        <span>{new Date(video.date).toLocaleDateString()}</span>
                                        <span className="text-red-500 font-medium flex items-center">
                                            YouTube <FiYoutube className="ml-1" />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-2">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="p-2 bg-gray-800 rounded-full disabled:opacity-50 hover:bg-gray-700 transition-colors"
                            aria-label="Previous page"
                        >
                            <FiChevronLeft className="text-xl" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === number ? 'bg-red-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-gray-800 rounded-full disabled:opacity-50 hover:bg-gray-700 transition-colors"
                            aria-label="Next page"
                        >
                            <FiChevronRight className="text-xl" />
                        </button>
                    </div>
                )}
            </section>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div
                        ref={modalRef}
                        className="relative w-full max-w-4xl bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
                    >
                        <button
                            onClick={() => {
                                setSelectedVideo(null);
                                setIsLoading(false);
                            }}
                            className="absolute top-4 right-4 z-20 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-all hover:scale-110"
                            aria-label="Close video modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        )}

                        <div className="aspect-video w-full">
                            <iframe
                                src={selectedVideo.embedUrl}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => setIsLoading(false)}
                                referrerPolicy="strict-origin-when-cross-origin"
                                key={selectedVideo.embedUrl}
                            />
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 text-white">{selectedVideo.title}</h3>
                            <div className="flex items-center mb-4">
                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-600">
                                    YouTube
                                </span>
                                <span className="text-gray-400 ml-4 text-sm">
                                    {new Date(selectedVideo.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-300">{selectedVideo.description}</p>
                            <Link
                                href={selectedVideo.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
                            >
                                Watch on YouTube <FiArrowRight className="ml-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}