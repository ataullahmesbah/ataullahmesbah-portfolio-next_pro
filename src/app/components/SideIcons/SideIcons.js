'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Apni jodi 'lucide-react' install kore thaken, tahole ei icon-gulo bebohar korun.
// Noile, 'react-icons/fa' theke icon import korben.
import { Share2, X, Linkedin, Github, Twitter, Instagram } from 'lucide-react';

// Social media links ebong icon-gulo ekta array-te rakha hoyeche
// jate poriborton kora shohoj hoy.
const socialLinks = [
  {
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    Icon: Linkedin,
  },
  {
    href: 'https://github.com',
    label: 'GitHub',
    Icon: Github,
  },
  {
    href: 'https://twitter.com',
    label: 'Twitter',
    Icon: Twitter,
  },
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    Icon: Instagram,
  },
];

// Container-er jonno animation variants
const containerVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 15,
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.2 },
  },
};

// Prottek-ti icon-er jonno animation variants
const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

export default function SideIcons() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Component-er baire click korle jate eta bondho hoye jay, tar jonno ei effect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50 flex items-center">
      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="z-10 w-12 h-12 bg-gray-900 text-white rounded-l-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
        aria-label={isOpen ? 'Close social links' : 'Open social links'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'share'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={24} /> : <Share2 size={24} />}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Social icons panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-2 p-3 bg-gray-900/80 backdrop-blur-md rounded-l-xl shadow-2xl"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className="group relative"
                aria-label={link.label}
              >
                <link.Icon className="text-white h-6 w-6 hover:text-gray-400 transition-colors duration-300" />
                {/* Tooltip */}
                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 px-2 py-1 bg-gray-700 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  {link.label}
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
