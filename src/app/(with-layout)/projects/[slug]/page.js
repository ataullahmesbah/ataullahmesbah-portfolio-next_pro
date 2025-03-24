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
    const [activeGalleryImage, setActiveGalleryImage] = useState(0);
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
        const baseSize = {
            'h1': 'text-3xl sm:text-4xl',
            'h2': 'text-2xl sm:text-3xl',
            'h3': 'text-xl sm:text-2xl',
            'h4': 'text-lg sm:text-xl',
            'h5': 'text-base sm:text-lg',
            'h6': 'text-sm sm:text-base',
            'p': 'text-base sm:text-lg'
        }[Tag];

        return (
            <section key={index} className="mb-8">
                <Tag className={`${baseSize} font-medium text-white mb-4`}>
                    {section.content}
                </Tag>
                {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="space-y-2 pl-5">
                        {section.bulletPoints.map((point, idx) => (
                            <li key={idx} className="relative text-gray-300 before:content-['•'] before:absolute before:-left-5 before:text-blue-400">
                                {point}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        );
    };

    return (
        <div className="bg-gray-900 min-h-screen border-b border-gray-800 py-7">
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

            {/* Back Button - Sticky at top */}
            <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm py-3 px-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-300 hover:text-white transition-colors"
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
            </div>

            <main className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 poppins-regular">
                {/* Hero Section */}
                <div className="mb-12">
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                        <Image
                            src={project.mainImage}
                            alt={project.imageAlt}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-4 items-center">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                {project.category}
                            </span>
                            <span className="text-gray-400 text-sm">
                                {(project.views || 0).toLocaleString()} views
                            </span>
                        </div>

                        <h1 className="text-xl sm:text-3xl font-semibold text-white leading-tight">
                            {project.title}
                        </h1>
                        <p className='text-white'>{project.metaDescription}</p>

                        <h2 className="text-xl sm:text-2xl text-gray-300">
                            {project.subtitle}
                        </h2>
                        <p className='text-white'>{project.contentShort}</p>
                    </div>
                </div>

                {/* Project Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6">Project Overview</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                        </section>

                        {/* Content Sections */}
                        {project.content && project.content.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6">Project Details</h2>
                                <div className="space-y-8">
                                    {project.content.map((section, index) => renderContentSection(section, index))}
                                </div>
                            </section>
                        )}

                        {/* Key Features */}
                        {project.keyPoints && project.keyPoints.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-white mb-6">Key Features</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {project.keyPoints.map((point, idx) => (
                                        <li key={idx} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                            <div className="flex items-start">
                                                <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                <span className="text-gray-300">{point}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Gallery */}
                        {project.gallery && project.gallery.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">Gallery</h2>
                                <div className="space-y-4">
                                    {/* Main Gallery Image */}
                                    <div className="relative aspect-square rounded-lg overflow-hidden">
                                        <Image
                                            src={project.gallery[activeGalleryImage].url}
                                            alt={project.gallery[activeGalleryImage].alt}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Thumbnail Grid */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {project.gallery.map((image, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveGalleryImage(idx)}
                                                className={`relative aspect-square rounded overflow-hidden transition-opacity ${activeGalleryImage === idx ? 'ring-2 ring-blue-400' : 'opacity-70 hover:opacity-100'}`}
                                            >
                                                <Image
                                                    src={image.url}
                                                    alt={image.alt}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Website Features */}
                        {project.websiteFeatures && project.websiteFeatures.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">Technical Highlights</h2>
                                <ul className="space-y-3">
                                    {project.websiteFeatures.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Support System */}
                        {project.supportSystem && (
                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">Support</h2>
                                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                    <p className="text-gray-300">{project.supportSystem}</p>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetailsPage;