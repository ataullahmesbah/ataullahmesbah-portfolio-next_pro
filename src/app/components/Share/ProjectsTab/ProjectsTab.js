'use client';

import React, { useState } from 'react';
import { LineWave } from 'react-loader-spinner';

// Import icons from React Icons
import { FaSearch, FaCode, FaPen, FaPlane, FaFutbol } from 'react-icons/fa';


import WebTabs from '../../Home/WebTabs/WebTabs';
import TravelTabs from '../../Home/TravelTabs/TravelTabs';
import SportsTabs from '../../Home/SportsTabs/SportsTabs';
import SEOPortfolio from '../SEOPortfolio/SEOPortfolio';

const ProjectsTab = () => {
    const [activeTab, setActiveTab] = useState('SEO');
    const [loading, setLoading] = useState(false);

    // Define an array of tabs with labels and icons
    const tabs = [
        { label: 'SEO', icon: <FaSearch /> },
        { label: 'Web Development', icon: <FaCode /> },
        { label: 'Content Creator', icon: <FaPen /> },
        { label: 'Travel', icon: <FaPlane /> },
        { label: 'Sports', icon: <FaFutbol /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'SEO':
                return <SEOPortfolio />;
            case 'Web Development':
                return <WebTabs />;
            case 'Content Creator':
                return <WebTabs />;
            case 'Travel':
                return <TravelTabs />;
            case 'Sports':
                return <SportsTabs />;
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

    return (
        <div className="max-w-7xl mx-auto py-10">
            <h2 className="text-3xl text-center font-semibold mb-6">Why Work with Me?</h2>
            <p className="text-center mb-10 text-gray-500">
                Explore my portfolio and see why top brands choose to work with me.
            </p>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap justify-center mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => handleTabChange(tab.label)}
                        className={`flex items-center px-5 py-2 mx-2 my-1 rounded-md transition-colors duration-300 ${activeTab === tab.label
                            ? 'bg-pink-500 text-white border-b-2 border-b-pink-700 shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span> {/* Tab icon */}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content or Loader */}
            <div className="p-4  rounded-lg">
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
}

export default ProjectsTab;
