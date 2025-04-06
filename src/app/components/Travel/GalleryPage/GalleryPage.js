// app/components/Travel/GalleryPage.jsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function GalleryPage({ gallery = [] }) {
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Extract unique categories from gallery items
    const categories = ['All', ...new Set(gallery.map(item => item.tags).flat())];

    // Filter gallery based on selected category
    const filteredGallery = selectedCategory === 'All'
        ? gallery
        : gallery.filter(item => item.tags?.includes(selectedCategory));

    return (
        <div className="min-h-screen bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Gallery Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Photo Gallery</h1>
                    <div className="w-20 h-1 bg-green-600 mx-auto mb-6"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A visual journey through my adventures around the world
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

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredGallery.map((photo) => (
                        <div
                            key={photo._id}
                            className="group relative aspect-square overflow-hidden rounded-xl shadow-lg"
                        >
                            <Image
                                src={photo.imageUrl}
                                alt={photo.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <h3 className="text-white font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {photo.title}
                                </h3>
                                <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {photo.location}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {photo.tags?.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 bg-gray-900/80 text-gray-300 rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
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