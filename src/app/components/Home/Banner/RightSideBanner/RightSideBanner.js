'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import React, { useRef } from 'react';
import { FaReact, FaPython } from 'react-icons/fa';
import { SiPostgresql, SiRailway } from 'react-icons/si';
import { HiShieldCheck, HiChartBar } from 'react-icons/hi';

// Service Node Component
const ServiceNode = ({ icon, title, url, aX, aY, delay }) => (
  <motion.div
    style={{ x: aX, y: aY }}
    className="group relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gray-900/50 backdrop-blur-md border border-white/15 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-105 hover:bg-gray-800/60 hover:shadow-[0_0_10px_rgba(59,130,246,0.4)] hover:-rotate-2"
    initial={{ y: 50, opacity: 0, scale: 0.85, rotate: 3 }}
    animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    whileHover={{ rotate: -2, transition: { duration: 0.2 } }}
  >
    <div className="text-2xl sm:text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
      {icon}
    </div>
    <div className="text-center">
      <h3 className="font-semibold text-white text-[0.65rem] sm:text-xs md:text-sm">{title}</h3>
      {url && (
        <p className="text-[0.5rem] sm:text-[0.65rem] md:text-xs text-gray-300 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {url.replace(/(https?:\/\/)/, '')}
        </p>
      )}
    </div>
    {/* Neon pulse effect on hover */}
    <motion.div
      className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/15 to-purple-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ filter: 'blur(8px)' }}
      animate={{ scale: [1, 1.05, 1], opacity: [0, 0.3, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    />
  </motion.div>
);

const RightSideBanner = () => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 110, damping: 22 };
  const mX = useSpring(useTransform(x, [-1, 1], [-8, 8]), springConfig);
  const mY = useSpring(useTransform(y, [-1, 1], [-8, 8]), springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    x.set(((e.clientX - left) / width) * 2 - 1);
    y.set(((e.clientY - top) / height) * 2 - 1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cardX = (factor) => useSpring(useTransform(mX, (val) => val * factor), springConfig);
  const cardY = (factor) => useSpring(useTransform(mY, (val) => val * factor), springConfig);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-[450px] sm:h-[500px] md:h-[600px] flex items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-8 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:18px_18px]" />

      <motion.div className="relative w-full h-full max-w-4xl mx-auto" style={{ transformStyle: 'preserve-3d' }}>
        {/* Central Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <ServiceNode
            icon={<SiRailway />}
            title="Railway"
            aX={cardX(0)}
            aY={cardY(0)}
            delay={0.1}
          />
        </div>

        {/* Service Nodes - Compact Responsive Layout */}
        <div className="absolute top-[18%] sm:top-[15%] left-[12%] sm:left-[18%] md:left-[22%] z-10">
          <ServiceNode
            icon={<FaReact />}
            title="Frontend"
            url="frontend-prod.up.railway.app"
            aX={cardX(0.7)}
            aY={cardY(0.7)}
            delay={0.2}
          />
        </div>

        <div className="absolute top-[18%] sm:top-[15%] right-[12%] sm:right-[18%] md:right-[22%] z-10">
          <ServiceNode
            icon={<HiChartBar />}
            title="Analytics"
            url="ackee-prod.up.railway.app"
            aX={cardX(0.7)}
            aY={cardY(0.7)}
            delay={0.3}
          />
        </div>

        <div className="absolute top-[68%] sm:top-[65%] left-[12%] sm:left-[18%] md:left-[22%] z-10">
          <ServiceNode
            icon={<HiShieldCheck />}
            title="Gateway"
            url="api-prod.up.railway.app"
            aX={cardX(1)}
            aY={cardY(1)}
            delay={0.4}
          />
        </div>

        <div className="absolute top-[68%] sm:top-[65%] right-[12%] sm:right-[18%] md:right-[22%] z-10">
          <ServiceNode
            icon={<FaPython />}
            title="Backend"
            aX={cardX(1)}
            aY={cardY(1)}
            delay={0.5}
          />
        </div>

        <div className="absolute bottom-[12%] sm:bottom-[10%] left-1/2 transform -translate-x-1/2 z-10">
          <ServiceNode
            icon={<SiPostgresql />}
            title="Database"
            aX={cardX(0.8)}
            aY={cardY(0.8)}
            delay={0.6}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RightSideBanner;