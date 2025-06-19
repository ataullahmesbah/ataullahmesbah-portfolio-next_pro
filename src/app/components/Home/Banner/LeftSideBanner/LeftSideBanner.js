'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { SiNotion, SiVercel, SiNetlify, SiHeroku } from 'react-icons/si';

const LeftSideBanner = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } }
  };

  return (
    <motion.div className="space-y-6 w-full lg:w-2/5" variants={container} initial="hidden" animate="visible">
      <motion.div variants={item}>
        <p className="text-sm md:text-base text-blue-400 font-mono mb-2">Network and Connect</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Interconnect your <span className="text-blue-400">application</span> seamlessly
        </h1>
      </motion.div>
      <motion.p variants={item} className="text-lg text-gray-300">
        Railway provides automated service discovery, blazing fast networking, and support for any protocol, all out of the box.
      </motion.p>
      <motion.div variants={item}>
        <Link
          href="#"
          className="inline-flex items-center px-6 py-3 border border-gray-600 rounded-lg text-base font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors duration-300 group"
        >
          Learn More
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </motion.div>
      <motion.div variants={item} className="pt-4">
        <p className="text-sm text-gray-400 mb-2">Replaces</p>
        <div className="flex gap-4 text-2xl text-gray-500">
          <SiNotion />
          <SiVercel />
          <SiNetlify />
          <SiHeroku />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LeftSideBanner;