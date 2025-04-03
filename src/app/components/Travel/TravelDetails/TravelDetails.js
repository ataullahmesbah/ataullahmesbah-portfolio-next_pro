"use client";
import Image from "next/image";
import { HiMapPin, HiCalendar, HiTag } from "react-icons/hi2";
import { ShareButton } from "../../Share/Button/ShareButton/ShareButton";
import { LikeButton } from "../../Share/Button/LikeButton/LikeButton";


export default function TravelDetail({ travel, slug }) {
    // Schema Markup for Article
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": travel.title,
        "description": travel.description.slice(0, 160),
        "image": travel.imageUrl,
        "datePublished": new Date(travel.date).toISOString(),
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            {/* Hero Section */}
            <div className="relative h-[60vh] max-h-[800px] w-full">
                <Image
                    src={travel.imageUrl}
                    alt={travel.title}
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-blue-600/90 backdrop-blur-sm">
                            {travel.category}
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
                            {travel.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-300">
                            <span className="flex items-center gap-2">
                                <HiMapPin className="w-5 h-5" />
                                {travel.location}
                            </span>
                            <span className="flex items-center gap-2">
                                <HiCalendar className="w-5 h-5" />
                                {new Date(travel.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                <div className="prose prose-invert max-w-none">
                    <p className="text-xl leading-relaxed text-gray-300 mb-8">
                        {travel.description}
                    </p>

                    {/* Travel Highlights */}
                    {travel.highlights && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                Trip Highlights
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {travel.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="mt-1 flex-shrink-0 text-blue-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span className="text-gray-300">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Gallery Section */}
                    {travel.gallery && travel.gallery.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 text-blue-400">Gallery</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {travel.gallery.map((image, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                        <Image
                                            src={image}
                                            alt={`${travel.title} - Photo ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Travel Tips */}
                    {travel.tips && (
                        <div className="bg-gray-800/50 rounded-xl p-6 mb-12 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">Travel Tips</h2>
                            <div className="space-y-4">
                                {travel.tips.map((tip, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <span className="mt-1 flex-shrink-0 text-yellow-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <p className="text-gray-300">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-12">
                    <LikeButton travelId={travel.id} />
                    <ShareButton
                        title={travel.title}
                        url={`https://ataullahmesbah.com/mesbahoffwego/${slug}`}
                    />
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Save to Bucket List
                    </button>
                </div>
            </div>
        </div>
    );
}