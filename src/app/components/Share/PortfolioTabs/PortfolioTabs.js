'use client';

import React, { useState, useEffect } from 'react';
import SEOTabs from '../../Home/SEOTabs/SEOTabs';
import WebTabs from '../../Home/WebTabs/WebTabs';
import TravelTabs from '../../Home/TravelTabs/TravelTabs';
import SportsTabs from '../../Home/SportsTabs/SportsTabs';
import { LineWave } from 'react-loader-spinner'; // Import the loader

const PortfolioTabs = () => {
    const [activeTab, setActiveTab] = useState('SEO');
    const [loading, setLoading] = useState(false); // State to manage loader

    const renderContent = () => {
        switch (activeTab) {
            case 'SEO':
                return <SEOTabs />;
            case 'Web Development':
                return <WebTabs />;
            case 'Travel':
                return <TravelTabs />;
            case 'Sports':
                return <SportsTabs />;
            default:
                return null;
        }
    };

    // Handle tab switching and loader
    const handleTabChange = (tab) => {
        setLoading(true); // Show loader
        setActiveTab(tab);
        // Simulate loading effect with a small delay
        setTimeout(() => {
            setLoading(false); // Hide loader after content is ready
        }, 1000); // Adjust duration as needed
    };

    return (
        <div className="max-w-7xl mx-auto py-10 poppins-regular">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap justify-center mb-4">
                {['SEO', 'Web Development', 'Travel', 'Sports'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-6 py-2 mx-2 my-1 rounded-md transition-colors duration-300 ${activeTab === tab ? 'bg-black text-indigo-400 hover:text-gray-100 transition duration-200 border-b border-b-pink-400 shadow-md shadow-pink-400' : 'bg-gray-800 border-b border-gray-500  text-gray-200 shadow-md  shadow-purple-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content or Loader */}
            <div className="p-3">
                {loading ? (
                    // Show the loader while content is loading
                    <div className="flex justify-center items-center h-60">
                        <LineWave
                            visible={true}
                            height="100"
                            width="100"
                            color="#4fa94d"
                            ariaLabel="line-wave-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            firstLineColor="green"
                            middleLineColor="sky"
                            lastLineColor="red"
                        />
                    </div>
                ) : (
                    // Render the tab content once loading is finished
                    renderContent()
                )}
            </div>
        </div>
    );
}

export default PortfolioTabs;
