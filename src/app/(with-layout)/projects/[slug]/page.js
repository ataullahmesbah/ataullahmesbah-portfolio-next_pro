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
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg text-center">
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
            <div key={index} className="mb-4">
                <Tag className={`text-gray-300 ${Tag.startsWith('h') ? 'text-xl font-semibold' : ''}`}>
                    {section.content}
                </Tag>
                {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="list-disc list-inside text-gray-300 mt-2">
                        {section.bulletPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <Head>
                <title>{project.title} | Your Website Name</title>
                <meta name="description" content={project.metaDescription} />
                <meta name="keywords" content={`${project.category}, ${project.title}, project portfolio`} />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content={project.title} />
                <meta property="og:description" content={project.metaDescription} />
                <meta property="og:image" content={project.mainImage} />
                <meta property="og:type" content="website" />
            </Head>
            <button
                onClick={() => router.back()}
                className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
                Back to Projects
            </button>
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
                {/* Main Image */}
                <div className="relative h-96 mb-6">
                    <Image
                        src={project.mainImage}
                        alt={project.imageAlt}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
                {/* Title and Subtitle */}
                <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                <h2 className="text-xl text-gray-400 mb-4">{project.subtitle}</h2>
                {/* Views */}
                <p className="text-gray-400 mb-4">Views: {(project.views || 0).toLocaleString()}</p>
                {/* Description */}
                <p className="text-gray-300 mb-6">{project.description}</p>
                {/* Additional Content */}
                {project.content && project.content.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Additional Details</h3>
                        {project.content.map((section, index) => renderContentSection(section, index))}
                    </div>
                )}
                {/* Key Points */}
                {project.keyPoints && project.keyPoints.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Key Points</h3>
                        <ul className="list-disc list-inside text-gray-300">
                            {project.keyPoints.map((point, idx) => (
                                <li key={idx}>{point}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Website Features */}
                {project.websiteFeatures && project.websiteFeatures.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Website Features</h3>
                        <ul className="list-disc list-inside text-gray-300">
                            {project.websiteFeatures.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Support System */}
                {project.supportSystem && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Support System</h3>
                        <p className="text-gray-300">{project.supportSystem}</p>
                    </div>
                )}
                {/* Gallery (Collage System) */}
                {project.gallery && project.gallery.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Gallery</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {project.gallery.map((image, idx) => (
                                <div key={idx} className="relative h-48">
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg"
                                    />
                                    <p className="text-gray-400 text-sm mt-2 text-center">{image.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailsPage;