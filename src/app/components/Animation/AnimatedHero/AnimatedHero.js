// components/AnimatedHero.jsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

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
        <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden">
            {/* Animated background elements */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                transition={{ duration: 2.5 }}
                className="absolute inset-0 overflow-hidden"
            >
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-sky-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-15"></div>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="max-w-5xl mx-auto text-center relative z-10"
            >
                <motion.div variants={fadeIn} className="mb-5 md:mb-8">
                    <span className="inline-block px-4 py-2 bg-gray-800/70 backdrop-blur-sm rounded-full text-sky-400 text-sm font-medium border border-gray-700/50">
                        Digital Architect
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
                    Full Stack Developer | GEO & SGE Specialist | SEO Specialist | Travel Storyteller
                    <span className="block text-sm text-gray-500 mt-2">
                        Building performant, scalable web experiences with measurable business impact
                    </span>
                </motion.p>

                <motion.div
                    variants={fadeIn}
                    className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
                >
                    <Link
                        href="/contact"
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-lg font-medium transition-all transform hover:scale-[1.02] shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 text-white"
                    >
                        Start a Project →
                    </Link>
                    <Link
                        href="#journey"
                        className="px-6 sm:px-8 py-2.5 sm:py-3 border border-gray-700 hover:border-sky-400/70 rounded-lg font-medium transition-all hover:bg-gray-800/30 backdrop-blur-sm text-gray-200"
                    >
                        Explore My Work
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default AnimatedHero;