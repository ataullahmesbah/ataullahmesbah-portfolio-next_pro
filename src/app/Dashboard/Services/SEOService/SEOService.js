'use client';

import { useEffect, useState } from 'react';
import SEOServiceDetails from '../SEOServiceDetails/SEOServiceDetails';
import { motion } from 'framer-motion';

// Cache data for better performance
let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds

const SEOService = () => {
    const [serviceSections, setServiceSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // Check cache first
            if (cachedData && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
                setServiceSections(cachedData);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const res = await fetch('/api/services/seo', {
                    next: { revalidate: 3600 }, // SSG revalidation
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

                const data = await res.json();

                // Process and cache data
                const groupedServices = data.map(section => ({
                    title: section.category,
                    services: section.services.map(service => ({
                        ...service,
                        image: service.image?.startsWith('/') 
                            ? `${window.location.origin}${service.image}`
                            : service.image
                    })),
                }));

                // Update cache
                cachedData = groupedServices;
                cacheTimestamp = Date.now();

                setServiceSections(groupedServices);
            } catch (error) {
                console.error('Failed to fetch services data:', error);
                setError(error.message);
                
                // Fallback to cache even if expired when there's an error
                if (cachedData) {
                    setServiceSections(cachedData);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Enhanced Loading Component
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center py-20">
                <div className="text-center">
                    {/* Animated Logo/Icon */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">SEO</span>
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-2 border-4 border-purple-500 border-t-transparent rounded-2xl"
                            />
                        </div>
                    </motion.div>

                    {/* Loading Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Loading SEO Services
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Preparing your optimization strategies...
                        </p>
                    </motion.div>

                    {/* Animated Dots */}
                    <motion.div className="flex justify-center gap-2">
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ 
                                    duration: 1.5, 
                                    repeat: Infinity, 
                                    delay: index * 0.2 
                                }}
                                className="w-2 h-2 bg-purple-500 rounded-full"
                            />
                        ))}
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="mt-6 h-1 bg-gray-700 rounded-full mx-auto max-w-xs overflow-hidden"
                    >
                        <motion.div
                            animate={{ 
                                x: ["-100%", "100%"] 
                            }}
                            transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-1/2"
                        />
                    </motion.div>
                </div>
            </div>
        );
    }

    // Error State
    if (error && serviceSections.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center py-20">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Unable to Load Services
                    </h3>
                    <p className="text-gray-400 mb-6">
                        {error || 'Please check your connection and try again.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Professional <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">SEO Services</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Comprehensive search engine optimization strategies tailored to boost your online visibility and drive sustainable growth.
                    </p>
                </motion.div>

                {serviceSections.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🔍</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-2">
                            No Services Available
                        </h3>
                        <p className="text-gray-400">
                            Please check back later for our SEO service offerings.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {serviceSections.map((section, index) => (
                            <SEOServiceDetails
                                key={section.title}
                                title={section.title}
                                services={section.services}
                                index={index}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Cache Status Indicator (for development) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="fixed bottom-4 right-4 bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">
                        {cachedData ? '🟢 Cached' : '🟡 Loading'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SEOService;