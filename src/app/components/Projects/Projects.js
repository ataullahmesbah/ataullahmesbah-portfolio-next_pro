// src/app/projects/page.js
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { FaArrowRight, FaChevronDown, FaTimes } from 'react-icons/fa'; // Import right arrow icon
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FiPlay } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProjectsPage = ({ projects: initialProjects = null }) => {
    const [projects, setProjects] = useState(initialProjects || []);
    const [loading, setLoading] = useState(!initialProjects);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 6; // Number of projects per page
    const [expandedProject, setExpandedProject] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-quad'
        });
    }, []);

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
                // Sort projects by createdAt date (newest first)
                const sortedProjects = data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setProjects(sortedProjects);
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
            <h1 className="text-3xl sm:text-4xl amsfonts text-white mb-6 text-center tracking-tight">
                Professional Website Templates for any project
            </h1>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                Discover our diverse portfolio of projects, showcasing expertise in marketing, ecommerce, travel, blogs, and personal portfolios.
            </p>

            <div className="max-w-5xl mx-auto space-y-6">
                {currentProjects.map((project, index) => (
                    <div
                        key={project._id}
                        className="relative group bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:border-gray-600"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="flex flex-col lg:flex-row h-full">
                            {/* Project Image - Left Side (Full Height) */}
                            <div className="lg:w-1/2 relative h-64 lg:h-auto">
                                <Image
                                    src={project.mainImage}
                                    alt={project.imageAlt}
                                    fill
                                    className="object-cover w-full h-full"
                                    quality={100}
                                    priority={index < 2}
                                />
                            </div>

                            {/* Project Content - Right Side */}
                            <div className="lg:w-1/2 p-6 flex flex-col">
                                <div className="flex-grow">
                                    {/* Title */}
                                    <h2 className="text-xl amsfonts text-white mb-3">
                                        {project.title}
                                    </h2>
                                    {/* Description with responsive character limit */}
                                    <p className="text-gray-400 text-sm mb-4">
                                        {typeof window !== 'undefined' && window.innerWidth < 768
                                            ? project.description.length > 120
                                                ? `${project.description.substring(0, 120)}...`
                                                : project.description
                                            : project.description.length > 420
                                                ? `${project.description.substring(0, 420)}...`
                                                : project.description
                                        }
                                    </p>
                                </div>

                                {/* Footer with Category and Button */}
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700/50">
                                    {/* Category in purple pill */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.categories?.map((category) => (
                                            <span
                                                key={category}
                                                className="px-3 py-1 bg-purple-900/60 text-purple-100 rounded-full text-xs"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                    {/* View Project Button */}

                                    <Link
                                        href={`/projects/${project.slug}`}
                                        className="group relative bg-gray-900/60 backdrop-blur-md border border-gray-600/30 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-gray-800/80 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-400/20 overflow-hidden w-fit"
                                    >
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-r-full group-hover:h-10 transition-all duration-300" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <motion.div
                                            animate={{ rotate: [0, 10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <FiPlay className="relative group-hover:scale-110 transition-transform duration-300" />
                                        </motion.div>
                                        <span className="relative text-sm">View</span>
                                    </Link>

                                    {/* View Project Button */}

                                </div>
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