'use client';

import React, { useState } from 'react';
import SEOTabs from '../../Home/SEOTabs/SEOTabs';
import WebTabs from '../../Home/WebTabs/WebTabs';
import { motion, AnimatePresence } from 'framer-motion';
import { LineWave } from 'react-loader-spinner';
import ContentPortfolio from '../PortfolioWorks/ContentPortfolio/ContentPortfolio';
import TravelPortfolio from '../PortfolioWorks/TravelPortfolio/TravelPortfolio';

const PortfolioTabs = () => {
    const [activeTab, setActiveTab] = useState('SEO');
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 'SEO', label: 'SEO' },
        { id: 'Web', label: 'Web Dev' },
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
        setTimeout(() => setLoading(false), 500);
    };

    return (
        <div className="max-w-7xl mx-auto py-6 md:py-10 poppins-regular px-4">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap justify-center mb-6 gap-2 md:gap-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`relative px-4 py-2 mx-1 rounded-md transition-all duration-300 text-sm md:text-base ${
                            activeTab === tab.id 
                                ? 'bg-black text-indigo-300 border-b-2 border-pink-400 shadow-md shadow-pink-400/50' 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700/80 border-b border-gray-600'
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-400"
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-2 md:p-4 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center items-center h-60"
                        >
                            <LineWave
                                height="80"
                                width="80"
                                color="#ec4899"
                                ariaLabel="loading"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default PortfolioTabs;