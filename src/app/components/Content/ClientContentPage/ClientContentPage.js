"use client";

import Link from "next/link";
import { useState } from "react";

export default function ClientContentCreation({ youtubeVideos, facebookVideos, content }) {
    const [selectedVideo, setSelectedVideo] = useState(null);

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Content Creation by Ataullah Mesbah",
        "description": "A curated collection of videos by Ataullah Mesbah.",
        "url": "https://ataullahmesbah.com/content-creation",
        "itemListElement": content.map((video, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": video.link,
            "name": video.title,
        })),
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

            {/* Hero Header */}
            <header className="relative py-20 px-6 text-center bg-gradient-to-r from-blue-900 via-gray-900 to-gray-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-50"></div>
                <h1 className="relative text-5xl md:text-6xl font-extrabold tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                        Content Creation
                    </span>
                    <span className="block text-gray-300 mt-2">by Ataullah Mesbah</span>
                </h1>
                <p className="relative text-lg md:text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
                    Crafting stories that inspire, entertain, and connect—explore my journey on YouTube and Facebook.
                </p>
                <div className="mt-8">
                    <Link href="#videos" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300">
                        Explore My Videos
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </header>

            {/* YouTube Videos Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
                    YouTube Creations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {youtubeVideos.map(video => {
                        const videoId = video.link.match(/(?:v=)([^&]+)/)?.[1] || video.link.split('/').pop();
                        return (
                            <div
                                key={video._id}
                                className="group relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer"
                                onClick={() => setSelectedVideo({ ...video, embedUrl: `https://www.youtube.com/embed/${videoId}` })}
                            >
                                <div className="relative">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title={video.title}
                                        className="w-full h-56 rounded-t-2xl pointer-events-none"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-pink-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-white group-hover:text-pink-400 transition-colors">{video.title}</h3>
                                    <p className="text-gray-400 mt-2 line-clamp-2">{video.description}</p>
                                    <Link
                                        href={video.link}
                                        target="_blank"
                                        className="mt-4 inline-flex items-center text-red-500 hover:text-red-400 font-medium transition-colors"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        Watch on YouTube
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Facebook Videos Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto bg-gray-850">
                <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    Facebook Creations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {facebookVideos.map(video => {
                        const fbLink = encodeURIComponent(video.link);
                        return (
                            <div
                                key={video._id}
                                className="group relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer"
                                onClick={() => setSelectedVideo({ ...video, embedUrl: `https://www.facebook.com/plugins/video.php?href=${fbLink}&show_text=false` })}
                            >
                                <div className="relative">
                                    <iframe
                                        src={`https://www.facebook.com/plugins/video.php?href=${fbLink}&show_text=false`}
                                        title={video.title}
                                        className="w-full h-56 rounded-t-2xl pointer-events-none"
                                        frameBorder="0"
                                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                                        allowFullScreen
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-pink-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">{video.title}</h3>
                                    <p className="text-gray-400 mt-2 line-clamp-2">{video.description}</p>
                                    <Link
                                        href={video.link}
                                        target="_blank"
                                        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500 font-medium transition-colors"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        Watch on Facebook
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Behind the Scenes Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto bg-gray-900">
                <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                    Behind the Scenes
                </h2>
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-gray-300 text-lg mb-6">
                        A look into how I bring my ideas to life through video.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-pink-400">Planning</h3>
                            <p className="text-gray-400 mt-2">Brainstorming ideas that captivate.</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-pink-400">Shooting</h3>
                            <p className="text-gray-400 mt-2">Capturing every moment with care.</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-pink-400">Editing</h3>
                            <p className="text-gray-400 mt-2">Crafting the final story.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What Inspires Me Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto bg-gray-850">
                <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                    What Inspires Me
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-semibold text-pink-400 mb-4">Adventure</h3>
                        <p className="text-gray-300">
                            Exploring the world inspires my storytelling.
                        </p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-semibold text-pink-400 mb-4">Connection</h3>
                        <p className="text-gray-300">
                            Engaging with my audience keeps me motivated.
                        </p>
                    </div>
                </div>
            </section>

            {/* Join My Journey Section */}
            <section className="py-20 px-6 text-center bg-gray-900">
                <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                    Join My Creative Journey
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                    Follow me on YouTube and Facebook for more exciting content!
                </p>
                <div className="flex justify-center gap-6">
                    <Link href="https://youtube.com/@yourchannel" target="_blank" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all duration-300">
                        Subscribe on YouTube
                    </Link>
                    <Link href="https://facebook.com/yourpage" target="_blank" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300">
                        Follow on Facebook
                    </Link>
                </div>
            </section>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedVideo(null)}>
                    <div className="bg-gray-800 rounded-xl p-4 max-w-4xl w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-white">{selectedVideo.title}</h3>
                            <button onClick={() => setSelectedVideo(null)} className="text-gray-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <iframe
                            src={selectedVideo.embedUrl}
                            title={selectedVideo.title}
                            className="w-full h-[50vh] rounded-lg"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <p className="text-gray-300 mt-4">{selectedVideo.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}