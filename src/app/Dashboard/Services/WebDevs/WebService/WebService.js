'use client';

import { useEffect, useState } from "react";
import WebServiceDetails from "../WebServiceDetails/WebServiceDetails";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

const WebService = () => {
  const [serviceSections, setServiceSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/services/web-development', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();

        const groupedServices = data.map(section => ({
          title: section.category,
          services: section.services,
        }));

        setServiceSections(groupedServices);
      } catch (error) {
        console.error('Failed to fetch services data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
       
        

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-purple-500 text-4xl" />
          </div>
        ) : serviceSections.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-300 text-xl"
          >
            No services available at the moment.
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {serviceSections.map((section, index) => (
              <WebServiceDetails
                key={section.title}
                title={section.title}
                services={section.services}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default WebService;