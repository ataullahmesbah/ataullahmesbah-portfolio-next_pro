'use client';

import { motion } from 'framer-motion';
import RightSideBanner from './RightSide/RightSide';
import LeftSideBanner from './LeftSideBanner/LeftSideBanner';



const Banner = () => {
  return (
    <motion.div
      className="relative min-h-[calc(100vh-80px)] bg-gray-900 text-white flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '-1px -1px' }}></div>
      
      {/* Outer container for content with adjusted width distribution */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 md:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        {/* Left side takes 2/5 of width on large screens */}
        <div className="w-full lg:w-2/5">
          <LeftSideBanner />
        </div>
        {/* Right side takes 3/5 of width on large screens */}
        <div className="w-full lg:w-3/5">
          <RightSideBanner />
        </div>
      </div>
    </motion.div>
  );
};

export default Banner;

