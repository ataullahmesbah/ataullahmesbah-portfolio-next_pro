'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const LeftSideBanner = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

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
      className="space-y-8 text-center md:text-left"
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-sm font-semibold uppercase tracking-widest text-blue-400">
        Your Infrastructure, Reimagined
      </motion.div>

      <motion.h1 
        variants={itemVariants} 
        className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-tight"
      >
        Develop, Preview, and <span className="text-blue-400">Ship</span>.
      </motion.h1>

      <motion.p variants={itemVariants} className="text-lg text-gray-400 max-w-md mx-auto md:mx-0">
        The ultimate platform for modern web applications. Go from idea to global deployment in minutes.
      </motion.p>
      
      <motion.div variants={itemVariants}>
        <Link
          href="#"
          className="inline-flex items-center px-8 py-3.5 border border-transparent rounded-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 group shadow-lg shadow-blue-600/20 transform hover:scale-105"
        >
          Start Project
          <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default LeftSideBanner;
