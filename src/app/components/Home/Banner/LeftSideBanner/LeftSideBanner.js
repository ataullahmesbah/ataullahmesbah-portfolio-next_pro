'use client';
import { motion } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import Link from 'next/link';

const LeftSideBanner = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const [text] = useTypewriter({
    words: ['Full-Stack Developer', 'SEO Specialist', 'AI Automation Expert', 'Digital Marketer', 'Video Editor'],
    loop: true,
    typeSpeed: 30,
    deleteSpeed: 20,
  });

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    }
  };

  return (
    <motion.div
      className="flex flex-col justify-center h-full space-y-4 md:space-y-5 text-center md:text-left"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Name with conditional typewriter display */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2"
      >
        <span className="text-xs font-medium uppercase tracking-wider text-purple-300/90">
          Hello, I'm Ataullah Mesbah
        </span>

        {/* Mobile/Tablet - Below */}
        <span className="block md:hidden text-xs font-medium uppercase tracking-wider text-cyan-300/90">
          {text}
          <Cursor cursorColor="#a855f7" />
        </span>

        {/* Desktop - Inline */}
        <span className="hidden md:inline text-xs font-medium uppercase tracking-wider text-cyan-300/90">
          - {text}
          <Cursor cursorColor="#a855f7" />
        </span>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-100 mt-0 md:mt-2"
      >
        Digital Solutions <span className="text-purple-300">Engineered</span> for Growth
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-xs sm:text-sm text-gray-300/90 max-w-md mx-auto md:mx-0 leading-relaxed"
      >
        Full-stack developer specializing in Next.js, React, and AI automation. SEO expert crafting high-performance websites.
        Combining technical expertise with creative vision to deliver impactful digital experiences.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex flex-wrap justify-center md:justify-start gap-3 pt-1"
      >
        <Link href="/contact" className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/80 to-pink-500/80 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"></div>
          <button className="relative px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-800/80 rounded-lg flex items-center gap-2 hover:bg-gray-700/70 transition-all duration-300 border border-gray-700/60">
            <span className="text-gray-100 font-medium text-xs sm:text-sm">Get Started</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </Link>

        <Link href="/projects" className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/80 to-blue-600/80 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"></div>
          <button className="relative px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-800/80 rounded-lg flex items-center gap-2 hover:bg-gray-700/70 transition-all duration-300 border border-gray-700/60">
            <span className="text-gray-100 font-medium text-xs sm:text-sm">View Work</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default LeftSideBanner;