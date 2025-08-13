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
        { id: 'SEO', label: 'SEO Work' },
        { id: 'Web', label: 'Web Projects' },
        { id: 'Content', label: 'Content' },
        { id: 'Travel', label: 'Travel' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'SEO': return <SEOTabs />;
            case 'Web': return <WebTabs />;
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
                    <div className="flex flex-wrap justify-center space-x-1 space-y-1 sm:bg-gray-800 sm:rounded-lg w-max max-w-full mx-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md flex-shrink-0 sm:px-4 ${activeTab === tab.id
                                        ? 'bg-gray-700 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                                style={{
                                    minWidth: 'max-content',
                                }}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-purple-500 to-purple-700 rounded-t-full"
                                        transition={{ duration: 0.25 }}
                                    />
                                )}
                            </button>
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