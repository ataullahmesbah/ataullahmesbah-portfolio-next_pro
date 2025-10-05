'use client';

import { useEffect, useState } from 'react';
import { FiCheck, FiArrowRight, FiBarChart2, FiCode, FiZap, FiCpu, FiGlobe, FiSmartphone, FiSearch, FiServer, FiPlay } from 'react-icons/fi';
import Link from "next/link";
import ContactAssistance from "@/app/components/Share/ConatctAssistance/ContactAssistance";
import SEOAuditForm from "@/app/components/Share/SEOAuditForm/SEOAuditForm";
import { motion } from 'framer-motion';

import Image from "next/image";
import TechnicalCaseStudyModal from '@/app/components/Share/TechnicalCaseStudyModal/TechnicalCaseStudyModal';

const TechnicalSEOContent = () => {
    const [activeTab, setActiveTab] = useState('core');
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

    // Technical SEO Services
    const technicalServices = [
        { icon: <FiZap className="w-6 h-6" />, name: "Core Web Vitals", desc: "LCP, FID, CLS optimization for better UX" },
        { icon: <FiCpu className="w-6 h-6" />, name: "Site Speed", desc: "Performance optimization and loading times" },
        { icon: <FiGlobe className="w-6 h-6" />, name: "Site Architecture", desc: "URL structure and internal linking" },
        { icon: <FiSmartphone className="w-6 h-6" />, name: "Mobile Optimization", desc: "Mobile-first indexing compliance" },
        { icon: <FiSearch className="w-6 h-6" />, name: "Crawlability", desc: "Robots.txt, sitemaps, indexation" },
        { icon: <FiServer className="w-6 h-6" />, name: "Structured Data", desc: "Schema markup implementation" },
        { icon: <FiBarChart2 className="w-6 h-6" />, name: "Analytics Setup", desc: "Tracking and performance monitoring" },
        { icon: <FiCode className="w-6 h-6" />, name: "Code Optimization", desc: "HTML, CSS, JavaScript optimization" }
    ];

    // Pricing Packages
    const packages = [
        {
            name: "Basic Technical Audit",
            price: "$399",
            original: "$599",
            popular: false,
            features: [
                "Core Web Vitals Analysis",
                "Basic Speed Optimization",
                "Mobile-Friendly Check",
                "Crawlability Report",
                "Actionable Recommendations",
                "Email Support"
            ]
        },
        {
            name: "Comprehensive Technical SEO",
            price: "$899",
            original: "$1,299",
            popular: true,
            features: [
                "Everything in Basic Audit",
                "Full Technical Implementation",
                "Structured Data Setup",
                "Site Architecture Optimization",
                "Ongoing Performance Monitoring",
                "Priority Support",
                "Monthly Reports"
            ]
        },
        {
            name: "Enterprise Technical Suite",
            price: "$1,799",
            original: "$2,499",
            popular: false,
            features: [
                "Everything in Comprehensive",
                "Advanced Performance Optimization",
                "Custom Technical Solutions",
                "API Integration",
                "Dedicated Technical Expert",
                "24/7 Emergency Support",
                "Weekly Performance Reviews"
            ]
        }
    ];

    // Process Steps
    const processSteps = [
        {
            icon: <FiSearch className="w-6 h-6" />,
            title: "Comprehensive Audit",
            description: "Deep analysis of technical issues affecting your search performance"
        },
        {
            icon: <FiCode className="w-6 h-6" />,
            title: "Technical Implementation",
            description: "Fix identified issues and implement optimizations"
        },
        {
            icon: <FiZap className="w-6 h-6" />,
            title: "Performance Optimization",
            description: "Improve Core Web Vitals and loading speeds"
        },
        {
            icon: <FiBarChart2 className="w-6 h-6" />,
            title: "Ongoing Monitoring",
            description: "Track performance and maintain optimizations"
        }
    ];

    // Core Web Vitals Metrics
    const coreWebVitals = [
        { metric: "LCP (Largest Contentful Paint)", target: "< 2.5s", importance: "Loading Performance" },
        { metric: "FID (First Input Delay)", target: "< 100ms", importance: "Interactivity" },
        { metric: "CLS (Cumulative Layout Shift)", target: "< 0.1", importance: "Visual Stability" },
        { metric: "INP (Interaction to Next Paint)", target: "< 200ms", importance: "Responsiveness" }
    ];


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
                                <span className="text-white text-2xl font-bold">Technical</span>
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
                            Loading Technical SEO...
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
        <section className="min-h-screen bg-gray-900">
            {/* Case Study Modal */}
            <TechnicalCaseStudyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Hero Section */}
            <div className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-300">Technical SEO Specialist</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Technical SEO{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400">
                                Excellence
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Professional Technical SEO services to fix website performance issues,
                            optimize Core Web Vitals, and build a strong foundation for search success.
                            Part of our comprehensive <Link href="/seo" className="text-blue-400 hover:text-blue-300">SEO services</Link>.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            {/* Primary Button - Purple Shimmer */}
                            <Link
                                href="/contact"
                                className="group relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                <div className="absolute inset-[1px] rounded-xl bg-gray-900 -z-10 group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:via-purple-900 group-hover:to-gray-800 transition-all"></div>

                                <span className="relative">Get Technical SEO Audit</span>
                                <FiArrowRight className="relative group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" />
                            </Link>

                            {/* Secondary Button - Modern Glass */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group relative bg-gray-900/50 backdrop-blur-md border border-gray-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 hover:bg-gray-800/70 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-full group-hover:from-purple-300 group-hover:to-purple-500 transition-all"></div>

                                <FiZap className="relative group-hover:scale-110 transition-transform" />
                                <span className="relative ml-2">View Case Studies</span>
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-500/20 p-3 rounded-xl">
                                        <FiZap className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-white">90%+</div>
                                        <div className="text-gray-400 text-sm">Score Improvement</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-500/20 p-3 rounded-xl">
                                        <FiCpu className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-white">2.1s</div>
                                        <div className="text-gray-400 text-sm">Avg. LCP</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="bg-cyan-500/20 p-3 rounded-xl">
                                        <FiSmartphone className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-white">100%</div>
                                        <div className="text-gray-400 text-sm">Mobile Optimized</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Links Section */}
            <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-800/20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-4">

                        {/* Button 1 - All SEO Services */}
                        <Link
                            href="/seo"
                            className="group relative bg-gray-900/80 backdrop-blur-md border border-gray-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-gray-800/80 hover:border-purple-400 hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-purple-500/20"
                        >
                            {/* Floating Effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 -z-10"></div>

                            <FiArrowRight className="w-4 h-4 rotate-180 group-hover:text-purple-400 transition-colors" />
                            <span>All SEO Services</span>
                        </Link>

                        {/* Button 2 - GEO & SGE Optimization */}
                        <Link
                            href="/seo/geo-sge-optimization"
                            className="group relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 overflow-hidden"
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                            {/* Animated Border */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                            <div className="absolute inset-[1px] rounded-xl bg-gray-900 -z-10 group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:via-purple-900 group-hover:to-gray-800 transition-all"></div>

                            <FiZap className="w-4 h-4 group-hover:scale-110 group-hover:text-purple-300 transition-all" />
                            <span>GEO & SGE Optimization</span>
                        </Link>

                        {/* Button 3 - Free Consultation */}
                        <Link
                            href="/contact"
                            className="group relative bg-black border-2 border-purple-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-purple-950/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30"
                        >
                            {/* Neon Glow Effect */}
                            <div className="absolute inset-0 rounded-lg bg-purple-500/10 blur-md group-hover:bg-purple-400/20 transition-all duration-300 -z-10"></div>

                            <span>Get Free Consultation</span>
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" />
                        </Link>

                    </div>
                </div>
            </div>
            {/* Services Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Comprehensive Technical SEO Services</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            From Core Web Vitals to site architecture, we cover all technical aspects of SEO for optimal performance.
                            Explore our <Link href="/seo/geo-sge-optimization" className="text-blue-400 hover:text-blue-300">AI Search Optimization</Link> for future-proof strategies.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {technicalServices.map((service, index) => (
                            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all group">
                                <div className="text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                                    {service.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                                <p className="text-gray-400 text-sm">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Core Web Vitals Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Core Web Vitals Optimization</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Metrics Table */}
                        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                            <h3 className="text-2xl font-bold text-white mb-6">Google's Core Web Vitals</h3>
                            <div className="space-y-4">
                                {coreWebVitals.map((vital, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                                        <div>
                                            <div className="font-semibold text-white">{vital.metric}</div>
                                            <div className="text-gray-400 text-sm">{vital.importance}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-green-400 font-bold">{vital.target}</div>
                                            <div className="text-gray-400 text-sm">Target</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white">Why Technical SEO Matters</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">Better Rankings</h4>
                                        <p className="text-gray-400">Technical SEO is a direct Google ranking factor</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">Improved UX</h4>
                                        <p className="text-gray-400">Faster sites lead to better user experience</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">Higher Conversions</h4>
                                        <p className="text-gray-400">Optimized sites convert visitors better</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">Future-Proof</h4>
                                        <p className="text-gray-400">Strong technical foundation for long-term success</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional CTA */}
                            <div className="pt-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 transition-colors"
                                >
                                    <FiPlay className="w-4 h-4" />
                                    See real case study results
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Process Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Our Technical SEO Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {processSteps.map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="bg-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    {step.icon}
                                </div>
                                <div className="bg-blue-500/10 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                                    {index + 1}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                                <p className="text-gray-400">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-4">Technical SEO Pricing</h2>
                    <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                        Choose the right technical SEO package for your website needs.
                        Need <Link href="/seo/geo-sge-optimization" className="text-purple-400 hover:text-purple-300">AI Search Optimization</Link>? Check our GEO & SGE services.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {packages.map((pkg, index) => (
                            <div
                                key={index}
                                className={`bg-gray-800 rounded-2xl p-8 border-2 ${pkg.popular ? 'border-purple-500 relative' : 'border-gray-700'}`}
                            >
                                {pkg.popular && (
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        Most Popular
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold text-white mb-4">{pkg.name}</h3>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-white">{pkg.price}</span>
                                    <span className="text-gray-400 line-through ml-2">{pkg.original}</span>
                                    <span className="text-gray-400 text-sm ml-2">/project</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {pkg.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                                            <FiCheck className="text-green-400 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* UPDATED BUTTON DESIGNS */}
                                <Link
                                    href="/contact"
                                    className={`group relative block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 ${pkg.popular
                                            ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-md text-white hover:from-purple-700/90 hover:to-pink-700/90 hover:shadow-2xl hover:shadow-purple-500/30 hover:translate-y-[-2px]'
                                            : 'bg-gray-900/50 backdrop-blur-md border border-gray-600 text-gray-300 hover:bg-gray-800/70 hover:text-white hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/10'
                                        }`}
                                >
                                    {/* Glass effect overlay */}
                                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 -z-10 ${pkg.popular ? 'group-hover:from-purple-500/20 group-hover:to-pink-500/20' : ''
                                        }`}></div>

                                    <span className="relative flex items-center justify-center gap-2">
                                        Get Started
                                        <FiArrowRight className={`w-4 h-4 transition-all duration-300 ${pkg.popular
                                                ? 'group-hover:translate-x-1 group-hover:scale-110'
                                                : 'group-hover:translate-x-1 group-hover:text-purple-400'
                                            }`} />
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Audit Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left Side - Information */}
                        <div className="space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white">
                                Get Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Technical SEO Audit</span>
                            </h2>

                            <p className="text-lg text-gray-300">
                                Discover technical issues affecting your search rankings and get actionable recommendations for improvement.
                                Part of our complete <Link href="/seo" className="text-blue-400 hover:text-blue-300">SEO service suite</Link>.
                            </p>

                            {/* Benefits List */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-green-500/20 p-2 rounded-lg mt-1">
                                        <FiCheck className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Comprehensive Analysis</h4>
                                        <p className="text-gray-400 text-sm">100+ technical factors checked</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-500/20 p-2 rounded-lg mt-1">
                                        <FiZap className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Performance Insights</h4>
                                        <p className="text-gray-400 text-sm">Core Web Vitals and speed analysis</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-cyan-500/20 p-2 rounded-lg mt-1">
                                        <FiCode className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Actionable Report</h4>
                                        <p className="text-gray-400 text-sm">Step-by-step implementation guide</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Navigation */}
                            <div className="pt-4">
                                <p className="text-gray-400 text-sm mb-2">Looking for something else?</p>
                                <div className="flex gap-3">
                                    <Link href="/seo" className="text-blue-400 hover:text-blue-300 text-sm">
                                        All SEO Services
                                    </Link>
                                    <span className="text-gray-600">•</span>
                                    <Link href="/seo/geo-sge-optimization" className="text-blue-400 hover:text-blue-300 text-sm">
                                        GEO & SGE
                                    </Link>
                                    <span className="text-gray-600">•</span>
                                    <Link href="/contact" className="text-blue-400 hover:text-blue-300 text-sm">
                                        Contact
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Audit Form */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">Free Technical Audit</h3>
                                <p className="text-gray-400">Get your comprehensive report in 24 hours</p>
                            </div>
                            <SEOAuditForm />
                        </div>

                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <ContactAssistance />
        </section>
    );
};

export default TechnicalSEOContent;