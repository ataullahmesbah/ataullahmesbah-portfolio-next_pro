"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 0.4; // Smoother progress over 6s
      });
    }, 24);
    return () => clearInterval(interval);
  }, []);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
    },
    exit: {
      opacity: 0,
      scale: 0.7,
      transition: { duration: 0.5, ease: "easeIn" }
    }
  };

  // Outer ring animation with 3D effect
  const outerRingVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.05, 1],
      transition: { duration: 3, repeat: Infinity, ease: "linear" }
    }
  };

  // Inner ring animation (counter-rotation)
  const innerRingVariants = {
    animate: {
      rotate: [360, 0],
      scale: [1, 1.03, 1],
      transition: { duration: 3.5, repeat: Infinity, ease: "linear" }
    }
  };

  // Glow pulse effect
  const glowVariants = {
    animate: {
      scale: [1, 1.25, 1],
      opacity: [0.15, 0.35, 0.15],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  };

  // Text animation with bounce
  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.3, type: "spring", stiffness: 120 }
    }
  };

  // Particle animation
  const particleVariants = {
    animate: (i) => ({
      y: [0, -10, 0],
      opacity: [0.3, 0.8, 0.3],
      transition: { duration: 1.2, repeat: Infinity, delay: i * 0.15 }
    })
  };

  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 bg-opacity-95 flex items-center justify-center z-50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="status"
          aria-label="Loading content"
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-44 lg:h-44 xl:w-48 xl:h-48">
            {/* Multi-layered Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-3xl"
              variants={glowVariants}
              animate="animate"
            />
            <motion.div
              className="absolute inset-2 rounded-full bg-blue-500/20 blur-xl"
              variants={glowVariants}
              animate="animate"
              style={{ animationDelay: '0.5s' }}
            />
            {/* Outer Ring with Gradient Stroke */}
            <motion.svg
              className="w-full h-full drop-shadow-lg"
              viewBox="0 0 100 100"
              variants={outerRingVariants}
              animate="animate"
            >
              <defs>
                <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="url(#outerGradient)"
                strokeWidth="3.5"
                strokeDasharray="289.0"
                strokeDashoffset={289.0 - (progress / 100) * 289.0}
                strokeLinecap="round"
                className="transition-all duration-600 ease-in-out"
              />
            </motion.svg>
            {/* Inner Ring with Gradient Stroke */}
            <motion.svg
              className="w-full h-full absolute top-0 left-0 drop-shadow-md"
              viewBox="0 0 100 100"
              variants={innerRingVariants}
              animate="animate"
            >
              <defs>
                <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="41"
                fill="none"
                stroke="url(#innerGradient)"
                strokeWidth="3"
                strokeDasharray="257.6"
                strokeDashoffset={257.6 - (progress / 100) * 257.6}
                strokeLinecap="round"
                className="transition-all duration-600 ease-in-out"
              />
            </motion.svg>
            {/* Dynamic Progress Text */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-tight"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              {Math.round(progress)}%
            </motion.div>
            {/* Advanced Particle System */}
            <motion.div
              className="absolute inset-0"
              animate={{
                rotate: [0, 360],
                transition: { duration: 12, repeat: Infinity, ease: "linear" }
              }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-md"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 30}deg) translate(0, -45px)`
                  }}
                  variants={particleVariants}
                  animate="animate"
                  custom={i}
                />
              ))}
            </motion.div>
          </div>
          {/* Accessibility: Screen reader text */}
          <span className="sr-only">Loading, {Math.round(progress)}% complete</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}