'use client';

import { useEffect, useState } from 'react';
import SEOServiceDetails from '../SEOServiceDetails/SEOServiceDetails';
import { motion } from 'framer-motion';

const SEOService = () => {
    const [serviceSections, setServiceSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/services/seo', { cache: 'no-store' });
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();

                // Ensure images have full URLs if they're relative paths
                const groupedServices = data.map(section => ({
                    title: section.category,
                    services: section.services.map(service => ({
                        ...service,
                        image: service.image.startsWith('/') 
                            ? `${window.location.origin}${service.image}`
                            : service.image
                    })),
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-purple-200 text-lg">Loading SEO Services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                        Our SEO Services
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Comprehensive solutions to boost your online visibility and drive organic growth
                    </p>
                </motion.div>

                {serviceSections.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No services available at the moment</p>
                    </div>
                ) : (
                    serviceSections.map((section, index) => (
                        <SEOServiceDetails
                            key={section.title}
                            title={section.title}
                            services={section.services}
                            index={index}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default SEOService;