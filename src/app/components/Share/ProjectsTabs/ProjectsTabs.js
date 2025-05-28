// src/app/projects-tabs/page.js
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { RiArrowRightDoubleLine } from "react-icons/ri";

const ProjectsTabs = ({ projects: initialProjects = null }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If projects are provided as a prop, use them (though in this case, we won't use this)
        if (initialProjects) {
            setProjects(initialProjects.slice(0, 3)); // Slice to 3 if prop is provided
            setLoading(false);
            return;
        }

        // Fetch projects from API
        // Update the fetchProjects function in your useEffect hook
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();

                // Sort projects by date (newest first) before slicing
                const sortedProjects = data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                ).slice(0, 3); // Get first 3 newest projects

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
        <div className=" px-4 sm:px-6 lg:px-8 py-7 poppins-regular">
            <Head>
                <title>Projects Preview | Ataullah Mesbah</title>
                <meta name="description" content="A preview of our portfolio projects including marketing, ecommerce, travel, blog, and personal portfolio websites." />
                <meta name="keywords" content="projects, portfolio, marketing, ecommerce, travel, blog, personal portfolio" />
                <meta name="robots" content="index, follow" />
            </Head>
            <h1 className="text-2xl sm:text-2xl font-extrabold text-white mb-12 text-center tracking-tight">
                Project Highlights
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
                            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <Link href={`/projects/${project.slug}`}>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                                        View Project
                                    </button>
                                </Link>
                            </div> */}
                        </div>
                        {/* Project Details */}
                        <div className="p-5">
                            <h2 className="text-xl sm:text-xl text-white mb-2 line-clamp-1">
                                {project.title}
                            </h2>
                            <p className="text-gray-400 text-sm sm:text-base line-clamp-2 mb-3">
                                {project.metaDescription}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-xs sm:text-sm">
                                    Category: {project.category}
                                </span>
                                <Link href={`/projects/${project.slug}`} className="text-purple-400 text-sm hover:text-purple-700 flex gap-2 items-center">
                                    <RiArrowRightDoubleLine /> View Project
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Projects Button */}


            <div className="py-8">
                <div className="grid gap-8 justify-center items-center">
                    <div className="relative group">

                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <button
                            type="submit"
                            className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center">

                            <Link href="/projects"

                                className=" text-indigo-400 group-hover:text-gray-100 transition duration-200">View All Projects
                            </Link>
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ProjectsTabs;