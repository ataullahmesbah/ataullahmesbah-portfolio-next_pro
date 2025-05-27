'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SEO from '/public/images/SEO.webp';
import SEO1 from '/public/images/seo/analytics.jpg';

// Animation variants for staggered effects
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(147, 51, 234, 0.4)" },
};

const SEOPortfolio = () => {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-purple-400 font-semibold text-sm uppercase tracking-widest">
            SEO Mastery
          </span>
          {/* <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mt-4 leading-tight">
            Optimize Your <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">Success</span>
          </h2> */}
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto mt-6 mb-8 rounded-full" />
        
        </motion.div>

        {/* Portfolio Showcase */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col md:flex-row justify-center items-start gap-8"
        >
          {/* Image 1 - SEO Dashboard */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="w-full md:w-1/2 relative rounded-lg overflow-hidden shadow-lg shadow-blue-500/20"
          >
            <Image
              src={SEO}
              alt="Ahrefs Keyword Research Dashboard"
              placeholder="blur"
              width={600}
              height={400}
              className="rounded-lg w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white text-sm font-semibold">
                Keyword research and competitor analysis using Ahrefs.
              </p>
            </div>
          </motion.div>

          {/* Image 2 - Analytics */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="w-full md:w-1/2 relative rounded-lg overflow-hidden shadow-lg shadow-blue-500/20"
          >
            <Image
              src={SEO1}
              alt="Semrush Website Traffic Analytics"
              placeholder="blur"
              width={600}
              height={400}
              className="rounded-lg w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white text-sm font-semibold">
                Traffic growth and performance tracking with Semrush.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Metrics and CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-purple-400">50%+</h3>
              <p className="text-gray-300">Ranking Improvements</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-purple-400">2x</h3>
              <p className="text-gray-300">Organic Traffic Growth</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-purple-400">100+</h3>
              <p className="text-gray-300">Keywords Optimized</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg group overflow-hidden"
          >
            <span className="absolute inset-0 bg-white opacity-10 transform -skew-x-12 group-hover:skew-x-12 transition-transform duration-1000" />
            <span className="relative font-semibold text-lg">
              Boost Your SEO Today
            </span>
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SEOPortfolio;