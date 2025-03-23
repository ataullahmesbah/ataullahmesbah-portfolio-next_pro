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
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg text-center">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <Head>
                <title>Projects | Ataullah Mesbah</title>
                <meta name="description" content="Explore our portfolio of projects including marketing, ecommerce, travel, blog, and personal portfolio websites." />
                <meta name="keywords" content="projects, portfolio, marketing, ecommerce, travel, blog, personal portfolio" />
                <meta name="robots" content="index, follow" />
            </Head>
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Our Projects</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        {/* Project Image */}
                        <div className="relative h-48">
                            <Image
                                src={project.mainImage}
                                alt={project.imageAlt}
                                layout="fill"
                                objectFit="cover"
                                className="w-full h-full"
                            />
                        </div>
                        {/* Project Title */}
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                            {/* Short Description */}
                            <p className="text-gray-400 mt-2">
                                {project.description.slice(0, 80)}...
                                <Link href={`/projects/${project.slug}`} className="text-blue-500 hover:underline ml-1">
                                    See More
                                </Link>
                            </p>
                            {/* View Project Button */}
                            <Link href={`/projects/${project.slug}`}>
                                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                    View Project
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsPage;