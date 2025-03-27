
// src/app/newsletter/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiEye, FiArrowRight } from 'react-icons/fi';

const NewsLetterPage = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchNewsletters = async () => {
            try {
                const res = await fetch('/api/newsletter/letter');
                const data = await res.json();
                if (res.ok) {
                    setNewsletters(data);
                } else {
                    toast.error('Failed to fetch newsletters');
                }
            } catch (error) {
                toast.error('Error loading newsletters');
            } finally {
                setLoading(false);
            }
        };
        fetchNewsletters();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="m bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                        Latest Newsletters
                    </h1>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                    {newsletters.map((newsletter) => (
                        <div
                            key={newsletter._id}
                            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700"
                        >
                            {/* Image */}
                            <div className="relative h-56 sm:h-64 w-full">
                                <Image
                                    src={newsletter.mainImage}
                                    alt={newsletter.imageAlt}
                                    layout="fill"
                                    objectFit="cover"
                                    className="w-full h-full"
                                />
                            </div>


                            {/* Content */}
                            <div className="p-4 sm:p-5">
                                {/* Category Badge */}
                                <div className="mb-2">
                                    <span className="inline-block px-2 py-1 text-xs  bg-purple-500/10 border-purple-600/20 text-purple-300 rounded-full">
                                        {newsletter.category}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">
                                    {newsletter.title}
                                </h2>

                                {/* Meta Description */}
                                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                    {newsletter.metaDescription.length > 40
                                        ? `${newsletter.metaDescription.slice(0, 40)}...`
                                        : newsletter.metaDescription}
                                </p>

                                {/* Footer */}
                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                                    <div className="flex items-center text-sm text-gray-400">
                                        <FiEye className="mr-1" />
                                        <span>{newsletter.views}</span>
                                    </div>
                                    <Link
                                        href={`/letter/${newsletter.slug}`}
                                        className="flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        View Newsletter
                                        <FiArrowRight className="ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile floating action button */}
                <Link
                    href="/newsletter/add"
                    className="sm:hidden fixed bottom-6 right-6 z-10 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                >
                    <span className="text-2xl">+</span>
                </Link>
            </div>
        </div>
    );
};

export default NewsLetterPage;