// src/app/projects/page.js
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                setProjects(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

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
        <div className="bg-gray-900 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
            <Head>
                <title>Projects | Ataullah Mesbah</title>
                <meta name="description" content="Explore our portfolio of projects including marketing, ecommerce, travel, blog, and personal portfolio websites." />
                <meta name="keywords" content="projects, portfolio, marketing, ecommerce, travel, blog, personal portfolio" />
                <meta name="robots" content="index, follow" />
            </Head>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-12 text-center tracking-tight">
                Our Projects
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {projects.map((project) => (
                    <div
                        key={project._id}
                        className="relative group bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        {/* Project Image */}
                        <div className="relative h-56 sm:h-64 w-full">
                            <Image
                                src={project.mainImage}
                                alt={project.imageAlt}
                                layout="fill"
                                objectFit="cover"
                                className="w-full h-full transition-opacity duration-300 group-hover:opacity-80"
                            />
                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <Link href={`/projects/${project.slug}`}>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                                        View Project
                                    </button>
                                </Link>
                            </div>
                        </div>
                        {/* Project Details */}
                        <div className="p-5">
                            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 line-clamp-1">
                                {project.title}
                            </h2>
                            <p className="text-gray-400 text-sm sm:text-base line-clamp-2 mb-3">
                                {project.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-xs sm:text-sm">
                                    Category: {project.category}
                                </span>
                                <Link href={`/projects/${project.slug}`} className="text-blue-400 text-sm hover:underline">
                                    See More
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsPage;