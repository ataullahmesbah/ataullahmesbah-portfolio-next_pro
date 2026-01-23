// app/components/Travel/GalleryPage.jsx - UPDATED
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function GalleryPage({ gallery = [] }) {
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Extract unique categories
    const categories = ['All', ...new Set(gallery.map(item => item.category).filter(Boolean))];

    // Filter gallery based on selected category
    const filteredGallery = selectedCategory === 'All'
        ? gallery
        : gallery.filter(item => item.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Gallery Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Photo Gallery</h1>
                    <div className="w-20 h-1 bg-green-600 mx-auto mb-6"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        All images optimized at 1200×628px for best display
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid - FIXED 1200x628 display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGallery.map((photo) => (
                        <div
                            key={photo._id}
                            className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-all duration-300"
                        >
                            {/* Image Container with FIXED aspect ratio (1200:628 = 1.91:1) */}
                            <div className="relative h-64"> {/* Fixed height for 1200x628 ratio */}
                                <Image
                                    src={photo.imageUrl}
                                    alt={photo.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    quality={85}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">{photo.title}</h3>
                                <p className="text-gray-300 mb-4 line-clamp-2">
                                    {photo.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {photo.location}
                                    </span>
                                    <Link
                                        href={`/mesbahoffwego/${photo.slug}`}
                                        className="text-green-400 hover:text-green-300 font-medium text-sm"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Back Link */}
                <div className="text-center mt-16">
                    <Link
                        href="/mesbahoffwego"
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Travel Home
                    </Link>
                </div>
            </div>
        </div>
    );
}