// src/app/ProjectsTab.js
'use client';

import React, { useState, useEffect } from 'react';
import { LineWave } from 'react-loader-spinner';
import { FaSearch, FaCode, FaPen, FaPlane } from 'react-icons/fa';

import SEOPortfolio from '../PortfolioWorks/SEOPortfolio/SEOPortfolio';
import TravelPortfolio from '../PortfolioWorks/TravelPortfolio/TravelPortfolio';
import ContentPortfolio from '../PortfolioWorks/ContentPortfolio/ContentPortfolio';

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
        { label: 'SEO', icon: <FaSearch /> },
        { label: 'Web Development', icon: <FaCode /> },
        { label: 'Content Creator', icon: <FaPen /> },
        { label: 'Travel', icon: <FaPlane /> },
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
            <div className="flex flex-wrap justify-center mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => handleTabChange(tab.label)}
                        className={`flex items-center px-5 py-2 mx-2 my-1 rounded-md transition-colors duration-300 ${activeTab === tab.label
                            ? 'bg-indigo-950 text-white border-b-2 border-b-indigo-300 shadow-lg'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-800 border-t-indigo-300 border-t-2 shadow-lg'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
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