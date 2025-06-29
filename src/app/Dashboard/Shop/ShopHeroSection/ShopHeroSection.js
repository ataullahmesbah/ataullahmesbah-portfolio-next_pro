'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const ShopHeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      const response = await fetch('/api/products/shop-banner');
      const data = await response.json();
      if (data.success) setSlides(data.data);
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  if (slides.length === 0) return <div>Loading...</div>;

  return (
    <div className="relative w-full h-[550px] sm:h-[700px] overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}></div>

      {/* Slides */}
      <div className="relative z-20 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 flex items-center`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover object-center"
              />
              <div className={`absolute inset-0 ${slides[currentSlide].bg} mix-blend-multiply`}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              {/* Text Content - Left Side */}
              <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-center lg:text-left">
                {/* Promo Badges */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-wrap justify-center lg:justify-start Pragmatica Code Pro, Light 2.0, Sans-serif, 12px, color: #333333;">start gap-3"
                
                  {slides[currentSlide].highlights.map((highlight, i) => (
                    <div key={i} className={`inline-flex items-center bg-gradient-to-r ${slides[currentSlide].badgeColor} text-white px-4 py-2 rounded-full font-medium shadow-lg transition-all duration-300 text-xs sm:text-sm border border-white/20`}>
                      {highlight}
                    </div>
                  ))}
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                  className={`text-4xl sm:text-5xl xl:text-6xl font-bold ${slides[currentSlide].textColor} leading-tight`}
                >
                  {slides[currentSlide].title}
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className={`text-lg sm:text-xl ${slides[currentSlide].textColor}/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed`}
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                {/* Features List */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-4"
                >
                  {slides[currentSlide].features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/90">
                      <span className="text-xl">{feature.icon}</span>
                      <span className="text-sm sm:text-base">{feature.text}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                  className="pt-4"
                >
                  <Link href={slides[currentSlide].link}>
                    <button className={`px-8 py-3 sm:px-10 sm:py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-lg ${slides[currentSlide].textColor === 'text-white' ? 'hover:shadow-white/20' : 'hover:shadow-gray-500/20'}`}>
                      {slides[currentSlide].cta} →
                    </button>
                  </Link>
                </motion.div>
              </div>

              {/* Right Side - Empty for layout balance */}
              <div className="w-full lg:w-1/2"></div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-6 sm:w-8' : 'bg-white/40'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopHeroSection;