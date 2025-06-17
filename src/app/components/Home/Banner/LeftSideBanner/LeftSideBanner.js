'use client';

import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaCode, FaSearch, FaFeatherAlt, FaPlane } from 'react-icons/fa';

const LeftSideBanner = () => {
  const [typewriterText] = useTypewriter({
    words: ['High-Performance Web Apps', 'Optimized Digital Presence', 'Engaging Content'],
    loop: true,
    typeSpeed: 40,
    deleteSpeed: 25,
    delaySpeed: 2000,
  });

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 p-4 lg:p-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <p className="text-sm md:text-base text-gray-400 font-mono mb-1">Network & Connect</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3 drop-shadow-md">
          Interconnect your <span className="text-blue-400">digital assets</span> with{' '}
          <span className="text-purple-400">seamless solutions</span>.
        </h1>
      </motion.div>

      <motion.div variants={itemVariants} className="text-lg md:text-xl text-gray-300 max-w-xl lg:mx-0 mx-auto">
        <p className="leading-relaxed">
          I provide advanced web development, blazing fast SEO, and engaging content creation. Delivering:
        </p>
        <ul className="mt-3 space-y-1 list-none p-0 text-left lg:text-left inline-block lg:block text-[0.95rem]">
          <li className="flex items-center gap-2">
            <FaCode className="text-blue-400" />
            <span>{typewriterText}<Cursor cursorColor="#FF10F0" /></span>
          </li>
          <li className="flex items-center gap-2">
            <FaSearch className="text-green-400" />
            <span>SEO & Performance Optimization</span>
          </li>
          <li className="flex items-center gap-2">
            <FaFeatherAlt className="text-yellow-400" />
            <span>Content Strategy & Creation</span>
          </li>
          <li className="flex items-center gap-2">
            <FaPlane className="text-purple-400" />
            <span>Travel & Tech Consulting</span>
          </li>
        </ul>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6">
        <Link
          href="/services"
          className="inline-flex items-center px-6 py-3 border border-gray-600 rounded-lg text-base font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors duration-300 group"
        >
          Learn More
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 flex flex-wrap justify-center lg:justify-start items-center gap-3 text-gray-500 text-xs">
        <span>Services utilized:</span>
        <span className="flex items-center gap-2">
          <img src="https://img.icons8.com/color/48/000000/google-cloud.png" alt="Google Cloud" className="h-5 w-5 opacity-80" title="Google Cloud" />
          <img src="https://img.icons8.com/color/48/000000/amazon-web-services.png" alt="AWS" className="h-5 w-5 opacity-80" title="AWS" />
          <img src="https://img.icons8.com/ios-filled/50/000000/heroku.png" alt="Heroku" className="h-5 w-5 opacity-80" title="Heroku" />
          <img src="https://img.icons8.com/ios-filled/50/000000/firebase.png" alt="Firebase" className="h-5 w-5 opacity-80" title="Firebase" />
        </span>
      </motion.div>
    </motion.div>
  );
};

export default LeftSideBanner;