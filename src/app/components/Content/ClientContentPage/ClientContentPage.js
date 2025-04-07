"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FiYoutube, FiFacebook, FiArrowRight, FiPlay } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ClientContentCreation({ youtubeVideos, facebookVideos, youtubeCount, facebookCount }) {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const modalRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

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

    const handleVideoClick = (video) => {
        setIsLoading(true);
        setSelectedVideo({
            ...video,
            embedUrl: video.platform === "YouTube"
                ? `https://www.youtube.com/embed/${getYoutubeId(video.link)}?autoplay=1&rel=0`
                : `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.link)}&show_text=false&autoplay=1&width=800`
        });
    };

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
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden border-b border-gray-800">
            {/* Enhanced Hero Header */}
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
                            Video Content Showcase
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
                        className="flex flex-col sm:flex-row flex-wrap justify-center gap-4"
                    >
                        <Link
                            href="#youtube"
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-red-500/30"
                        >
                            <FiYoutube className="text-xl" /> YouTube Videos ({youtubeCount})
                        </Link>
                        <Link
                            href="#facebook"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30"
                        >
                            <FiFacebook className="text-xl" /> Facebook Videos ({facebookCount})
                        </Link>
                    </motion.div>
                </div>

                {/* Animated decorative elements */}
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        rotate: [0, 10, 0]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-20 left-10 w-16 h-16 rounded-full bg-pink-600/20 blur-xl"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                        rotate: [0, -10, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-purple-600/20 blur-xl"
                />
            </header>

            {/* YouTube Videos Section */}
            <section id="youtube" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
                        <span className="flex items-center gap-2">
                            <FiYoutube className="text-red-600" /> YouTube Creations
                        </span>
                    </h2>
                    <Link
                        href="/content-creation/youtube"
                        className="flex items-center text-gray-300 hover:text-white mt-4 md:mt-0 group"
                    >
                        View all {youtubeCount} videos <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {youtubeVideos.map(video => (
                        <motion.div
                            key={video._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="group relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-red-500/20"
                            onClick={() => handleVideoClick(video)}
                        >
                            <div className="relative aspect-video">
                                <Image
                                    src={getYoutubeThumbnail(video.link)}
                                    alt={video.title}
                                    width={640}
                                    height={360}
                                    className="w-full h-full object-cover rounded-t-2xl"
                                    onError={(e) => (e.target.src = "/images/youtube-placeholder.jpg")}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent group-hover:bg-gradient-to-t group-hover:from-red-600/50 group-hover:to-pink-600/50 transition-all duration-300"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                                        <FiPlay className="text-xl ml-1 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col space-y-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2">{video.title}</h3>
                                <p className="text-gray-400 mt-2 text-sm line-clamp-2">{video.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-400 mt-0 mb-0">
                                    <span>{new Date(video.date).toLocaleDateString()}</span>
                                    <span className="text-red-500 font-medium flex items-center">
                                        YouTube <FiYoutube className="ml-1" />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Facebook Videos Section */}
            <section id="facebook" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto bg-gray-850 rounded-3xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">
                        <span className="flex items-center gap-2">
                            <FiFacebook className="text-blue-600" /> Facebook Creations
                        </span>
                    </h2>
                    <Link
                        href="/content-creation/facebook"
                        className="flex items-center text-gray-300 hover:text-white mt-4 md:mt-0 group"
                    >
                        View all {facebookCount} videos <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {facebookVideos.map(video => (
                        <motion.div
                            key={video._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="group relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-blue-500/20"
                            onClick={() => handleVideoClick(video)}
                        >
                            <div className="relative aspect-video bg-gray-700">
                                <Image
                                    src="/images/facebook-placeholder.jpg"
                                    alt={video.title}
                                    width={640}
                                    height={360}
                                    className="w-full h-full object-cover rounded-t-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent group-hover:bg-gradient-to-t group-hover:from-blue-600/50 group-hover:to-indigo-600/50 transition-all duration-300"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                                        <FiPlay className="text-xl ml-1 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col h-40">
                                <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">{video.title}</h3>
                                <p className="text-gray-400 mt-2 text-sm line-clamp-2">{video.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-400 mt-auto">
                                    <span>{new Date(video.date).toLocaleDateString()}</span>
                                    <span className="text-blue-500 font-medium flex items-center">
                                        Facebook <FiFacebook className="ml-1" />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Content Section */}
            <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                    Featured Videos
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {[...youtubeVideos, ...facebookVideos]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 3)
                        .map((video, index) => {
                            const isYouTube = video.platform === "YouTube";
                            return (
                                <motion.div
                                    key={video._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-purple-500/20"
                                    onClick={() => handleVideoClick(video)}
                                >
                                    <div className="relative aspect-video">
                                        <Image
                                            src={isYouTube ? getYoutubeThumbnail(video.link) : "/images/facebook-placeholder.jpg"}
                                            alt={video.title}
                                            width={800}
                                            height={450}
                                            className="w-full h-full object-cover rounded-t-2xl"
                                            onError={(e) => (e.target.src = isYouTube ? "/images/youtube-placeholder.jpg" : "/images/facebook-placeholder.jpg")}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent group-hover:bg-gradient-to-t group-hover:from-purple-600/50 group-hover:to-pink-600/50 transition-all duration-300"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className={`w-20 h-20 ${isYouTube ? "bg-red-600" : "bg-blue-600"} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110`}>
                                                <FiPlay className="text-2xl ml-1 text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-black/70 px-2 py-1 rounded-md text-sm font-medium">
                                            {isYouTube ? "YouTube" : "Facebook"}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col h-48">
                                        <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">{video.title}</h3>
                                        <p className="text-gray-400 mt-2 line-clamp-3">{video.description}</p>
                                        <div className="flex justify-between items-center text-sm text-gray-400 mt-auto">
                                            <span>{new Date(video.date).toLocaleDateString()}</span>
                                            <span className={`${isYouTube ? "text-red-500" : "text-blue-500"} font-medium flex items-center`}>
                                                {isYouTube ? (
                                                    <>
                                                        <FiYoutube className="mr-1" /> YouTube
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiFacebook className="mr-1" /> Facebook
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                </div>
            </section>

            {/* Enhanced Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div
                        ref={modalRef}
                        className="relative w-full max-w-4xl bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
                    >
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-4 right-4 z-10 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-all hover:scale-110"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
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
                            />
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 text-white">{selectedVideo.title}</h3>
                            <div className="flex items-center mb-4">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${selectedVideo.platform === "YouTube" ? "bg-red-600" : "bg-blue-600"}`}>
                                    {selectedVideo.platform}
                                </span>
                                <span className="text-gray-400 ml-4 text-sm">
                                    {new Date(selectedVideo.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-300">{selectedVideo.description}</p>
                            <Link
                                href={selectedVideo.link}
                                target="_blank"
                                className="mt-4 inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
                            >
                                Watch on {selectedVideo.platform} <FiArrowRight className="ml-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}