// app/components/Travel/Travel.jsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MesbahOffWeGo({ travels = [] }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Data processing
    const journey = travels.find(t => t.category === 'Journey') || {};
    const historicalSites = travels
        .filter(t => t.category === 'Historical')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);
    const gallery = travels
        .filter(t => t.category === 'Gallery')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

    if (!isMounted) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                {/* Short & Simple Loader */}
                <div className="text-center">
                    {/* Animated Logo/Text */}
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-green-500 animate-pulse">
                            Mesbah Off We Go
                        </h2>
                    </div>

                    {/* Simple Spinner */}
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

                    {/* Loading Text */}
                    <p className="text-gray-400 mt-3 text-sm">Loading adventures...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 text-white py-8">
            {/* Header Section - Professional Redesign */}
            <section className="relative py-20 px-6 overflow-hidden max-w-7xl mx-auto">
                {/* Decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>
                </div>

                <div className="relative z-10 text-center">
                    <span className="inline-block px-4 py-2 mb-6 text-sm font-medium tracking-widest text-green-500 uppercase bg-green-500/10 rounded-full">
                        Global Explorations
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        Mesbah <span className="text-green-500">Off We Go</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Journey through captivating historical sites and breathtaking landscapes from my global adventures
                    </p>

                    {/* Animated scroll indicator */}
                    <div className="mt-12">
                        <div className="animate-bounce w-6 h-10 border-2 border-gray-500 rounded-full mx-auto flex justify-center">
                            <div className="w-1 h-2 bg-gray-400 rounded-full mt-2"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey Section - Professional Redesign */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-px bg-green-500"></div>
                            <span className="text-sm font-medium tracking-widest text-green-500 uppercase">The Journey</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {journey.title || 'My Travel Philosophy'}
                        </h2>
                        <div className="prose prose-invert max-w-none">
                            {journey.description?.split('\n').map((paragraph, i) => (
                                <p key={i} className="text-lg text-gray-300 mb-4 leading-relaxed">
                                    {paragraph}
                                </p>
                            )) || (
                                    <>
                                        <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                                            Exploring the world has taught me that true discovery lies not just in seeing new places, but in experiencing them with an open heart and curious mind.
                                        </p>
                                        <p className="text-lg text-gray-300 leading-relaxed">
                                            Each journey reveals not only the beauty of our planet but also the shared humanity that connects us all.
                                        </p>
                                    </>
                                )}
                        </div>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href={`/mesbahoffwego/${journey.slug}`}
                                className="px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all flex items-center gap-2"
                            >
                                Explore My Journeys
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </Link>
                            <Link
                                href="/mesbahoffwego/gallery"
                                className="px-8 py-3.5 border border-gray-700 hover:border-green-500 text-gray-300 hover:text-white font-medium rounded-full transition-all"
                            >
                                View Photo Gallery
                            </Link>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 relative h-80 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src={journey.imageUrl || '/images/travel/default-journey.jpg'}
                            alt={journey.title || 'Travel Journey'}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg">
                                <h3 className="text-white font-medium">{journey.location || 'Various Locations'}</h3>
                                <p className="text-gray-400 text-sm">
                                    {journey.date ? new Date(journey.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Ongoing Journey'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Historical Sites Section */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Historical Travel Sites</h2>
                    <div className="w-20 h-1 bg-green-600 mx-auto"></div>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        Explore these magnificent historical sites I have visited
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {historicalSites
                        .filter(site => site.category === 'Historical')
                        .slice(0, 6)
                        .map(site => (
                            <div key={site._id} className="bg-gray-700 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                {/* Card content remains the same */}

                                <div className="relative h-60">
                                    <Image
                                        src={site.imageUrl}
                                        alt={site.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                    <span className="absolute top-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm">
                                        {site.location}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{site.title}</h3>
                                    <p className="text-gray-300 mb-4 line-clamp-3">
                                        {site.description}
                                    </p>
                                    <Link
                                        href={`/mesbahoffwego/${site.slug}`}
                                        className="inline-flex items-center text-green-400 hover:text-green-300 font-medium"
                                    >
                                        Discover More
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </Link>
                                </div>

                            </div>
                        ))
                    }
                </div>

                {historicalSites.filter(site => site.category === 'Historical').length > 5 && (
                    <div className="text-center mt-12">
                        <Link
                            href="/mesbahoffwego/historical"
                            className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all group"
                        >
                            View All Historical Sites ({historicalSites.filter(site => site.category === 'Historical').length})
                            <svg className="w-4 h-4 ml-2 text-green-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </Link>
                    </div>
                )}
            </section>


            {/* Gallery Section */}

            {/* Gallery Preview Section (Showing 8 Images) */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Travel Gallery</h2>
                    <div className="w-20 h-1 bg-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A glimpse into my visual travel diary
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {gallery.slice(0, 8).map((photo) => (


                        <Link
                            key={photo._id}
                            href={`/mesbahoffwego/${photo.slug}`}
                            className="group relative aspect-square overflow-hidden rounded-xl shadow-lg"
                        >
                            <Image
                                src={photo.imageUrl}
                                alt={photo.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {photo.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/mesbahoffwego/gallery"
                        className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all group"
                    >
                        View Full Gallery ({gallery.length} Photos)
                        <svg className="w-4 h-4 ml-2 text-green-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Tips Section */}
            {/* Travel Tips Section - Professional Redesign */}
            <section className="py-16 px-6 max-w-7xl mx-auto bg-gray-900/50 rounded-xl border border-gray-700">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Essential Travel Wisdom</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Handpicked insights from my journeys to enhance your travel experiences
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Tip 1 */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all group">
                        <div className="w-12 h-12 bg-green-600/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                            <svg className="w-6 h-6 text-green-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Cultural Preparation</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>Research local customs before visiting</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>Learn basic greetings in the local language</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>Understand appropriate dress codes</span>
                            </li>
                        </ul>
                    </div>

                    {/* Tip 2 */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all group">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                            <svg className="w-6 h-6 text-blue-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Document Safety</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">✓</span>
                                <span>Keep digital copies of important documents</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">✓</span>
                                <span>Use a secure travel document organizer</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">✓</span>
                                <span>Email copies to yourself as backup</span>
                            </li>
                        </ul>
                    </div>

                    {/* Tip 3 */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-yellow-500 transition-all group">
                        <div className="w-12 h-12 bg-yellow-600/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors">
                            <svg className="w-6 h-6 text-yellow-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Time Management</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-500 mt-1">✓</span>
                                <span>Always add buffer time between connections</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-500 mt-1">✓</span>
                                <span>Research time zones and jet lag tips</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-500 mt-1">✓</span>
                                <span>Plan for seasonal weather variations</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}