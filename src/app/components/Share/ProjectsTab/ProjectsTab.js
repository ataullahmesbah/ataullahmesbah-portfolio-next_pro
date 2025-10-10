'use client';

import React, { useState, useEffect } from 'react';
import { LineWave } from 'react-loader-spinner';
import { FaSearch, FaCode, FaPen, FaPlane } from 'react-icons/fa';
import { FiPlay } from 'react-icons/fi';
import SEOPortfolio from '../PortfolioWorks/SEOPortfolio/SEOPortfolio';
import TravelPortfolio from '../PortfolioWorks/TravelPortfolio/TravelPortfolio';
import ContentPortfolio from '../PortfolioWorks/ContentPortfolio/ContentPortfolio';
import { motion } from 'framer-motion';
import ProjectsTabs from '../ProjectsTabs/ProjectsTabs';

const ProjectsTab = () => {
    const [activeTab, setActiveTab] = useState('Web Development');
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                setProjects(data);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const tabs = [
        { label: 'Web Development', icon: <FaCode className="text-lg" /> },
        { label: 'SEO', icon: <FaSearch className="text-lg" /> },
        { label: 'Content Creator', icon: <FaPen className="text-lg" /> },
        { label: 'Travel', icon: <FaPlane className="text-lg" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Web Development':
                return <ProjectsTabs />;

            case 'SEO':
                return <SEOPortfolio />;

            case 'Content Creator':
                return <ContentPortfolio />;
            case 'Travel':
                return <TravelPortfolio />;
            default:
                return null;
        }
    };

    const handleTabChange = (tab) => {
        setLoading(true);
        setActiveTab(tab);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    if (error) {
        return (
            <div className="text-center text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10">
            <h2 className="text-3xl text-center font-semibold mb-6 text-gray-300">Why Work with Me?</h2>
            <p className="text-center mb-10 text-gray-200">
                Explore my portfolio and see why top brands choose to work with me.
            </p>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap justify-center mb-8 gap-2 sm:gap-3 md:gap-4">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.label}
                        onClick={() => handleTabChange(tab.label)}
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex items-center px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-xl transition-all duration-300 ${activeTab === tab.label ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                    >
                        {/* Active tab background with static gradient */}
                        {activeTab === tab.label && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-cyan-400/15 to-purple-500/15 backdrop-blur-md rounded-xl z-0 border border-gray-700/30"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}

                        {/* Inactive tab background with glass effect */}
                        {activeTab !== tab.label && (
                            <div className="absolute inset-0 bg-gray-800/40 backdrop-blur-md rounded-xl z-0 opacity-80 hover:opacity-100 transition-opacity" />
                        )}

                        {/* Animated icon for active tab */}
                        {activeTab === tab.label && (
                            <motion.div
                                animate={{ rotate: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10 mr-1.5"
                            >
                                <FiPlay className="text-cyan-300 text-sm sm:text-base" />
                            </motion.div>
                        )}

                        <span className="relative z-10 flex items-center gap-1.5 text-xs sm:text-sm md:text-base">
                            <span className={activeTab === tab.label ? 'text-cyan-300' : 'text-gray-400'}>
                                {tab.icon}
                            </span>
                            {tab.label}
                        </span>

                        {/* Glowing accent bar on hover for inactive tabs */}
                        {activeTab !== tab.label && (
                            <motion.div
                                initial={{ width: 0 }}
                                whileHover={{ width: '100%' }}
                                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400/30 to-purple-500/30 rounded-t"
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Tab Content or Loader */}
            <div className="p-4 rounded-lg">
                {loading ? (
                    <div className="flex justify-center items-center h-60">
                        <LineWave
                            visible={true}
                            height="100"
                            width="100"
                            color="#4fa94d"
                            ariaLabel="line-wave-loading"
                            firstLineColor="green"
                            middleLineColor="sky"
                            lastLineColor="red"
                        />
                    </div>
                ) : (
                    renderContent()
                )}
            </div>
        </div>
    );
};

export default ProjectsTab;