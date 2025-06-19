'use client';
import { motion } from 'framer-motion';
import LeftSideBanner from './LeftSideBanner/LeftSideBanner';
import RightSideBanner from './RightSideBanner/RightSideBanner';


const Banner = () => {
  return (
    <motion.div
      className="relative min-h-[calc(100vh-80px)] bg-gray-900 text-white flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ 
        backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', 
        backgroundSize: '40px 40px',
        backgroundPosition: '-1px -1px'
      }}></div>
      
      {/* Animated floating dots */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, (Math.random() > 0.5 ? 1 : -1) * 20, 0],
              x: [0, (Math.random() > 0.5 ? 1 : -1) * 20, 0],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 md:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        <div className="w-full lg:w-2/5">
          <LeftSideBanner />
        </div>
        <div className="w-full lg:w-full">
          <RightSideBanner />
        </div>
      </div>
    </motion.div>
  );
};

export default Banner;