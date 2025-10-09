// components/AnimatedHero.jsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

const AnimatedHero = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const staggerContainer = {
        visible: {
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    return (
        <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gray-950 overflow-hidden">
            {/* Gradient mesh background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),_transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,119,198,0.2),_transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(120,219,255,0.15),_transparent_50%)]"></div>
            </div>

            {/* Animated gradient orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl"
            ></motion.div>

            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.15, 0.25, 0.15]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-3xl"
            ></motion.div>


            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="max-w-5xl mx-auto text-center relative z-10"
            >
                <motion.div variants={fadeIn} className="mb-5 md:mb-8">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-full text-sky-300 text-sm font-mono font-medium border border-sky-500/30">

                        &lt;Crafting Digital Experiences/&gt;
                    </span>
                </motion.div>

                <motion.h1
                    variants={fadeIn}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 md:mb-8 leading-tight tracking-tight"
                >
                    <span className="block text-gray-100">Ataullah Mesbah</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-purple-500">
                        Engineering Digital Excellence
                    </span>
                </motion.h1>

                <motion.p
                    variants={fadeIn}
                    className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300/90 mb-8 md:mb-12 leading-relaxed"
                >
                    Full Stack Dev <span className="text-gray-500 mx-3">|</span> SEO Strategist <span className="text-gray-500 mx-3">|</span> AI Search Optimization <span className="text-gray-500 mx-3">|</span> Travel Storyteller
                    <span className="block text-sm text-gray-500 mt-2">
                        Building performant, scalable web experiences with measurable business impact
                    </span>
                </motion.p>

                {/* Enhanced CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                >
                    {/* Primary Button - Contact */}
                    <Link
                        href="/contact"
                        className="group relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white px-8 py-4 rounded-xl  flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 overflow-hidden border border-gray-700 hover:border-purple-500/50"
                    >
                        {/* Animated Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                        {/* Base Background */}
                        <div className="absolute inset-[1px] rounded-xl bg-gray-900 -z-10 group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:via-purple-900 group-hover:to-gray-800 transition-all"></div>

                        <span className="relative">Start a Project</span>
                        <FiArrowRight className="relative group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" />
                    </Link>

                    {/* Secondary Button - Portfolio/Work */}
                    <Link
                        href="#journey"
                        className="group relative bg-gray-900/50 backdrop-blur-md border border-gray-700 text-white px-8 py-4 rounded-xl  flex items-center gap-3 transition-all duration-300 hover:bg-gray-800/70 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
                    >
                        {/* Left Accent Bar */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-full group-hover:from-purple-300 group-hover:to-purple-500 transition-all"></div>

                        {/* Hover Background Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <FiPlay className="relative group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative">Explore My Work</span>
                    </Link>
                </motion.div>

                {/* Quick Navigation to Subpages - IMPROVED */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-3 mb-8"
                >
                    {/* Web Development */}
                    <Link
                        href="/web-development"
                        className="group relative bg-gray-800/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-600/20 hover:shadow-lg hover:shadow-purple-500/10 border border-gray-700 hover:border-purple-500/30"
                    >
                        <span className="relative z-10">Web Development</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 rounded-lg group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 -z-10"></div>
                    </Link>

                    {/* Main SEO */}
                    <Link
                        href="/seo"
                        className="group relative bg-gray-800/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-600/20 hover:shadow-lg hover:shadow-purple-500/10 border border-gray-700 hover:border-purple-500/30"
                    >
                        <span className="relative z-10">SEO Services</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 rounded-lg group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 -z-10"></div>
                    </Link>

                    {/* Technical SEO */}
                    <Link
                        href="/seo/technical-seo"
                        className="group relative bg-gray-800/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-600/20 hover:shadow-lg hover:shadow-purple-500/10 border border-gray-700 hover:border-purple-500/30"
                    >
                        <span className="relative z-10">Technical SEO</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 rounded-lg group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 -z-10"></div>
                    </Link>

                    {/* GEO & SGE */}
                    <Link
                        href="/seo/geo-sge-optimization"
                        className="group relative bg-gray-800/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-600/20 hover:shadow-lg hover:shadow-purple-500/10 border border-gray-700 hover:border-purple-500/30"
                    >
                        <span className="relative z-10">GEO & SGE</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 rounded-lg group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 -z-10"></div>
                    </Link>

                    {/* Ecommerce SEO */}
                    <Link
                        href="/seo/ecommerce-seo"
                        className="group relative bg-gray-800/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-600/20 hover:shadow-lg hover:shadow-purple-500/10 border border-gray-700 hover:border-purple-500/30"
                    >
                        <span className="relative z-10">Ecommerce SEO</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 rounded-lg group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 -z-10"></div>
                    </Link>

                    {/* Content Creation */}
                    <Link
                        href="/content-creation"
                        className="group relative bg-gray-800/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-600/20 hover:shadow-lg hover:shadow-purple-500/10 border border-gray-700 hover:border-purple-500/30"
                    >
                        <span className="relative z-10">Content Creation</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 rounded-lg group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 -z-10"></div>
                    </Link>
                </motion.div>


            </motion.div>
        </section>
    );
};

export default AnimatedHero;