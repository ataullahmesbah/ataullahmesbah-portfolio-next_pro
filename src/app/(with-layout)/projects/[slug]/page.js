// src/app/(with-layout)/projects/[slug]/page.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import ProjectGallery from '@/app/components/ProjectGallery/ProjectGallery';
import { FaTwitter, FaFacebook, FaLinkedin, FaMedium, FaShareAlt } from 'react-icons/fa';



// Fetch project data (server-side)
async function fetchProject(slug) {
    try {
        // Use the environment variable or fallback to localhost
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/projects?slug=${slug}`, {
            cache: 'no-store',
        });
        if (!response.ok) throw new Error('Failed to fetch project');
        const data = await response.json();
        if (!data.project) throw new Error('Project not found');
        return data.project;
    } catch (err) {
        console.error('Error fetching project:', err);
        throw err;
    }
}

// Generate metadata dynamically
export async function generateMetadata({ params }) {
    const { slug } = params;

    try {
        const project = await fetchProject(slug);

        const metaDescription = project.metaDescription && project.metaDescription.length > 0
            ? project.metaDescription.slice(0, 160)
            : `${project.title} - A ${project.category} project by Ataullah Mesbah. ${project.contentShort || project.description || ''}`.slice(0, 160);

        return {
            title: `${project.title} - Ataullah Mesbah`,
            description: metaDescription,
            keywords: `${project.category}, ${project.title}, project portfolio, Ataullah Mesbah`,
            authors: [{ name: 'Ataullah Mesbah' }],
            openGraph: {
                title: `${project.title} - Projects | Ataullah Mesbah`,
                description: metaDescription,
                images: [project.mainImage],
                url: `https://yourwebsite.com/projects/${project.slug}`, // Replace with your domain
                type: 'website',
                siteName: 'Ataullah Mesbah',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${project.title} - Projects | Ataullah Mesbah`,
                description: metaDescription,
                images: [project.mainImage],
            },
            alternates: {
                canonical: `https://yourwebsite.com/projects/${project.slug}`, // Replace with your domain
            },
        };
    } catch (err) {
        return {
            title: 'Projects | Ataullah Mesbah',
            description: 'Explore our portfolio of projects including marketing, ecommerce, travel, blog, and personal portfolio websites.',
        };
    }
}

const ProjectDetailsPage = async ({ params }) => {
    const { slug } = params;
    let project;

    try {
        project = await fetchProject(slug);
    } catch (err) {
        if (err.message === 'Project not found') {
            notFound();
        }
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg text-center max-w-md mx-auto mt-10">
                Error: {err.message}
            </div>
        );
    }

    // Schema markup for the project (CreativeWork)
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": project.title,
        "description": project.metaDescription || `${project.title} - A ${project.category} project by Ataullah Mesbah.`,
        "image": project.mainImage,
        "url": `https://yourwebsite.com/projects/${project.slug}`, // Replace with your domain
        "author": {
            "@type": "Person",
            "name": "Ataullah Mesbah"
        },
        "datePublished": project.createdAt ? new Date(project.createdAt).toISOString() : undefined,
        "dateModified": project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined,
        "keywords": `${project.category}, ${project.title}, project portfolio`,
        "inLanguage": "en-US",
        "isPartOf": {
            "@type": "WebSite",
            "name": "Ataullah Mesbah",
            "url": "https://yourwebsite.com" // Replace with your domain
        }
    };

    // Breadcrumb schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://yourwebsite.com" // Replace with your domain
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Projects",
                "item": "https://yourwebsite.com/projects" // Replace with your domain
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": project.title,
                "item": `https://yourwebsite.com/projects/${project.slug}` // Replace with your domain
            }
        ]
    };

    const renderContentSection = (section, index) => {
        const Tag = section.tag || 'p';
        const adjustedTag = Tag === 'h1' && index > 0 ? 'h2' : Tag;
        const baseSize = {
            'h1': 'text-2xl font-semibold sm:text-2xl',
            'h2': 'text-2xl sm:text-2xl',
            'h3': 'text-2xl sm:text-2xl',
            'h4': 'text-2xl sm:text-2xl',
            'h5': 'text-base sm:text-lg',
            'h6': 'text-sm sm:text-lg',
            'p': 'text-gray-200 leading-relaxed'
        }[adjustedTag];

        return (
            <section key={index} className="mb-8">
                {React.createElement(
                    adjustedTag,
                    { className: `${baseSize} font-medium text-white mb-4` },
                    section.content
                )}
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
            {/* Schema Markup */}
            <Script
                id="project-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Breadcrumbs with Back Button */}
            <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm py-3 px-4">
                <div className="flex items-center justify-between">
                    <nav className="flex items-center text-gray-300 space-x-2 text-sm">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>›</span>
                        <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
                        <span>›</span>
                        <span className="text-white">{project.title}</span>
                    </nav>
                    <Link href="/projects" className="flex items-center text-gray-300 hover:text-white transition-colors">
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
                    </Link>
                </div>
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
                            loading="eager"
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
                        <p className="text-white">{project.metaDescription}</p>
                        {/* Subtitle & Short Description */}
                        <h2 className="text-xl sm:text-2xl text-gray-300">
                            {project.subtitle}
                        </h2>
                        <p className="text-white">{project.contentShort}</p>
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

                        {/* Related Projects (Internal Linking) */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6">Explore More Projects</h2>
                            <div className="flex space-x-4">
                                <Link href="/projects" className="text-blue-400 hover:underline">View All Projects</Link>
                                <Link href={`/projects?category=${project.category}`} className="text-blue-400 hover:underline">
                                    More {project.category} Projects
                                </Link>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Gallery */}
                        {project.gallery && project.gallery.length > 0 && (
                            <ProjectGallery gallery={project.gallery} />
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

                        {/* Share Options */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Share This Project</h2>
                            <div className="flex space-x-4">
                                {/* Twitter */}
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://yourwebsite.com/projects/${project.slug}`)}&text=${encodeURIComponent(`Check out this project: ${project.title} by Ataullah Mesbah`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-gray-800 hover:bg-blue-500 transition-colors"
                                    aria-label="Share on Twitter"
                                >
                                    <FaTwitter className="w-6 h-6 text-white" />
                                </a>

                                {/* Facebook */}
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yourwebsite.com/projects/${project.slug}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors"
                                    aria-label="Share on Facebook"
                                >
                                    <FaFacebook className="w-6 h-6 text-white" />
                                </a>

                                {/* LinkedIn */}
                                <a
                                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://yourwebsite.com/projects/${project.slug}`)}&title=${encodeURIComponent(project.title)}&summary=${encodeURIComponent(project.metaDescription || project.description)}&source=Ataullah%20Mesbah`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-gray-800 hover:bg-blue-700 transition-colors"
                                    aria-label="Share on LinkedIn"
                                >
                                    <FaLinkedin className="w-6 h-6 text-white" />
                                </a>

                                {/* Medium */}
                                <a
                                    href={`https://medium.com/?url=${encodeURIComponent(`https://yourwebsite.com/projects/${project.slug}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-600 transition-colors"
                                    aria-label="Share on Medium"
                                >
                                    <FaMedium className="w-6 h-6 text-white" />
                                </a>
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Get in Touch</h2>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                <p className="text-gray-300 mb-4">
                                    Interested in working together or have questions about this project? Let’s connect!
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                                >
                                    Contact Me
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetailsPage;