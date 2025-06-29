'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const slides = [
  {
    title: "Elite Member Exclusive",
    subtitle: "Enjoy special privileges with Team Mesbah membership",
    highlights: [
      "FREE Shipping on Orders Over ৳2000",
      "Early Access to New Collections",
      "Members-Only Discounts"
    ],
    cta: "Join Now",
    bg: "bg-gradient-to-br from-gray-900 via-purple-900/70 to-gray-900",
    textColor: "text-white",
    badgeColor: "from-purple-600 to-indigo-600",
    features: [
      { icon: "🚚", text: "Free Delivery" },
      { icon: "🛍️", text: "Exclusive Products" },
      { icon: "💎", text: "VIP Treatment" }
    ],
    image: "/shop/slide1.jpg",
    link: "/membership" // Custom link for this slide
  },
  {
    title: "Seasonal Mega Sale",
    subtitle: "Limited time offers you can't miss this season",
    highlights: [
      "Buy 1 Get 1 Free on Selected Items",
      "Extra 15% Off on First Purchase",
      "Gift Wrapping Included"
    ],
    cta: "Shop the Sale",
    bg: "bg-gradient-to-br from-gray-900 via-blue-900/70 to-gray-900",
    textColor: "text-white",
    badgeColor: "from-blue-600 to-cyan-600",
    features: [
      { icon: "🎁", text: "Free Gifts" },
      { icon: "⏳", text: "Limited Time" },
      { icon: "🔖", text: "Extra Discounts" }
    ],
    image: "/shop/slide2.jpg",
    link: "/sale" // Custom link for this slide
  },
  {
    title: "New Tech Collection",
    subtitle: "Cutting-edge gadgets for modern lifestyles",
    highlights: [
      "Launch Discount: 30% OFF",
      "Extended Warranty Offer",
      "Free Tech Support"
    ],
    cta: "Explore Tech",
    bg: "bg-gradient-to-br from-gray-900 via-amber-900/70 to-gray-900",
    textColor: "text-white",
    badgeColor: "from-amber-600 to-orange-600",
    features: [
      { icon: "🔄", text: "Easy Returns" },
      { icon: "🔌", text: "Latest Tech" },
      { icon: "🛠️", text: "Free Support" }
    ],
    image: "/shop/slide3.jpg",
    link: "/tech" // Custom link for this slide
  }
];

const ShopHeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

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
                  className="flex flex-wrap justify-center lg:justify-start gap-3"
                >
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