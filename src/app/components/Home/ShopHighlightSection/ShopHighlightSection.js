'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ShopHighlightSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = ["SHOP", "BUY NOW", "BEST SELLING", "Premium", "Travel Gadget"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
            Discover Our <span className="text-purple-400">Premium Collection</span>
          </h2>
          <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-4 md:mb-6 rounded-full" />
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Explore quality products crafted for your lifestyle
          </p>
        </motion.div>

        {/* Animated Shop Preview */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
              }
            }
          }}
          className="relative"
        >
          {/* Background Glow Effect - Adjusted for mobile */}
          <div className="absolute -inset-20 md:-inset-32 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 rounded-full blur-xl md:blur-3xl" />
          </div>

          {/* Shop Preview Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 }
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-2xl shadow-purple-900/20 hover:shadow-purple-900/40 transition-all duration-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Side - Text Content */}
              <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4"
                >
                  Ready to Elevate Your Shopping Experience?
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-gray-300 text-sm md:text-base mb-6 md:mb-8"
                >
                  Browse our exclusive collection of premium products designed with quality and style in mind.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href="/shop"
                    className="relative inline-flex items-center justify-center px-6 py-2 md:px-8 md:py-3 overflow-hidden text-base md:text-lg font-medium text-white rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  >
                    <span className="relative z-10">Visit Our Shop</span>
                    <span className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition-all duration-300" />
                  </Link>
                </motion.div>
              </div>

              {/* Right Side - Visual Element */}
              <div className="relative hidden md:block bg-gradient-to-br from-purple-900/30 to-blue-900/30">
                <div className="absolute inset-0 pattern-dots pattern-gray-800 pattern-bg-transparent pattern-opacity-30 pattern-size-2" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute -right-10 -top-10 w-48 h-48 md:w-64 md:h-64 bg-purple-600 rounded-full mix-blend-screen opacity-20 filter blur-2xl md:blur-3xl"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  viewport={{ once: true }}
                  className="absolute -left-10 -bottom-10 w-48 h-48 md:w-64 md:h-64 bg-blue-600 rounded-full mix-blend-screen opacity-20 filter blur-2xl md:blur-3xl"
                />
                <div className="h-full flex items-center justify-center p-6 md:p-8">
                  <div className="text-white text-4xl md:text-5xl lg:text-6xl font-bold opacity-10 relative h-16 md:h-20 w-full text-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={texts[currentTextIndex]}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {texts[currentTextIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopHighlightSection;