// src/app/projects/page.js
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { FaArrowRight, FaChevronDown, FaTimes } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FiPlay } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProjectsPage = ({ projects: initialProjects = null }) => {
    const [projects, setProjects] = useState(initialProjects || []);
    const [loading, setLoading] = useState(!initialProjects);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 6;
    const [expandedProject, setExpandedProject] = useState(null);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-quad'
        });

        // Set initial window width
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);

            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
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
                const sortedProjects = data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setProjects(sortedProjects);
            } catch (err) {
             
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [initialProjects]);

    // Get description based on screen size
    const getTruncatedDescription = (description) => {
        if (windowWidth < 640) { // Mobile
            return description.length > 100 ? `${description.substring(0, 100)}...` : description;
        } else if (windowWidth < 1024) { // Tablet
            return description.length > 200 ? `${description.substring(0, 200)}...` : description;
        } else { // Desktop
            return description.length > 300 ? `${description.substring(0, 300)}...` : description;
        }
    };

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
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-b border-gray-800 min-h-screen">
            <Head>
                <title>Projects | Ataullah Mesbah</title>
                <meta name="description" content="Explore our portfolio of projects including marketing, ecommerce, travel, blog, and personal portfolio websites." />
                <meta name="keywords" content="projects, portfolio, marketing, ecommerce, travel, blog, personal portfolio" />
                <meta name="robots" content="index, follow" />
            </Head>

            {/* Header Section */}
            <div className="max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl amsfonts text-white mb-4 sm:mb-6 text-center tracking-tight">
                    Professional Website Templates for any project
                </h1>
                <p className="text-center text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                    Discover our diverse portfolio of projects, showcasing expertise in marketing, ecommerce, travel, blogs, and personal portfolios.
                </p>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                    {currentProjects.map((project, index) => (
                        <div
                            key={project._id}
                            className="group bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:border-gray-600 hover:transform hover:-translate-y-1"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Project Image - Top on mobile, Left on desktop */}
                                {/* Fixed Image Container with 16:9 aspect ratio */}
                                <div className="lg:w-1/2 relative">
                                    <div className="aspect-[16/9] w-full relative overflow-hidden">
                                        <Image
                                            src={project.mainImage}
                                            alt={project.imageAlt}
                                            fill
                                            className="object-contain"
                                            quality={90}
                                            priority={index < 2}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        {/* Subtle gradient overlay for better text readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent lg:bg-gradient-to-r lg:from-gray-900/30 lg:to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                                    </div>
                                </div>

                                {/* Project Content - Bottom on mobile, Right on desktop */}
                                <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col">
                                    <div className="flex-grow">
                                        {/* Title */}
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl amsfonts text-white mb-3 sm:mb-4 lg:mb-6 line-clamp-2">
                                            {project.title}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8 leading-relaxed sm:leading-loose">
                                            {getTruncatedDescription(project.description)}
                                        </p>
                                    </div>

                                    {/* Footer with Category and Button */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-700/50">
                                        {/* Categories */}
                                        <div className="flex flex-wrap gap-2 sm:gap-3">
                                            {project.categories?.slice(0, 3).map((category) => (
                                                <span
                                                    key={category}
                                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-900/70 text-purple-100 rounded-full text-xs sm:text-sm font-medium"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                            {project.categories?.length > 3 && (
                                                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-700/60 text-gray-300 rounded-full text-xs sm:text-sm">
                                                    +{project.categories.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        {/* View Project Button */}
                                        <Link
                                            href={`/projects/${project.slug}`}
                                            className="group/btn relative bg-gray-900/80 backdrop-blur-md border border-gray-600/50 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:bg-gray-800/90 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/30 overflow-hidden w-full sm:w-auto"
                                        >
                                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-8 sm:h-10 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-r-full group-hover/btn:h-12 transition-all duration-300" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-indigo-500/20 to-blue-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                            <motion.div
                                                animate={{ rotate: [0, 10, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <FiPlay className="relative text-lg sm:text-xl group-hover/btn:scale-110 transition-transform duration-300" />
                                            </motion.div>
                                            <span className="relative text-sm sm:text-base">View Project</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Controls */}
            {totalProjects > projectsPerPage && (
                <div className="flex justify-center mt-12 sm:mt-16 px-4">
                    <nav className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        {/* Previous Button */}
                        <div className="relative group">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${currentPage === 1 ? 'opacity-50' : ''}`}></div>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`relative px-6 sm:px-8 py-3 bg-gray-900 rounded-lg font-medium text-white transition-colors text-sm sm:text-base ${currentPage === 1 ? 'cursor-not-allowed opacity-75' : 'hover:text-gray-100'}`}
                            >
                                Previous
                            </button>
                        </div>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <div key={page} className="relative group">
                                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${currentPage === page ? 'opacity-100' : 'opacity-50'}`}></div>
                                <button
                                    onClick={() => handlePageChange(page)}
                                    className={`relative px-4 sm:px-5 py-2 sm:py-3 bg-gray-900 rounded-lg font-medium transition-colors text-sm sm:text-base ${currentPage === page ? 'text-white' : 'text-gray-400 hover:text-gray-100'}`}
                                >
                                    {page}
                                </button>
                            </div>
                        ))}

                        {/* Next Button */}
                        <div className="relative group">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${currentPage === totalPages ? 'opacity-50' : ''}`}></div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`relative px-6 sm:px-8 py-3 bg-gray-900 rounded-lg font-medium text-white transition-colors text-sm sm:text-base ${currentPage === totalPages ? 'cursor-not-allowed opacity-75' : 'hover:text-gray-100'}`}
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