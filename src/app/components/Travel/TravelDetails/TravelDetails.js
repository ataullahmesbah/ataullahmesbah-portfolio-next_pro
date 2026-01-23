// app/components/Travel/TravelDetails/TravelDetails.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HiCalendar, HiPhotograph, HiLightBulb } from "react-icons/hi";
import { HiMapPin } from "react-icons/hi2";
import { ShareButton } from "../../Share/Button/ShareButton/ShareButton";
import { LikeButton } from "../../Share/Button/LikeButton/LikeButton";


// Helper function to get optimized Cloudinary URL
const getOptimizedImageUrl = (originalUrl, options = {}) => {
    if (!originalUrl) return originalUrl;

    const {
        width = 2500,
        height = 1400,
        quality = 'auto:best',
        crop = 'limit',
        format = 'webp'
    } = options;

    if (originalUrl.includes('cloudinary.com')) {
        // Extract public_id from URL
        const urlParts = originalUrl.split('/upload/');
        if (urlParts.length === 2) {
            const [base, path] = urlParts;
            return `${base}/upload/c_${crop},w_${width},h_${height},q_${quality},f_${format}/${path}`;
        }
    }

    return originalUrl;
};

export default function TravelDetail({ travel, slug }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Get optimized image URLs
    const heroImageUrl = getOptimizedImageUrl(travel.imageUrl, {
        width: 2500,
        height: 1400,
        quality: 'auto:best',
        crop: 'limit'
    });

    const galleryImages = travel.gallery?.map((img, index) => ({
        original: img,
        optimized: getOptimizedImageUrl(img, {
            width: 800,
            height: 600,
            quality: 'auto:good',
            crop: 'fill'
        }),
        thumbnail: getOptimizedImageUrl(img, {
            width: 150,
            height: 100,
            quality: 'auto:eco',
            crop: 'fill'
        })
    })) || [];

    // Schema Markup for Article
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": travel.title,
        "description": travel.description?.slice(0, 160) || travel.title,
        "image": travel.imageUrl,
        "datePublished": new Date(travel.date || Date.now()).toISOString(),
        "author": {
            "@type": "Person",
            "name": "Ataullah Mesbah",
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mesbah Off We Go",
            "logo": {
                "@type": "ImageObject",
                "url": "https://ataullahmesbah.com/logo.png",
            },
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://ataullahmesbah.com/mesbahoffwego/${slug}`,
        },
        "keywords": [travel.title, travel.category, "travel", "Ataullah Mesbah"],
    };

    // Format date
    const formattedDate = travel.date
        ? new Date(travel.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Recently visited';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            {/* Hero Section with Image and Text Side by Side - PROFESSIONAL VERSION */}
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
                        {/* Left: Full Image Display - Clean without size text */}
                        <div className="order-2 lg:order-1">
                            {/* Main Image Container */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl 
                              bg-gray-900 border border-gray-800 group">
                                {/* Image with perfect 1200x628 ratio */}
                                <div className="relative w-full h-0 pb-[52.33%]">
                                    <Image
                                        src={travel.imageUrl}
                                        alt={travel.title}
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-700"
                                        quality={100}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        priority
                                    />
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>

                                {/* Category badge on image */}
                                <div className="absolute top-4 left-4">
                                    <div className="px-4 py-2 bg-black/80 backdrop-blur-sm rounded-full 
                                      border border-white/20 shadow-lg">
                                        <span className="text-green-400 font-medium text-sm tracking-wide">
                                            {travel.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Image Actions - Below Image (Professional Style) */}
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                {/* Like Button */}
                                <button className="group flex flex-col items-center justify-center gap-2 
                                     p-4 bg-gray-800/50 hover:bg-gray-800 
                                     rounded-xl border border-gray-700 hover:border-gray-600
                                     transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center
                                     group-hover:bg-red-500/10 transition-colors">
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 
                                         transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-300 text-xs font-medium group-hover:text-white">
                                        Like
                                    </span>
                                </button>

                                {/* Share Button */}
                                <button className="group flex flex-col items-center justify-center gap-2 
                                     p-4 bg-gray-800/50 hover:bg-gray-800 
                                     rounded-xl border border-gray-700 hover:border-gray-600
                                     transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center
                                     group-hover:bg-blue-500/10 transition-colors">
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 
                                         transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-300 text-xs font-medium group-hover:text-white">
                                        Share
                                    </span>
                                </button>

                                {/* Copy Link Button */}
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        // Show toast notification
                                        alert('Link copied to clipboard!');
                                    }}
                                    className="group flex flex-col items-center justify-center gap-2 
                                 p-4 bg-gray-800/50 hover:bg-gray-800 
                                 rounded-xl border border-gray-700 hover:border-gray-600
                                 transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center
                                     group-hover:bg-green-500/10 transition-colors">
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 
                                         transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-300 text-xs font-medium group-hover:text-white">
                                        Copy Link
                                    </span>
                                </button>


                            </div>
                        </div>

                        {/* Right: Content - Improved Design */}
                        <div className="order-1 lg:order-2 lg:pl-4 xl:pl-6">
                            {/* Title with gradient */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold 
                             text-white mb-4 md:mb-6 leading-tight
                             bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                                {travel.title}
                            </h1>

                            {/* Meta Info Cards - Enhanced */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 md:mb-8">
                                {/* Location Card */}
                                <div className="group bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 
                                  border border-gray-700 hover:border-green-500/30
                                  transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br 
                                         from-green-500/20 to-emerald-500/20 
                                         flex items-center justify-center
                                         group-hover:from-green-500/30 group-hover:to-emerald-500/30
                                         transition-all">
                                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                                                Location
                                            </p>
                                            <p className="text-white font-medium text-base">
                                                {travel.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Date Card */}
                                <div className="group bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 
                                  border border-gray-700 hover:border-blue-500/30
                                  transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br 
                                         from-blue-500/20 to-cyan-500/20 
                                         flex items-center justify-center
                                         group-hover:from-blue-500/30 group-hover:to-cyan-500/30
                                         transition-all">
                                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                                                Visit Date
                                            </p>
                                            <p className="text-white font-medium text-base">
                                                {formattedDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Card (if needed) */}
                                {travel.category && (
                                    <div className="group bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 
                                      border border-gray-700 hover:border-purple-500/30
                                      transition-all duration-300 transform hover:-translate-y-1
                                      sm:col-span-2">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br 
                                             from-purple-500/20 to-pink-500/20 
                                             flex items-center justify-center
                                             group-hover:from-purple-500/30 group-hover:to-pink-500/30
                                             transition-all">
                                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                                                    Category
                                                </p>
                                                <p className="text-gray-200 font-semibold text-base">
                                                    {travel.category}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description Section */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        About This Journey
                                    </h2>
                                </div>

                                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-gray-300 text-lg leading-relaxed">
                                            {travel.description || 'No description available.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Primary Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                                {/* Explore More Button */}
                                <button className="group flex items-center gap-3 px-6 py-3.5 
                                     bg-gradient-to-r from-green-600 to-emerald-600 
                                     hover:from-green-700 hover:to-emerald-700
                                     text-white font-semibold rounded-full 
                                     transition-all duration-300
                                     transform hover:-translate-y-1 hover:shadow-xl
                                     shadow-lg">
                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                    Explore More Photos
                                </button>

                                {/* Save to Bucket List */}
                                <button className="group flex items-center gap-3 px-6 py-3.5 
                                     bg-gray-800 hover:bg-gray-700 
                                     text-white font-semibold rounded-full 
                                     border border-gray-700 hover:border-gray-600
                                     transition-all duration-300">
                                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Save to Bucket List
                                </button>
                            </div>

                            {/* Social Share Section */}
                            <div className="mt-8 pt-8 border-t border-gray-800">
                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4">
                                    Share this journey
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Facebook', 'Twitter', 'LinkedIn', 'WhatsApp'].map((platform) => (
                                        <button
                                            key={platform}
                                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 
                                         rounded-lg text-gray-300 hover:text-white 
                                         text-sm font-medium transition-colors
                                         border border-gray-700 hover:border-gray-600"
                                        >
                                            {platform}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Back to Gallery Link */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
                <div className="border-t border-gray-800 pt-8">
                    <a
                        href={travel.category === 'Gallery' ? '/mesbahoffwego/gallery' : '/mesbahoffwego/historical'}
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors group"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to {travel.category === 'Gallery' ? 'Photo Gallery' : 'Historical Sites'}
                    </a>
                </div>
            </div>
        </div>
    );
}