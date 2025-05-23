'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SEOPackage = () => {
    const [packagesData, setPackagesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/services/seopack', { cache: 'no-store' });
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setPackagesData(data);
            } catch (error) {
                console.error('Error fetching packages data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] bg-gray-900 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-48 bg-gray-800 rounded mb-4"></div>
                    <div className="flex space-x-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-80 w-72 bg-gray-800 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="pb-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    
                     <h1 className="text-3xl text-gray-100 mb-4">
                    Search Engine Optimization (SEO) Packages
                </h1>
                   
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {packagesData.map((pkg) => (
                        <motion.div
                            key={pkg._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="relative flex flex-col h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group"
                        >
                            {/* Popular badge */}
                            {pkg.popular && (
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="p-8 flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">{pkg.name}</h2>
                                <p className="text-gray-300 mb-6">{pkg.description}</p>
                                
                                <ul className="space-y-3 mb-8">
                                    {pkg.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <FaCheckCircle className="text-purple-400 mt-1 mr-3 flex-shrink-0" />
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="px-8 pb-8">
                                <div className="flex items-end mb-6">
                                    <p className="text-3xl font-bold text-white mr-3">${pkg.discount.toLocaleString()}</p>
                                    {pkg.discount < pkg.price && (
                                        <p className="text-gray-400 line-through">${pkg.price.toLocaleString()}</p>
                                    )}
                                </div>

                                <Link 
                                    href="/contact" 
                                    className="
                                        w-full block text-center px-6 py-3 bg-gradient-to-r from-purple-900 to-blue-900 
                                        text-white font-medium rounded-lg hover:from-purple-800 hover:to-blue-700 
                                        transition-all duration-300 shadow-lg hover:shadow-purple-900/30
                                    "
                                >
                                    Get Started
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SEOPackage;