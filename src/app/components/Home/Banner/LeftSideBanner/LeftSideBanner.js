'use client';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import Link from 'next/link';

const LeftSideBanner = () => {
    const [text] = useTypewriter({
        words: ['Web Developer', 'SEO Expert', 'Travel Lover', 'Tech Enthusiast'],
        loop: true,
        typeSpeed: 30,
        deleteSpeed: 20,
    });

    return (
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
            >
                <p className="text-lg text-pink-400 font-mono">Hello, This is</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    Ataullah <span className="text-cyan-400">Mesbah</span>
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-300"
            >
                <span>I am a </span>
                <span className="text-cyan-400">{text}</span>
                <Cursor cursorColor="#FF10F0" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-4 text-gray-400 text-justify"
            >
                <p className="leading-relaxed">
                    Professional web developer with 3+ years of experience specializing in modern JavaScript frameworks like Next.js and React. Expert in SEO optimization and performance tuning to create blazing fast websites.
                </p>
                <p className="leading-relaxed">
                    Passionate about combining technology and creativity to build digital experiences that inspire. When not coding, you will find me exploring new destinations and capturing travel stories.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-wrap gap-4 pt-2"
            >
                <Link href="/contact" className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button className="relative px-6 py-3 bg-gray-900 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
                        <span className="text-gray-100 font-medium">Get Started</span>
                        <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </button>
                </Link>

                <Link href="/projects" className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button className="relative px-6 py-3 bg-gray-900 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
                        <span className="text-gray-100 font-medium">View Projects</span>
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </button>
                </Link>
            </motion.div>
        </div>
    );
};

export default LeftSideBanner;