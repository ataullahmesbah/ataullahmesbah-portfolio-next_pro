'use client';

import React, { useState } from 'react';
import SEOTabs from '../../Home/SEOTabs/SEOTabs';
import WebTabs from '../../Home/WebTabs/WebTabs';
import { motion, AnimatePresence } from 'framer-motion';
import { LineWave } from 'react-loader-spinner';
import ContentPortfolio from '../PortfolioWorks/ContentPortfolio/ContentPortfolio';
import TravelPortfolio from '../PortfolioWorks/TravelPortfolio/TravelPortfolio';
import useAOS from '../../hooks/useAOS';

const PortfolioTabs = () => {
    const [activeTab, setActiveTab] = useState('SEO');
    const [loading, setLoading] = useState(false);
    useAOS({ duration: 1000 });

    const tabs = [
        { id: 'Web', label: 'Web Projects' },
        { id: 'SEO', label: 'SEO Work' },
        { id: 'Content', label: 'Content' },
        { id: 'Travel', label: 'Travel' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Web': return <WebTabs />;
            case 'SEO': return <SEOTabs />;
            case 'Content': return <ContentPortfolio />;
            case 'Travel': return <TravelPortfolio />;
            default: return null;
        }
    };

    const handleTabChange = (tab) => {
        setLoading(true);
        setActiveTab(tab);
        setTimeout(() => setLoading(false), 300);
    };

    return (
        <div
            data-aos="fade-up"
            className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Tabs Navigation - Fully Responsive Dark Purple Theme */}
            <div className="w-full mb-8">
                <div className="relative">
                    {/* Tabs container with wrapping and centered alignment */}
                    <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2 md:space-x-3 space-y-1 sm:bg-transparent w-max max-w-full mx-auto">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                whileHover={{ y: -2, scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative flex items-center px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full transition-all duration-300 ${activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                {/* Active tab background with gradient and glow */}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute inset-0 bg-gradient-to-r from-purple-700/20 to-teal-600/20 backdrop-blur-md rounded-full z-0 border border-purple-700/30"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute inset-1 bg-purple-700/10 rounded-full"
                                        />
                                    </motion.div>
                                )}

                                {/* Inactive tab background with glass effect */}
                                {activeTab !== tab.id && (
                                    <div className="absolute inset-0 bg-gray-800/30 backdrop-blur-md rounded-full z-0 opacity-80 hover:opacity-100 transition-opacity" />
                                )}

                                {/* Pulsing dot for active tab */}
                                {activeTab === tab.id && (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative z-10 mr-2 w-2 h-2 bg-teal-500 rounded-full"
                                    />
                                )}

                                <span className="relative z-10 text-xs sm:text-sm md:text-base font-medium">
                                    {tab.label}
                                </span>

                                {/* Sliding underline on hover for inactive tabs */}
                                {activeTab !== tab.id && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileHover={{ width: '100%' }}
                                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500/30 to-teal-500/30 rounded-full"
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Optional: Mobile indicator (only shows on small screens if needed) */}
                    <div className="lg:hidden mt-2 text-center">
                        <span className="inline-block h-1 w-8 bg-purple-600 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Tab Content - Dark Container */}
            <div className="min-h-[500px] p-4 sm:p-6">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center items-center h-64"
                        >
                            <LineWave
                                height="80"
                                width="80"
                                color="#8B5CF6"
                                ariaLabel="loading"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PortfolioTabs;