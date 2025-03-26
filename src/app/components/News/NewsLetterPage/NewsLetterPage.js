// src/app/newsletter/page.js

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Newsletters | Ataullah Mesbah',
    description: 'Explore the latest newsletters by Ataullah Mesbah, covering various topics and insights.',
};

const NewsLetterPage = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsletters = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/newsletter/letter');
                const data = await res.json();
                setNewsletters(data);
            } catch (error) {
                console.error('Error fetching newsletters:', error);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6 md:p-10">
            <h1 className="text-4xl font-normal tracking-tight text-shadow-md mb-10 text-center">
                Newsletters
            </h1>

            {newsletters.length === 0 ? (
                <p className="text-center text-gray-400 text-lg">No newsletters found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsletters.map((newsletter) => (
                        <Link href={`/newsletter/${newsletter.slug}`} key={newsletter._id}>
                            <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <Image
                                    src={newsletter.mainImage}
                                    alt={newsletter.title}
                                    width={400}
                                    height={200}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h2 className="text-2xl font-normal text-gray-100 mb-2">{newsletter.title}</h2>
                                <p className="text-gray-400 line-clamp-3">{newsletter.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-sm text-gray-500">{newsletter.category}</span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(newsletter.publishDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsLetterPage;