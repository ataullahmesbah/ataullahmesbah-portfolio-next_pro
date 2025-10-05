'use client';

import { useEffect, useState } from 'react';
import { FiCheck, FiArrowRight, FiShoppingCart, FiPackage, FiTag, FiBarChart2, FiZap, FiSearch, FiGrid, FiSmartphone, FiGift, FiTrendingUp } from 'react-icons/fi';
import Link from "next/link";
import ContactAssistance from "@/app/components/Share/ConatctAssistance/ContactAssistance";
import SEOAuditForm from "@/app/components/Share/SEOAuditForm/SEOAuditForm";
import EcommerceCaseStudyModal from '@/app/components/Share/EcommerceCaseStudyModal/EcommerceCaseStudyModal';
import { motion } from 'framer-motion';

const EcommerceSEOContent = () => {
    const [activeTab, setActiveTab] = useState('product');
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


    // Ecommerce SEO Services
    const ecommerceServices = [
        { icon: <FiPackage className="w-6 h-6" />, name: "Product Page SEO", desc: "Optimize individual product pages for higher conversions" },
        { icon: <FiGrid className="w-6 h-6" />, name: "Category Optimization", desc: "Category page structure and internal linking" },
        { icon: <FiShoppingCart className="w-6 h-6" />, name: "Shopping Cart SEO", desc: "Cart and checkout page optimization" },
        { icon: <FiTag className="w-6 h-6" />, name: "Product Schema", desc: "Rich product snippets and structured data" },
        { icon: <FiZap className="w-6 h-6" />, name: "Ecommerce GEO", desc: "AI search optimization for products" },
        { icon: <FiBarChart2 className="w-6 h-6" />, name: "Sales Analytics", desc: "Conversion tracking and performance monitoring" },
        { icon: <FiSmartphone className="w-6 h-6" />, name: "Mobile Ecommerce", desc: "Mobile-first optimization for stores" },
        { icon: <FiSearch className="w-6 h-6" />, name: "Ecommerce Technical", desc: "Speed, architecture, and crawlability" }
    ];

    // Pricing Packages
    const packages = [
        {
            name: "Starter Ecommerce SEO",
            price: "$699",
            original: "$999",
            popular: false,
            features: [
                "Product Page Audit & Optimization",
                "Basic Category Structure",
                "Product Schema Implementation",
                "Mobile-Friendly Check",
                "Basic Technical SEO",
                "Monthly Performance Report"
            ]
        },
        {
            name: "Growth Ecommerce Suite",
            price: "$1,299",
            original: "$1,799",
            popular: true,
            features: [
                "Everything in Starter Package",
                "Complete Category Optimization",
                "Advanced Product Schema",
                "Shopping Cart SEO",
                "GEO/SGE Optimization",
                "Conversion Tracking Setup",
                "Priority Support"
            ]
        },
        {
            name: "Enterprise Ecommerce Pro",
            price: "$2,299",
            original: "$3,199",
            popular: false,
            features: [
                "Everything in Growth Suite",
                "Multi-language SEO",
                "Custom Ecommerce Solutions",
                "Advanced Analytics Dashboard",
                "Dedicated Ecommerce Expert",
                "24/7 Technical Support",
                "Weekly Strategy Calls"
            ]
        }
    ];

    // Process Steps
    const processSteps = [
        {
            icon: <FiSearch className="w-6 h-6" />,
            title: "Ecommerce Audit",
            description: "Comprehensive analysis of your online store's SEO performance"
        },
        {
            icon: <FiPackage className="w-6 h-6" />,
            title: "Product Optimization",
            description: "Optimize product pages, images, and structured data"
        },
        {
            icon: <FiZap className="w-6 h-6" />,
            title: "Technical Implementation",
            description: "Implement GEO/SGE optimization and technical fixes"
        },
        {
            icon: <FiTrendingUp className="w-6 h-6" />,
            title: "Performance Monitoring",
            description: "Track sales, conversions, and search performance"
        }
    ];

    // Ecommerce Platforms
    const platforms = [
        { name: "Shopify", color: "from-green-500 to-green-600" },
        { name: "WooCommerce", color: "from-purple-500 to-purple-600" },
        { name: "Magento", color: "from-orange-500 to-orange-600" },
        { name: "BigCommerce", color: "from-blue-500 to-blue-600" },
        { name: "Custom Solutions", color: "from-gray-500 to-gray-600" }
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
                                <span className="text-white text-2xl font-bold">E-commerce</span>
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
                            Loading E-commerce SEO...
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
            <EcommerceCaseStudyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Hero Section */}
            <div className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-300">Ecommerce SEO Specialist</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Ecommerce SEO{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
                                Excellence
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Drive more sales with professional Ecommerce SEO services. Product page optimization,
                            AI search readiness, and technical excellence for your online store.
                            Part of our comprehensive <Link href="/seo" className="text-purple-400 hover:text-purple-300">SEO services</Link>.
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

                                <span className="relative">Get Ecommerce SEO Audit</span>
                                <FiArrowRight className="relative group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" />
                            </Link>

                            {/* Secondary Button - Modern Glass */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group relative bg-gray-900/50 backdrop-blur-md border border-gray-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 hover:bg-gray-800/70 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-full group-hover:from-purple-300 group-hover:to-purple-500 transition-all"></div>

                                <FiShoppingCart className="relative group-hover:scale-110 transition-transform" />
                                <span className="relative ml-2">View Case Studies</span>
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="bg-purple-500/20 p-3 rounded-xl">
                                        <FiTrendingUp className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-white">45%</div>
                                        <div className="text-gray-400 text-sm">Avg. Sales Growth</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="bg-pink-500/20 p-3 rounded-xl">
                                        <FiShoppingCart className="w-6 h-6 text-pink-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-white">2.8x</div>
                                        <div className="text-gray-400 text-sm">Product Conversions</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-500/20 p-3 rounded-xl">
                                        <FiZap className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-white">AI</div>
                                        <div className="text-gray-400 text-sm">Search Ready</div>
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
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 -z-10"></div>
                            <FiArrowRight className="w-4 h-4 rotate-180 group-hover:text-purple-400 transition-colors" />
                            <span>All SEO Services</span>
                        </Link>

                        {/* Button 2 - Technical SEO */}
                        <Link
                            href="/seo/technical-seo"
                            className="group relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                            <div className="absolute inset-[1px] rounded-xl bg-gray-900 -z-10 group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:via-purple-900 group-hover:to-gray-800 transition-all"></div>
                            <FiZap className="w-4 h-4 group-hover:scale-110 group-hover:text-purple-300 transition-all" />
                            <span>Technical SEO</span>
                        </Link>

                        {/* Button 3 - Free Consultation */}
                        <Link
                            href="/contact"
                            className="group relative bg-black border-2 border-purple-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-purple-950/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30"
                        >
                            <div className="absolute inset-0 rounded-lg bg-purple-500/10 blur-md group-hover:bg-purple-400/20 transition-all duration-300 -z-10"></div>
                            <span>Get Free Consultation</span>
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" />
                        </Link>

                    </div>
                </div>
            </div>

            {/* Ecommerce Platforms Section - Modern Design */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Leading Ecommerce Platforms</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            From Shopify to custom solutions, our Ecommerce SEO strategies are tailored to your platform's unique architecture and requirements.
                        </p>
                    </div>

                    {/* Modern Platform Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
                        {platforms.map((platform, index) => (
                            <div
                                key={index}
                                className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center transition-all duration-300 hover:border-purple-500/50 hover:bg-gray-700/30 hover:shadow-2xl hover:shadow-purple-500/10"
                            >
                                {/* Hover Gradient Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 rounded-2xl group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 -z-10"></div>

                                {/* Platform Icon/Logo Placeholder */}
                                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {platform.name.charAt(0)}
                                </div>

                                {/* Platform Name */}
                                <h3 className="text-white font-semibold text-sm md:text-base group-hover:text-purple-300 transition-colors">
                                    {platform.name}
                                </h3>

                                {/* Hover Indicator */}
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-8 transition-all duration-300"></div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Trust Indicators */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="bg-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FiCheck className="w-8 h-8 text-purple-400" />
                            </div>
                            <h4 className="text-white font-semibold mb-2">Platform-Specific SEO</h4>
                            <p className="text-gray-400 text-sm">Custom strategies for each platform's architecture</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-pink-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FiZap className="w-8 h-8 text-pink-400" />
                            </div>
                            <h4 className="text-white font-semibold mb-2">Technical Excellence</h4>
                            <p className="text-gray-400 text-sm">Optimized for speed, mobile, and Core Web Vitals</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FiTrendingUp className="w-8 h-8 text-blue-400" />
                            </div>
                            <h4 className="text-white font-semibold mb-2">Proven Results</h4>
                            <p className="text-gray-400 text-sm">45% average sales growth across all platforms</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Comprehensive Ecommerce SEO Services</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            From product pages to AI search optimization, we cover every aspect of Ecommerce SEO for maximum sales growth.
                            Explore our <Link href="/seo/geo-sge-optimization" className="text-purple-400 hover:text-purple-300">GEO & SGE services</Link> for AI-ready optimization.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ecommerceServices.map((service, index) => (
                            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all group">
                                <div className="text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                                    {service.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                                <p className="text-gray-400 text-sm">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ecommerce SEO Focus Areas */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Ecommerce SEO Focus Areas</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Product Page Optimization */}
                        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                            <h3 className="text-2xl font-bold text-white mb-6">Product Page Excellence</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">Rich Product Schema</h4>
                                        <p className="text-gray-400 text-sm">Structured data for better search visibility</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">Image Optimization</h4>
                                        <p className="text-gray-400 text-sm">Compressed, WebP format, alt text</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">GEO Optimization</h4>
                                        <p className="text-gray-400 text-sm">AI-search ready product descriptions</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">Conversion Optimization</h4>
                                        <p className="text-gray-400 text-sm">UX improvements for higher sales</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Ecommerce SEO */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white">Technical Ecommerce SEO</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">Site Architecture</h4>
                                        <p className="text-gray-400">Optimized category structure and internal linking</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">Core Web Vitals</h4>
                                        <p className="text-gray-400">Fast loading for better user experience</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">Mobile-First</h4>
                                        <p className="text-gray-400">Perfect mobile shopping experience</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FiCheck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-white">SGE Ready</h4>
                                        <p className="text-gray-400">Optimized for Google's AI search experience</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional CTA */}
                            <div className="pt-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 transition-colors"
                                >
                                    <FiShoppingCart className="w-4 h-4" />
                                    See ecommerce case study results
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Process Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Our Ecommerce SEO Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {processSteps.map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="bg-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    {step.icon}
                                </div>
                                <div className="bg-purple-500/10 text-purple-400 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
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
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-4">Ecommerce SEO Pricing</h2>
                    <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                        Choose the perfect Ecommerce SEO package for your online store.
                        Need <Link href="/seo/technical-seo" className="text-purple-400 hover:text-purple-300">Technical SEO</Link>? Check our comprehensive technical services.
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

                                <Link
                                    href="/contact"
                                    className={`group relative block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 ${pkg.popular
                                        ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-md text-white hover:from-purple-700/90 hover:to-pink-700/90 hover:shadow-2xl hover:shadow-purple-500/30 hover:translate-y-[-2px]'
                                        : 'bg-gray-900/50 backdrop-blur-md border border-gray-600 text-gray-300 hover:bg-gray-800/70 hover:text-white hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/10'
                                        }`}
                                >
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
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left Side - Information */}
                        <div className="space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white">
                                Get Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Ecommerce SEO Audit</span>
                            </h2>

                            <p className="text-lg text-gray-300">
                                Discover how to optimize your online store for more sales and better search visibility.
                                Part of our complete <Link href="/seo" className="text-purple-400 hover:text-purple-300">SEO service suite</Link>.
                            </p>

                            {/* Benefits List */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-green-500/20 p-2 rounded-lg mt-1">
                                        <FiCheck className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Product Page Analysis</h4>
                                        <p className="text-gray-400 text-sm">Comprehensive product SEO evaluation</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-500/20 p-2 rounded-lg mt-1">
                                        <FiZap className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Technical Insights</h4>
                                        <p className="text-gray-400 text-sm">Site speed and architecture analysis</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-pink-500/20 p-2 rounded-lg mt-1">
                                        <FiShoppingCart className="w-5 h-5 text-pink-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Conversion Opportunities</h4>
                                        <p className="text-gray-400 text-sm">UX and conversion rate insights</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Navigation */}
                            <div className="pt-4">
                                <p className="text-gray-400 text-sm mb-2">Looking for something else?</p>
                                <div className="flex gap-3">
                                    <Link href="/seo" className="text-purple-400 hover:text-purple-300 text-sm">
                                        All SEO Services
                                    </Link>
                                    <span className="text-gray-600">•</span>
                                    <Link href="/seo/technical-seo" className="text-purple-400 hover:text-purple-300 text-sm">
                                        Technical SEO
                                    </Link>
                                    <span className="text-gray-600">•</span>
                                    <Link href="/seo/geo-sge-optimization" className="text-purple-400 hover:text-purple-300 text-sm">
                                        GEO & SGE
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Audit Form */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">Free Ecommerce Audit</h3>
                                <p className="text-gray-400">Get your comprehensive store analysis in 24 hours</p>
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

export default EcommerceSEOContent;