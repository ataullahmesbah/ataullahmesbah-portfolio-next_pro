'use client';

import React, { useState } from 'react';
import SEOTabs from '../../Home/SEOTabs/SEOTabs';
import WebTabs from '../../Home/WebTabs/WebTabs';



const PortfolioTabs = () => {
    const [activeTab, setActiveTab] = useState('SEO');

    const renderContent = () => {
        switch (activeTab) {
            case 'SEO':
                return <SEOTabs />;
            case 'Web Development':
                return <WebTabs />;
            case 'Travel':
            // return <Travel />;
            case 'Sports':
            // return <Sports />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap justify-center mb-4 ">
                {['SEO', 'Web Development', 'Travel', 'Sports'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 mx-2 my-1 rounded-md transition-colors duration-300 ${activeTab === tab ? 'bg-sky-800  text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-3">
                {renderContent()}
            </div>
        </div>
    );
};

export default PortfolioTabs;
