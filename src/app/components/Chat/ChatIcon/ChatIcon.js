'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';


const WhatsAppIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 90 90"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M90 43.84c0 24.21-19.78 43.84-44.18 43.84-7.4 0-14.48-1.85-20.7-5.14l-22.06 7.35 7.52-21.5c-3.6-6.5-5.6-13.8-5.6-21.56C5.08 19.64 24.86 0 49.26 0 73.66 0 90 19.64 90 43.84zM45.82 7.5c-20.34 0-36.88 16.54-36.88 36.88 0 8.06 2.6 15.53 7.2 21.5l-4.8 13.68 13.9-4.62c5.73 4.12 12.5 6.5 19.78 6.5 20.34 0 36.88-16.54 36.88-36.88S66.16 7.5 45.82 7.5zm-8.63 50.12c-1.34.74-3.03.6-4.9-.52-1.87-1.12-3.4-2.5-4.5-3.95-1.1-1.45-2.3-3.24-2.3-5.62 0-2.38.8-4.43 2.27-6.13 1.47-1.7 3.3-2.63 5.4-2.63 2.1 0 3.9.94 5.25 2.82l-1.93 1.2c-1-1.33-2.2-2-3.3-2-1.1 0-2.25.6-3.14 1.87-.9 1.25-1.34 2.74-1.34 4.38 0 1.64.44 3.14 1.3 4.43.88 1.3 2.12 2.3 3.63 3.04 1.5.74 2.9.82 4.02.22l1.73 1.04c-.1.1-.34.22-.72.3zM62.3 57.62c-1.34.74-3.03.6-4.9-.52-1.87-1.12-3.4-2.5-4.5-3.95-1.1-1.45-2.3-3.24-2.3-5.62 0-2.38.8-4.43 2.27-6.13 1.47-1.7 3.3-2.63 5.4-2.63 2.1 0 3.9.94 5.25 2.82l-1.93 1.2c-1-1.33-2.2-2-3.3-2-1.1 0-2.25.6-3.14 1.87-.9 1.25-1.34 2.74-1.34 4.38 0 1.64.44 3.14 1.3 4.43.88 1.3 2.12 2.3 3.63 3.04 1.5.74 2.9.82 4.02.22l1.73 1.04c-.1.1-.34.22-.72.3z" />
  </svg>
);

export default function ChatIcon() {
  const [isHovered, setIsHovered] = useState(false);

  // আপনার WhatsApp নম্বরটি এখানে দিন (কান্ট্রি কোডসহ, কিন্তু '+' ছাড়া)
  const YOUR_PHONE_NUMBER = '8801571083401';

  // ব্যবহারকারীকে দেখানোর জন্য একটি পূর্ব-নির্ধারিত মেসেজ
  const PRE_FILLED_MESSAGE = 'Hello, I would like to know more about your services.';

  // WhatsApp URL তৈরি করা
  const whatsappUrl = `https://wa.me/${YOUR_PHONE_NUMBER}?text=${encodeURIComponent(PRE_FILLED_MESSAGE)}`;

  const handleWhatsAppRedirect = () => {
    // নতুন ট্যাবে WhatsApp চ্যাট খুলবে
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold rounded-md shadow-lg whitespace-nowrap"
      >
        Chat on WhatsApp
      </motion.div>

      {/* WhatsApp Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWhatsAppRedirect}
        className="relative bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse Animation */}
        <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-50"></div>
        <div className="relative">
          <WhatsAppIcon />
        </div>
      </motion.button>
    </div>
  );
}
