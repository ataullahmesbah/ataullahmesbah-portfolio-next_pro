// app/not-found.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
// 👇 Replace Heroicons imports with react-icons
import { HiOutlineHome, HiOutlineShoppingBag, HiOutlineArrowLeft } from 'react-icons/hi';

export default function NotFound() {
    // Animation variants (unchanged)
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
                ease: "easeOut"
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
    };

    const buttonHoverVariants = {
        hover: {
            scale: 1.05,
            y: -3,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.97,
            transition: { duration: 0.1 }
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-16 max-w-7xl w-full"
            >
                {/* Image Section */}
                <motion.div variants={itemVariants} className="relative order-1 lg:order-2">
                    <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[500px] xl:h-[550px] w-full">
                        <div
                            className="absolute inset-0 w-full h-full bg-no-repeat bg-contain lg:bg-cover bg-center"
                            style={{
                                backgroundImage: 'url("/4044.avif")',
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                            }}
                            role="img"
                            aria-label="404 Error Illustration - Page not found"
                        />
                        <div className="absolute inset-0 bg-transparent pointer-events-none" />
                    </div>
                </motion.div>

                {/* Content Section */}
                <motion.div variants={itemVariants} className="text-center lg:text-left space-y-4 md:space-y-6 order-2 lg:order-1">
                    <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-black leading-none tracking-tighter bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                        404
                    </h1>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                        Page Not Found
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
                        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
                    </p>

                    {/* Buttons - Updated Icons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4 md:pt-6 px-4 lg:px-0">
                        <Link href="/" className="w-full sm:w-auto">
                            <motion.button
                                variants={buttonHoverVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="w-full px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white font-semibold text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 border border-gray-600/30"
                            >
                                <HiOutlineHome className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span>Back to Home</span>
                            </motion.button>
                        </Link>

                        <Link href="/shop" className="w-full sm:w-auto">
                            <motion.button
                                variants={buttonHoverVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="w-full px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-gray-800 font-semibold text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 border border-gray-300"
                            >
                                <HiOutlineShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span>Browse Products</span>
                            </motion.button>
                        </Link>
                    </div>

                    {/* Back Button - Updated Icon */}
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 font-medium text-base sm:text-lg transition-all duration-300 group"
                    >
                        <HiOutlineArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Go Back</span>
                    </motion.button>

                </motion.div>
            </motion.div>
        </div>
    );
}