// src/app/projects/[slug]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

const ProjectDetailsPage = ({ params }) => {
    const { slug } = params;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects?slug=${slug}`);
                if (!response.ok) throw new Error('Failed to fetch project');
                const data = await response.json();
                if (!data.project) throw new Error('Project not found');
                setProject(data.project);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching project:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProject();
    }, [slug]);

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

    if (!project) {
        return (
            <div className="bg-gray-900 min-h-screen p-6 text-center text-white">
                Project not found.
            </div>
        );
    }

    const renderContentSection = (section, index) => {
        const Tag = section.tag || 'p';
        return (
            <div key={index} className="mb-6">
                <Tag className={`text-gray-200 ${Tag.startsWith('h') ? 'text-2xl sm:text-3xl font-semibold text-white mb-3' : 'text-base sm:text-lg'}`}>
                    {section.content}
                </Tag>
                {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="list-disc list-inside text-gray-300 mt-3 space-y-2">
                        {section.bulletPoints.map((point, idx) => (
                            <li key={idx} className="text-base sm:text-lg">{point}</li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-900 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
            <Head>
                <title>{project.title} | Ataullah Mesbah</title>
                <meta name="description" content={project.metaDescription} />
                <meta name="keywords" content={`${project.category}, ${project.title}, project portfolio`} />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content={project.title} />
                <meta property="og:description" content={project.metaDescription} />
                <meta property="og:image" content={project.mainImage} />
                <meta property="og:type" content="website" />
            </Head>
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 px-5 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition inline-flex items-center"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Projects
                </button>
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
                    {/* Main Image */}
                    <div className="relative h-72 sm:h-96 lg:h-[500px] mb-8 rounded-lg overflow-hidden">
                        <Image
                            src={project.mainImage}
                            alt={project.imageAlt}
                            layout="fill"
                            objectFit="cover"
                            className="w-full h-full"
                        />
                    </div>
                    {/* Title and Meta */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        {project.title}
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg mb-4 italic">
                        {project.metaDescription}
                    </p>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-300 mb-6">
                        {project.subtitle}
                    </h2>
                    {/* Views and Category */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <span className="text-gray-400 text-sm sm:text-base">
                            Views: {(project.views || 0).toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-sm sm:text-base">
                            Category: {project.category}
                        </span>
                    </div>
                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">Overview</h3>
                        <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                    {/* Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Gallery</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {project.gallery.map((image, idx) => (
                                    <div key={idx} className="relative h-48 sm:h-56 rounded-lg overflow-hidden">
                                        <Image
                                            src={image.url}
                                            alt={image.alt}
                                            layout="fill"
                                            objectFit="cover"
                                            className="w-full h-full transition-transform duration-300 hover:scale-105"
                                        />
                                        <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2 text-center">
                                            {image.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Additional Content */}
                    {project.content && project.content.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Additional Details</h3>
                            {project.content.map((section, index) => renderContentSection(section, index))}
                        </div>
                    )}
                    {/* Key Points */}
                    {project.keyPoints && project.keyPoints.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Key Points</h3>
                            <ul className="list-disc list-inside text-gray-200 space-y-2">
                                {project.keyPoints.map((point, idx) => (
                                    <li key={idx} className="text-base sm:text-lg">{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Website Features */}
                    {project.websiteFeatures && project.websiteFeatures.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Website Features</h3>
                            <ul className="list-disc list-inside text-gray-200 space-y-2">
                                {project.websiteFeatures.map((feature, idx) => (
                                    <li key={idx} className="text-base sm:text-lg">{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Support System */}
                    {project.supportSystem && (
                        <div className="mb-8">
                            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Support System</h3>
                            <p className="text-gray-200 text-base sm:text-lg">{project.supportSystem}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;