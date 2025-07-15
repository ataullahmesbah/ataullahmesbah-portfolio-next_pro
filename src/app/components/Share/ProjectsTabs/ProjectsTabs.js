'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { RiArrowRightDoubleLine } from "react-icons/ri";

const ProjectsTabs = ({ projects: initialProjects = null }) => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialProjects) {
            setProjects(initialProjects.slice(0, 3));
            return;
        }

        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();

                const sortedProjects = data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                ).slice(0, 3);

                setProjects(sortedProjects);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err.message);
            }
        };

        fetchProjects();
    }, [initialProjects]);

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg text-center max-w-md mx-auto mt-10">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-12 poppins-regular">
            <Head>
                <title>Projects Preview | Ataullah Mesbah</title>
                <meta name="description" content="A preview of our portfolio projects" />
            </Head>
            
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-10 text-center">
                    Project Highlights
                </h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:shadow-lg"
                        >
                            {/* Project Image - Full Display */}
                            <div className="relative h-48 w-full">
                                <Image
                                    src={project.mainImage}
                                    alt={project.imageAlt}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    quality={100}
                                    priority={true}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            </div>
                            
                            {/* Project Details */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <h2 className="text-lg font-semibold text-white line-clamp-1">
                                        {project.title}
                                    </h2>
                                    <span className="px-2 py-1 bg-purple-900/50 text-purple-100 rounded-full text-xs">
                                        {project.category}
                                    </span>
                                </div>
                                
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>
                                
                                <Link 
                                    href={`/projects/${project.slug}`}
                                    className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                                >
                                    View Project
                                    <RiArrowRightDoubleLine className="ml-2 w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-12 text-center">
                    <Link
                        href="/projects"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
                    >
                        Explore All Projects
                        <RiArrowRightDoubleLine className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectsTabs;