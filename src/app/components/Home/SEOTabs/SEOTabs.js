'use client';


import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaSearch, FaCode, FaGlobe, FaShoppingCart, FaMapMarkerAlt, FaRobot } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';

const SEOTabs = () => {
    const [seoServices, setSeoServices] = useState([
        {
            id: 1,
            title: "Technical SEO",
            slug: "/seo/technical-seo",
            icon: <FaCode className="text-blue-400" />,
            description: "Core Web Vitals, site speed & architecture"
        },
        {
            id: 2,
            title: "GEO & SGE",
            slug: "/seo/geo-sge-optimization",
            icon: <FaRobot className="text-purple-400" />,
            description: "AI search optimization for Google SGE"
        },
        {
            id: 3,
            title: "E-commerce SEO",
            slug: "/seo/ecommerce-seo",
            icon: <FaShoppingCart className="text-green-400" />,
            description: "Product pages & online store optimization"
        },
        {
            id: 4,
            title: "Local SEO",
            slug: "/seo",
            icon: <FaMapMarkerAlt className="text-red-400" />,
            description: "Google Business Profile & local search"
        },
        {
            id: 5,
            title: "On-Page SEO",
            slug: "/seo",
            icon: <FaSearch className="text-yellow-400" />,
            description: "Content optimization & keyword strategy"
        },
        {
            id: 6,
            title: "International SEO",
            slug: "/seo",
            icon: <FaGlobe className="text-cyan-400" />,
            description: "Multi-language & global targeting"
        }
    ]);

    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center"
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">SEO Services</span>
                </h1>
                <p className="text-gray-300 max-w-xl mx-auto text-sm">
                    Professional SEO strategies to boost your rankings and drive qualified traffic
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mt-3 rounded-full mx-auto" />
            </motion.div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Services Tabs - 2 columns */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {seoServices.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -2, scale: 1.02 }}
                            className="group"
                        >
                            <Link href={service.slug} passHref>
                                <div className="bg-gray-800/50 hover:bg-gray-700/60 border border-gray-700 hover:border-purple-400/40 rounded-xl p-4 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                                            {service.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-white mb-1 flex items-center justify-between">
                                                {service.title}
                                                <FaArrowRight className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1" size={12} />
                                            </h3>
                                            <p className="text-gray-400 text-xs leading-relaxed">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Why Choose Me Section - Compact */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-gray-700 rounded-xl p-5 shadow-lg backdrop-blur-sm"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FaCheckCircle className="text-purple-400" />
                        Why Choose Me?
                    </h3>
                    <ul className="space-y-3">
                        {[
                            "Custom SEO strategies for your goals",
                            "Proven track record of top rankings",
                            "White-hat techniques only",
                            "Transparent reporting",
                            "Data-driven optimization",
                            "Fast results & ongoing support"
                        ].map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                className="flex items-start text-gray-300 text-sm"
                            >
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Quick CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="mt-4 pt-4 border-t border-gray-700"
                    >
                        <Link href="/contact" passHref>
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer">
                                Start SEO Project
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
};

export default SEOTabs;