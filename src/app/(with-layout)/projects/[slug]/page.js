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

            {/* Responsive Breadcrumbs with Back Button */}
            <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm py-3 px-4">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                    {/* Breadcrumbs - will truncate long text */}
                    <nav className="flex items-center text-gray-300 text-sm min-w-0">
                        <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">Home</Link>
                        <span className="mx-2">›</span>
                        <Link href="/projects" className="hover:text-white transition-colors whitespace-nowrap">Projects</Link>
                        <span className="mx-2">›</span>
                        <span
                            className="text-white truncate max-w-[120px] xs:max-w-[180px] sm:max-w-[240px] md:max-w-[320px]"
                            title={project.title}
                        >
                            {project.title}
                        </span>
                    </nav>

                    {/* Back Button - remains fully visible */}
                    <Link
                        href="/projects"
                        className="flex items-center text-gray-300 hover:text-white transition-colors whitespace-nowrap text-sm"
                    >
                        <svg
                            className="w-5 h-5 mr-1"
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
                        <span className="hidden xs:inline">Back to Projects</span>
                        <span className="xs:hidden">Back</span>
                    </Link>
                </div>
            </div>

            <main className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 poppins-regular">
                {/* Hero Section - Improved */}
                <div className="mb-12 space-y-6">
                    {/* Main Image */}
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                        <Image
                            src={project.mainImage}
                            alt={project.imageAlt}
                            fill
                            className="object-cover"
                            priority
                            loading="eager"
                        />
                    </div>

                    {/* Project Meta */}
                    <div className="flex flex-wrap gap-3 items-center">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                            {project.category}
                        </span>
                        <span className="text-gray-400 text-sm">
                            {(project.views || 0).toLocaleString()} views
                        </span>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-4">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
                            {project.title}
                        </h1>

                        {project.subtitle && (
                            <h2 className="text-xl sm:text-2xl text-gray-300 font-medium">
                                {project.subtitle}
                            </h2>
                        )}

                        {(project.metaDescription || project.contentShort) && (
                            <p className="text-lg text-gray-300 leading-relaxed">
                                {project.metaDescription || project.contentShort}
                            </p>
                        )}
                    </div>
                </div>

                {/* Project Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-10">
                        {/* Description */}
                        <section className="space-y-6">

                    
                            <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500 mb-2">Project Overview</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                        </section>

                        {/* Content Sections */}
                        {project.content && project.content.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500 mb-2">Project Details</h2>

                        
                                <div className="space-y-4">
                                    {project.content.map((section, index) => (
                                        <section key={index} className="space-y-4">
                                            {React.createElement(
                                                section.tag === 'h1' && index > 0 ? 'h2' : section.tag || 'p',
                                                {
                                                    className: `${section.tag?.startsWith('h')
                                                            ? 'text-xl font-semibold text-white'
                                                            : 'text-gray-200 text-base leading-relaxed'
                                                        }`
                                                },
                                                section.content
                                            )}
                                            {section.bulletPoints && section.bulletPoints.length > 0 && (
                                                <ul className="space-y-3 pl-5">
                                                    {section.bulletPoints.map((point, idx) => (
                                                        <li key={idx} className="relative text-gray-300 text-base before:content-['•'] before:absolute before:-left-5 before:text-purple-400">
                                                            {point}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </section>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Key Features */}
                        {project.keyPoints && project.keyPoints.length > 0 && (
                            <section className="space-y-6">
                                

                                 <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500 mb-2">Key Features</h2>

                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {project.keyPoints.map((point, idx) => (
                                        <li key={idx} className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                                            <div className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                <span className="text-gray-300 text-lg">{point}</span>
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


                    {/* Right Side */}

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


                        {/* Link */}

                        {project.projectLink && (
                            <section className="mt-8">
                                <h2 className="text-xl font-bold text-white mb-4">Project Link</h2>
                                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors duration-200">
                                    <a
                                        href={project.projectLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 group"
                                    >
                                        <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                            </svg>
                                        </span>
                                        <span className="text-white group-hover:text-purple-300 transition-colors">
                                            {project.projectLinkText || 'Visit Project Site'}
                                        </span>
                                        <span className="ml-auto text-gray-400 group-hover:text-purple-300 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </span>
                                    </a>
                                    <p className="mt-2 text-sm text-gray-400 break-all">
                                        {project.projectLink}
                                    </p>
                                </div>
                            </section>
                        )}

                        {!project.projectLink && (
                            <section className="mt-8">
                                <h2 className="text-xl font-bold text-white mb-4">Project Link</h2>
                                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                    <p className="text-gray-400 italic">No project link available</p>
                                </div>
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