'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import useAOS from '../../hooks/useAOS';
import { FaMailchimp, FaRocket, FaStar } from 'react-icons/fa';
import { FiPlay, FiArrowRight, FiUsers, FiTrendingUp, FiGlobe, FiBarChart2 } from 'react-icons/fi';

const LetterHero = () => {
    useAOS({ duration: 1000 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Main Hero Section */}
            <section className="relative py-16 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
                    />
                </div>

                <div className="relative max-w-7xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-12 lg:mb-16"
                    >
                        {/* Badge */}
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-3 bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 rounded-full px-6 py-3 mb-8"
                        >
                            <FaMailchimp className="text-purple-400 text-xl" />
                            <span className="text-gray-300 font-medium">Join 1500+ Happy Readers</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                        >
                            History Delivered{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                Weekly
                            </span>
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                        >
                            Transform your skills with expert-led insights on SEO, business growth, and captivating journeys through ancient civilizations.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                        >
                            {/* Primary Button */}
                            <Link
                                href="/contact"
                                className="group relative bg-gray-900/60 backdrop-blur-md border border-gray-600/30 text-white px-8 py-4 rounded-xl  flex items-center gap-3 transition-all duration-300 hover:bg-gray-800/80 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-400/20 overflow-hidden w-fit"
                            >
                                {/* Left Accent Bar */}
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-r-full group-hover:h-12 transition-all duration-300" />

                                {/* Hover Background Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Animated Play Icon */}
                                <motion.div
                                    animate={{ rotate: [0, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <FiPlay className="relative group-hover:scale-110 transition-transform duration-300" />
                                </motion.div>

                                <span className="relative">Join For $5/Month</span>

                                {/* Rocket Icon with Hover Animation */}
                                <FaRocket className="text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                            </Link>

                            {/* Secondary Button */}
                            <Link
                                href="/newsletter"
                                className="group relative bg-gray-800/50 backdrop-blur-md border border-gray-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 hover:bg-gray-700/60 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden"
                            >
                                {/* Left Accent Bar */}
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-full group-hover:from-purple-300 group-hover:to-purple-500 transition-all" />

                                {/* Hover Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <span className="relative">View Archives</span>
                                <FiArrowRight className="relative group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            variants={itemVariants}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
                        >
                            <div className="group relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm p-6 transition-all duration-500 hover:scale-105 hover:border-purple-500/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300">
                                        <FaMailchimp className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">50+</div>
                                        <div className="text-gray-400 text-sm">Quality Newsletters</div>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm p-6 transition-all duration-500 hover:scale-105 hover:border-blue-500/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                                        <FiUsers className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">1.5K+</div>
                                        <div className="text-gray-400 text-sm">Active Readers</div>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm p-6 transition-all duration-500 hover:scale-105 hover:border-yellow-500/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-300">
                                        <FaStar className="w-7 h-7 text-yellow-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">4.9</div>
                                        <div className="text-gray-400 text-sm">Star Rating</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Newsletter Preview Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-12 lg:mt-16"
                    >
                        {/* Left Content */}
                        <div className="space-y-6">
                            <h3 className="text-2xl lg:text-3xl font-bold text-white">
                                Inside Every Issue
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                                    <div className="bg-purple-500/20 p-2 rounded-lg flex-shrink-0">
                                        <FiTrendingUp className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-2">SEO & Digital Marketing</h4>
                                        <p className="text-gray-300 text-sm">Proven strategies to boost online visibility and dominate search rankings.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
                                    <div className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">
                                        <FiGlobe className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-2">Historical Explorations</h4>
                                        <p className="text-gray-300 text-sm">Captivating stories of ancient civilizations and legendary journeys.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300">
                                    <div className="bg-green-500/20 p-2 rounded-lg flex-shrink-0">
                                        <FiBarChart2 className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-2">Business Growth</h4>
                                        <p className="text-gray-300 text-sm">Actionable tips to scale your business and achieve sustainable success.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Images - Modern Layout */}
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="relative group"
                                >
                                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-gray-600/50">
                                        <Image
                                            src="/images/letter/nl1.jpg"
                                            alt="SEO Newsletter Preview"
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="relative group mt-8"
                                >
                                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-gray-600/50">
                                        <Image
                                            src="/images/letter/nl2.jpg"
                                            alt="Business Newsletter Preview"
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Decorative Element */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LetterHero;