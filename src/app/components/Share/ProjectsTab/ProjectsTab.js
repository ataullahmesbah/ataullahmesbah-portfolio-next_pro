// src/app/ProjectsTab.js
'use client';

import React, { useState, useEffect } from 'react';
import { LineWave } from 'react-loader-spinner';
import { FaSearch, FaCode, FaPen, FaPlane } from 'react-icons/fa';

import SEOPortfolio from '../PortfolioWorks/SEOPortfolio/SEOPortfolio';
import TravelPortfolio from '../PortfolioWorks/TravelPortfolio/TravelPortfolio';
import ContentPortfolio from '../PortfolioWorks/ContentPortfolio/ContentPortfolio';
import { motion } from 'framer-motion'
import ProjectsTabs from '../ProjectsTabs/ProjectsTabs';


const ProjectsTab = () => {
    const [activeTab, setActiveTab] = useState('SEO');
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    // Fetch projects when the component mounts
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

    // Define an array of tabs with labels and icons
    const tabs = [
        { label: 'SEO', icon: <FaSearch className="text-lg" /> },
        { label: 'Web Development', icon: <FaCode className="text-lg" /> },
        { label: 'Content Creator', icon: <FaPen className="text-lg" /> },
        { label: 'Travel', icon: <FaPlane className="text-lg" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'SEO':
                return <SEOPortfolio />;
            case 'Web Development':
                // Pass only the first 3 projects to ProjectsPage
                return <ProjectsTabs />;
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
           {/* // In your JSX replace the tabs navigation with this: */}
            <div className="flex flex-wrap justify-center mb-8 gap-2 sm:gap-4">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.label}
                        onClick={() => handleTabChange(tab.label)}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-all duration-300 ${activeTab === tab.label
                                ? 'text-white'
                                : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        {/* Animated background for active tab */}
                        {activeTab === tab.label && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg z-0"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}

                        {/* Inactive tab background */}
                        {activeTab !== tab.label && (
                            <div className="absolute inset-0 bg-gray-800 rounded-lg z-0 opacity-80 hover:opacity-100 transition-opacity" />
                        )}

                        <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
                            <span className="text-indigo-300">
                                {tab.icon}
                            </span>
                            {tab.label}
                        </span>

                        {/* Glow effect on hover */}
                        {activeTab !== tab.label && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg blur-md"
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