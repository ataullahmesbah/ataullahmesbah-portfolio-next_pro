'use client';
import { motion } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import Link from 'next/link';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

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
        <button>
          <Link
            href="/contact"
            className="  group relative bg-gray-900/50 backdrop-blur-md border border-gray-700 text-white px-8 py-4 rounded-xl  flex items-center gap-3 transition-all duration-300 hover:bg-gray-800/70 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
            aria-label="Contact Ataullah Mesbah"
          >
            {/* Left Accent Bar */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-full group-hover:from-purple-300 group-hover:to-purple-500 transition-all"></div>

            {/* Hover Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <FiPlay className="relative group-hover:scale-110 transition-transform duration-300" />

            <span className="relative">Get in Touch</span>
          </Link>
        </button>


        {/* Primary Button - Contact */}
        <Link
          href="/projects"
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
      </motion.div>
    </motion.div>
  );
};

export default LeftSideBanner;