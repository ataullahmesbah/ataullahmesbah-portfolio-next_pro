'use client';

import ContactAssistance from "@/app/components/Share/ConatctAssistance/ContactAssistance";
import SEOCaseStudyModal from "@/app/components/Share/EcommerceCaseStudyModal/SEOCaseStudyModal/SEOCaseStudyModal";
import SEOAuditForm from "@/app/components/Share/SEOAuditForm/SEOAuditForm";
import SEOFAQSection from "@/app/components/Share/SEOFaqSection/SEOFaqSection";
import SEOPackage from "@/app/Dashboard/Services/SEOPackages/SEOPackages";
import SEOService from "@/app/Dashboard/Services/SEOService/SEOService";
import SEOTools from "@/app/Dashboard/Services/SEOTools/SEOTools";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { FiArrowRight, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import seoImg from "/public/images/seo/seo.webp"

const SearchEngineService = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Loading complete korar jonno useEffect add koro
    useEffect(() => {
        // Simulate loading completion
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // 2 seconds loading

        return () => clearTimeout(timer);
    }, []);


    // Loading state check koro
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
                            Preparing AI Search Optimization
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Loading SEO strategies...
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



    return (
        <section className="min-h-screen border-b border-b-gray-800 poppins-regular"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}>

            {/* Case Study Modal */}
            <SEOCaseStudyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Hero Section */}
            <div className="relative py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-300">SEO Expert & AI Search Specialist</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            SEO Services That{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
                                Drive Real Growth
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Comprehensive SEO solutions from technical optimization to AI search readiness.
                            Boost your rankings, drive qualified traffic, and increase revenue with data-driven strategies.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            {/* Primary Button - Get Audit */}
                            <Link
                                href="/contact"
                                className="group relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                <div className="absolute inset-[1px] rounded-xl bg-gray-900 -z-10 group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:via-purple-900 group-hover:to-gray-800 transition-all"></div>
                                <span className="relative">Get Free SEO Audit</span>
                                <FiArrowRight className="relative group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" />
                            </Link>

                            {/* Secondary Button - View Case Studies */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group relative bg-gray-900/50 backdrop-blur-md border border-gray-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 hover:bg-gray-800/70 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-full group-hover:from-purple-300 group-hover:to-purple-500 transition-all"></div>
                                <FiBarChart2 className="relative group-hover:scale-110 transition-transform" />
                                <span className="relative ml-2">View Case Studies</span>
                            </button>
                        </div>



                        {/* Quick Navigation to Subpages */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            <Link
                                href="/seo/technical-seo"
                                className="group relative bg-gray-800/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-600/20 hover:shadow-lg hover:shadow-purple-500/10"
                            >
                                <span className="relative z-10">Technical SEO</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 rounded-lg group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 -z-10"></div>
                            </Link>

                            <Link
                                href="/seo/ecommerce-seo"
                                className="group relative bg-gray-800/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-600/20 hover:shadow-lg hover:shadow-purple-500/10"
                            >
                                <span className="relative z-10">Ecommerce SEO</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 rounded-lg group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 -z-10"></div>
                            </Link>

                            <Link
                                href="/seo/geo-sge-optimization"
                                className="group relative bg-gray-800/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-600/20 hover:shadow-lg hover:shadow-purple-500/10"
                            >
                                <span className="relative z-10">GEO & SGE</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 rounded-lg group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 -z-10"></div>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 text-center hover:border-purple-500/50 transition-all duration-300">
                                <div className="text-2xl font-bold text-white mb-1">50+</div>
                                <div className="text-gray-400 text-sm">Clients Served</div>
                            </div>
                            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 text-center hover:border-pink-500/50 transition-all duration-300">
                                <div className="text-2xl font-bold text-white mb-1">40%</div>
                                <div className="text-gray-400 text-sm">Avg. Growth</div>
                            </div>
                            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 text-center hover:border-red-500/50 transition-all duration-300">
                                <div className="text-2xl font-bold text-white mb-1">AI</div>
                                <div className="text-gray-400 text-sm">Search Expert</div>
                            </div>
                            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 text-center hover:border-blue-500/50 transition-all duration-300">
                                <div className="text-2xl font-bold text-white mb-1">100%</div>
                                <div className="text-gray-400 text-sm">Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Audit */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center py-8 px-4 lg:px-8">
                {/* Left Text Side */}
                <div className="w-full justify-center space-y-6 text-center">
                    <SEOAuditForm />
                </div>

                {/* Right Image Side */}
                <div className="w-full flex justify-center mt-8 lg:mt-0">
                    <Image
                        src={seoImg}
                        alt="Global SEO Services - Technical SEO and AI Optimization"
                        width={500}
                        height={500}
                        className="rounded-lg max-w-full h-auto"
                    />
                </div>
            </div>

            {/* SEO Tools */}
            <SEOTools />

            {/* SEO Services */}
            <div>
                <SEOService />
            </div>

            {/* SEO Packages */}
            <div>
                <SEOPackage />
            </div>

            {/* SEO FAQ Section */}
            <SEOFAQSection />

            {/* Contact Assistance */}
            <div>
                <ContactAssistance />
            </div>
        </section>
    );
};

export default SearchEngineService;