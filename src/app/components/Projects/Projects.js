// src/app/projects/page.js
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { FaArrowRight } from 'react-icons/fa'; // Import right arrow icon

const ProjectsPage = ({ projects: initialProjects = null }) => {
    const [projects, setProjects] = useState(initialProjects || []);
    const [loading, setLoading] = useState(!initialProjects);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 6; // Number of projects per page

    useEffect(() => {
        if (initialProjects) {
            setLoading(false);
            return;
        }

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
    }, [initialProjects]);

    // Pagination logic
    const totalProjects = projects.length;
    const totalPages = Math.ceil(totalProjects / projectsPerPage);
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const currentProjects = projects.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg text-center max-w-md mx-auto mt-10">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-800">
            <Head>
                <title>Projects | Ataullah Mesbah</title>
                <meta name="description" content="Explore our portfolio of projects including marketing, ecommerce, travel, blog, and personal portfolio websites." />
                <meta name="keywords" content="projects, portfolio, marketing, ecommerce, travel, blog, personal portfolio" />
                <meta name="robots" content="index, follow" />
            </Head>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 text-center tracking-tight">
                Our Projects
            </h1>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                Discover our diverse portfolio of projects, showcasing expertise in marketing, ecommerce, travel, blogs, and personal portfolios.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {currentProjects.map((project) => (
                    <div
                        key={project._id}
                        className="relative group bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:border-gray-600"
                    >
                        {/* Project Image */}
                        <div className="relative h-56 sm:h-64 w-full">
                            <Image
                                src={project.mainImage}
                                alt={project.imageAlt}
                                layout="fill"
                                objectFit="cover"
                                className="w-full h-full"
                            />
                        </div>
                        {/* Project Details */}
                        <div className="p-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 line-clamp-1">
                                {project.title}
                            </h2>
                            <p className="text-gray-400 text-sm sm:text-base line-clamp-2 mb-4">
                                {project.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-xs sm:text-sm">
                                    Category: {project.category}
                                </span>
                                <Link
                                    href={`/projects/${project.slug}`}
                                    className="flex items-center text-indigo-400 hover:text-indigo-300 transition duration-200"
                                >
                                    View Project
                                    <FaArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalProjects > projectsPerPage && (
                <div className="flex justify-center mt-12">
                    <nav className="flex space-x-3">
                        <div className="relative group">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${currentPage === 1 ? 'opacity-50' : ''}`}></div>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`relative px-6 py-3 bg-gray-900 rounded-lg font-medium text-white transition-colors ${currentPage === 1 ? 'cursor-not-allowed' : 'hover:text-gray-100'}`}
                            >
                                Previous
                            </button>
                        </div>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <div key={page} className="relative group">
                                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${currentPage === page ? 'opacity-100' : 'opacity-50'}`}></div>
                                <button
                                    onClick={() => handlePageChange(page)}
                                    className={`relative px-4 py-2 bg-gray-900 rounded-lg font-medium transition-colors ${currentPage === page ? 'text-white' : 'text-gray-400 hover:text-gray-100'}`}
                                >
                                    {page}
                                </button>
                            </div>
                        ))}
                        <div className="relative group">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${currentPage === totalPages ? 'opacity-50' : ''}`}></div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`relative px-6 py-3 bg-gray-900 rounded-lg font-medium text-white transition-colors ${currentPage === totalPages ? 'cursor-not-allowed' : 'hover:text-gray-100'}`}
                            >
                                Next
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;