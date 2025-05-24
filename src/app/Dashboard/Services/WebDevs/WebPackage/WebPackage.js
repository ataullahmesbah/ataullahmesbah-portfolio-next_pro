'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const WebPackage = () => {
  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/services/web-development/webpack', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setPackagesData(data);
      } catch (error) {
        console.error('Error fetching packages data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-10 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-12"
        >
          Web Development Packages
        </motion.h1>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gray-800/50 h-96 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : packagesData.length === 0 ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-300 text-lg"
          >
            No packages available at the moment.
          </motion.p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {packagesData.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex flex-col h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group"
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-8 flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{pkg.name}</h2>
                  <p className="text-gray-300 mb-6">{pkg.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-start"
                      >
                        <FaCheckCircle className="text-purple-400 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="px-8 pb-8">
                  <div className="flex items-end mb-6">
                    <p className="text-3xl font-bold text-white mr-3">${pkg.discount.toLocaleString()}</p>
                    {pkg.discount < pkg.price && (
                      <p className="text-gray-400 line-through">${pkg.price.toLocaleString()}</p>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      href="/contact" 
                      className="
                        w-full block text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 
                        text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 
                        transition-all duration-300 shadow-lg hover:shadow-purple-500/30
                      "
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WebPackage;