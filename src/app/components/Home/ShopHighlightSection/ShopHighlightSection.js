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
    <section className="py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 px-4 sm:px-6 md:px-8 lg:px-10 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
            Discover Our <span className="text-purple-400">Premium Collection</span>
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-3 sm:mb-4 rounded-full" />
          <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
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
                delayChildren: 0.3,
              },
            },
          }}
          className="relative"
        >
          {/* Background Glow Effect */}
          <div className="absolute -inset-4 sm:-inset-6 md:-inset-8 lg:-inset-10 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 rounded-2xl blur-sm sm:blur-md md:blur-lg lg:blur-xl" />
          </div>

          {/* Shop Preview Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="max-w-5xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md sm:shadow-lg lg:shadow-xl shadow-purple-900/20 hover:shadow-purple-900/30 transition-all duration-500 md:hover:scale-[1.02]"
          >
            <div className="flex flex-col md:flex-row">
              {/* Text Content */}
              <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center md:w-1/2">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4"
                >
                  Elevate Your Shopping Experience
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-5 md:mb-6"
                >
                  Browse our exclusive collection of premium products designed with quality and style.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  viewport={{ once: true }}
                  className="flex justify-center md:justify-start"
                >
                  <Link
                    href="/shop"
                    className="relative inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 text-xs sm:text-sm md:text-base lg:text-lg font-medium text-white rounded-md sm:rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  >
                    <span className="relative z-10">Visit Our Shop</span>
                    <span className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md sm:rounded-lg blur opacity-0 md:group-hover:opacity-75 transition-all duration-300" />
                  </Link>
                </motion.div>
              </div>

              {/* Visual Element */}
              <div className="relative md:w-1/2 bg-gradient-to-br from-purple-900/30 to-blue-900/30">
                <div className="absolute inset-0 pattern-dots pattern-gray-800 pattern-bg-transparent pattern-opacity-20 pattern-size-2" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute -right-3 sm:-right-4 md:-right-6 lg:-right-8 -top-3 sm:-top-4 md:-top-6 lg:-top-8 w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 bg-purple-600 rounded-full mix-blend-screen opacity-20 filter blur-sm sm:blur-md md:blur-lg lg:blur-xl"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  viewport={{ once: true }}
                  className="absolute -left-3 sm:-left-4 md:-left-6 lg:-left-8 -bottom-3 sm:-bottom-4 md:-bottom-6 lg:-bottom-8 w-20 sm:w-24 md:w-28 lg:h-32 h-20 sm:h-24 md:h-28 lg:h-32 bg-blue-600 rounded-full mix-blend-screen opacity-20 filter blur-sm sm:blur-md md:blur-lg lg:blur-xl"
                />
                <div className="h-24 sm:h-28 md:h-32 lg:h-36 flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6">
                  <div className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold opacity-10 relative h-8 sm:h-10 md:h-12 lg:h-14 w-full text-center">
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