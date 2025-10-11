"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiEye, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const NewsLetter = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
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

    // Pagination calculations
    const totalPages = Math.ceil(newsletters.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNewsletters = newsletters.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Generate pagination items
    const getPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);

            if (currentPage <= 3) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            }

            if (startPage > 1) {
                items.push(1);
                if (startPage > 2) items.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                items.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) items.push('...');
                items.push(totalPages);
            }
        }

        return items;
    };

    // Schema Markup for Newsletters
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: newsletters.map((newsletter, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'NewsArticle',
                headline: newsletter.title,
                description: newsletter.metaDescription,
                image: newsletter.mainImage,
                url: `https://ataullahmesbah.com/newsletter/${newsletter.slug}`,
                author: { '@type': 'Person', name: newsletter.author || 'Ataullah Mesbah' },
                publisher: {
                    '@type': 'Organization',
                    name: 'Ataullah Mesbah',
                    logo: { '@type': 'ImageObject', url: 'https://ataullahmesbah.com/images/logo.png' },
                },
                datePublished: newsletter.publishedDate || new Date().toISOString(),
            },
        })),
    };

  if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 sm:py-16">
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-4 sm:mb-6"
                    >
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                                <span className="text-white text-lg sm:text-2xl font-bold">Letter</span>
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-2xl"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                            Unlocking New Content
                        </h3>
                        <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                            Loading Newsletter...
                        </p>
                    </motion.div>

                    <motion.div className="flex justify-center gap-1.5 sm:gap-2">
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: index * 0.2,
                                }}
                                className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-purple-500 rounded-full"
                            />
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="mt-4 sm:mt-6 h-1 bg-gray-700 rounded-full mx-auto max-w-[200px] sm:max-w-xs overflow-hidden"
                    >
                        <motion.div
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-1/2"
                        />
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                            Favourite Newsletter
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                        {currentNewsletters.map((newsletter) => (
                            <div
                                key={newsletter._id}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700"
                            >
                                {/* Image */}
                                <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[1200/630]">
                                    <Image
                                        src={newsletter.mainImage}
                                        alt={newsletter.imageAlt}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
                                        className="object-cover"
                                        priority={false}
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-4 sm:p-5">
                                    {/* Category Badge */}
                                    <div className="mb-2">
                                        <span className="inline-block px-2 py-1 text-xs bg-purple-500/10 border-purple-600/20 text-purple-300 rounded-full">
                                            {newsletter.category}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
                                        {newsletter.title}
                                    </h2>

                                    {/* Meta Description */}
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                        {newsletter.metaDescription.length > 40
                                            ? `${newsletter.metaDescription.slice(0, 160)}`
                                            : newsletter.metaDescription}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                                        <div className="flex items-center text-sm text-gray-400">
                                            <FiEye className="mr-1" />
                                            <span>{newsletter.views}</span>
                                        </div>

                                        <Link
                                            href={`/newsletter/${newsletter.slug}`}
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-md flex items-center gap-1 text-sm ${currentPage === 1
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-800 text-white hover:bg-gray-600'
                                    }`}
                            >
                                <FiChevronLeft />
                                Previous
                            </button>

                            {getPaginationItems().map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof item === 'number' && handlePageChange(item)}
                                    className={`px-4 py-2 rounded-md text-sm ${item === currentPage
                                        ? 'bg-purple-600 text-white'
                                        : item === '...'
                                            ? 'bg-gray-800 text-gray-400 cursor-default'
                                            : 'bg-gray-800 text-white hover:bg-gray-600'
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 rounded-md flex items-center gap-1 text-sm ${currentPage === totalPages
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-800 text-white hover:bg-gray-600'
                                    }`}
                            >
                                Next
                                <FiChevronRight />
                            </button>
                        </div>
                    )}

                    {/* Mobile floating action button */}
                    <Link
                        href="/newsletter/add"
                        className="sm:hidden fixed bottom-6 right-6 z-10 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                    >
                        <span className="text-2xl">+</span>
                    </Link>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </>
    );
};

export default NewsLetter;