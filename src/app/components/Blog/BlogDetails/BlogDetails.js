


// src/app/components/Blog/BlogDetails/BlogDetails.js
"use client";
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { FaAnglesRight, FaClock, FaEye } from "react-icons/fa6";
import UserLink from '../../Profile/ProfileLink/UserLink';
import { useEffect, useState } from 'react';

// FAQ Accordion Component
const FAQAccordion = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl mt-12 shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b border-gray-200 relative">
                Frequently Asked Questions
                <span className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
            </h2>
            <div className="space-y-5">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index
                            ? 'shadow-md ring-2 ring-blue-100 bg-white'
                            : 'bg-gray-50 hover:bg-white hover:shadow-sm'
                            }`}
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="flex justify-between items-center w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-2xl"
                            aria-expanded={openIndex === index}
                        >
                            <span className="text-lg font-semibold text-gray-900 pr-4">
                                {faq.question}
                            </span>
                            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index
                                ? 'bg-blue-100 text-blue-600 rotate-180'
                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                <svg
                                    className="w-4 h-4 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index
                                ? 'max-h-96 opacity-100'
                                : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="px-6 pb-6 pt-2 bg-white">
                                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-4"></div>
                                <p className="text-gray-700 leading-relaxed text-lg">{faq.answer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Breadcrumb Schema Component
const BreadcrumbSchema = ({ siteUrl, blog }) => {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${siteUrl}`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${siteUrl}/blog`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": blog.title,
                "item": `${siteUrl}/blog/${blog.slug}`
            }
        ]
    };

    return (
        <Script
            id="breadcrumb-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
    );
};

// Simple function to render markdown hyperlinks
const renderMarkdownLinks = (text) => {
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let lastIndex = 0;
    const elements = [];
    let match;

    while ((match = markdownLinkRegex.exec(text)) !== null) {
        const [fullMatch, linkText, url] = match;
        const startIndex = match.index;
        const endIndex = markdownLinkRegex.lastIndex;

        // Add text before the link
        if (startIndex > lastIndex) {
            elements.push(text.slice(lastIndex, startIndex));
        }

        // Add the link
        elements.push(
            <a
                key={startIndex}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800 transition-colors duration-200 "
            >
                {linkText}
            </a>
        );

        lastIndex = endIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        elements.push(text.slice(lastIndex));
    }

    return elements.length > 0 ? elements : text;
};

export default function BlogContent({ blog }) {
    const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const [faqSchema, setFaqSchema] = useState(null);

    // Improved schemaMarkup with more detailed information
    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.metaDescription || blog.shortDescriptions.join(' '),
        "image": blog.mainImage,
        "author": {
            "@type": "Person",
            "name": blog.author || 'Unknown Author',
            ...(blog.authorCredentials && {
                "description": blog.authorCredentials,
                "knowsAbout": blog.lsiKeywords || []
            })
        },
        "datePublished": blog.publishDate,
        "dateModified": blog.updatedAt || blog.publishDate,
        "publisher": {
            "@type": "Organization",
            "name": "Your Site Name",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${siteUrl}/blog/${blog.slug}`
        },
        ...(blog.keyPoints && blog.keyPoints.length > 0 && {
            "keywords": blog.keyPoints.join(', ')
        }),
        ...(blog.geoLocation && blog.geoLocation.targetCountry && {
            "contentLocation": {
                "@type": "Place",
                "name": blog.geoLocation.targetCity ?
                    `${blog.geoLocation.targetCity}, ${blog.geoLocation.targetCountry}` :
                    blog.geoLocation.targetCountry
            }
        }),
        // Add articleBody for better SEO
        "articleBody": blog.content
            .filter(item => item.type === 'text')
            .map(item => item.data)
            .join(' ')
            .substring(0, 5000) // Limit length
    };

    // Add FAQ schema if FAQs exist
    useEffect(() => {
        if (blog.faqs && blog.faqs.length > 0) {
            const faqSchemaData = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": blog.faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            };
            setFaqSchema(faqSchemaData);
        }
    }, [blog.faqs]);

    // Structured Data থেকে JSON parse করুন
    let additionalStructuredData = null;
    try {
        if (blog.structuredData) {
            additionalStructuredData = typeof blog.structuredData === 'string' ?
                JSON.parse(blog.structuredData) : blog.structuredData;
        }
    } catch (e) {
        console.error("Error parsing structured data:", e);
    }

    const renderContent = (item, index) => {
        switch (item.type) {
            case 'text':
                const Tag = item.tag || 'p';
                const isHeading = item.tag && item.tag.startsWith('h');

                return (
                    <div key={index} className="my-6">
                        <Tag className={
                            isHeading
                                ? `text-2xl md:text-3xl font-bold mt-10 mb-5 text-gray-900 ${item.tag === 'h2' ? 'border-b pb-3 border-gray-200' : ''}`
                                : 'text-gray-800 my-4 leading-relaxed text-lg'
                        }>
                            {renderMarkdownLinks(item.data)}
                        </Tag>
                        {item.bulletPoints?.length > 0 && (
                            <ul className="list-disc pl-6 mt-4 space-y-3">
                                {item.bulletPoints.map((point, i) => (
                                    <li key={i} className="text-gray-800 text-lg">{renderMarkdownLinks(point)}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                );

            case 'image':
                return (
                    <div key={index} className="my-10">
                        <div className="relative w-full h-auto rounded-2xl overflow-hidden shadow-sm">
                            <Image
                                src={item.data}
                                alt={item.alt || blog.title}
                                width={800}
                                height={600}
                                className="w-full h-auto"
                                sizes="(max-width: 768px) 100vw, 800px"
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPgZZ9WwAAAABJRU5ErkJggg=="
                            />
                        </div>
                        {item.alt && (
                            <p className="text-center text-sm text-gray-600 mt-3">{item.alt}</p>
                        )}
                    </div>
                );

            case 'link':
                return (
                    <div key={index} className="my-5">
                        <a
                            href={item.href}
                            target={item.target || '_blank'}
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-800 transition-colors duration-200 text-lg"
                        >
                            {item.data}
                        </a>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!blog) {
        return <div className="text-center py-20 text-gray-800">Blog not found</div>;
    }

    // Define breadcrumbTitle to truncate long titles
    const breadcrumbTitle = blog.title.length > 30 ? `${blog.title.slice(0, 27)}...` : blog.title;

    return (
        <>
            {/* Main Schema Markup */}
            <Script
                id="schema-markup"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />

            {/* Breadcrumb Schema */}
            <BreadcrumbSchema siteUrl={siteUrl} blog={blog} />

            {/* Additional Structured Data */}
            {additionalStructuredData && (
                <Script
                    id="additional-structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(additionalStructuredData) }}
                />
            )}

            {/* FAQ Schema */}
            {faqSchema && (
                <Script
                    id="faq-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            <article className="max-w-3xl mx-auto px-4 py-8 md:px-6" itemScope itemType="https://schema.org/BlogPosting">
                <meta itemProp="name" content={blog.title} />
                <meta itemProp="description" content={blog.metaDescription || blog.shortDescriptions.join(' ')} />
                <meta itemProp="image" content={blog.mainImage} />
                <meta itemProp="datePublished" content={new Date(blog.publishDate).toISOString()} />
                <meta itemProp="dateModified" content={new Date(blog.updatedAt || blog.publishDate).toISOString()} />
                <meta itemProp="author" content={blog.author} />

                <nav className="mb-8 flex items-center space-x-2 text-sm text-gray-600">
                    <a href="/" className="hover:text-blue-600 transition-colors duration-200">
                        Home
                    </a>
                    <FaAnglesRight className="text-gray-400 text-xs" />
                    <a href="/blog" className="hover:text-blue-600 transition-colors duration-200">
                        Blog
                    </a>
                    <FaAnglesRight className="text-gray-400 text-xs" />
                    <span className="text-gray-800 font-medium truncate max-w-[200px]" title={blog.title}>
                        {breadcrumbTitle}
                    </span>
                </nav>

                <div className="flex flex-wrap gap-2 mb-6">
                    {blog.categories?.map((category, index) => (
                        <span
                            key={index}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm"
                            itemProp="articleSection"
                        >
                            {category}
                        </span>
                    ))}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight" itemProp="headline">
                    {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
                    <div className="flex items-center">
                        <span className="font-medium">By <UserLink author={blog.author} /></span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center">
                        <time dateTime={new Date(blog.publishDate).toISOString()} itemProp="datePublished" className="flex items-center">
                            {new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }).format(new Date(blog.publishDate))}
                        </time>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center">
                        <FaClock className="mr-1.5 text-gray-500" />
                        <span>{blog.readTime || 1} min read</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center">
                        <FaEye className="mr-1.5 text-gray-500" />
                        <span>{blog.views || 0} views</span>
                    </div>
                </div>

                <div className="mb-10 rounded-2xl overflow-hidden shadow-sm">
                    <Image
                        src={blog.mainImage}
                        alt={blog.title}
                        width={1200}
                        height={628}
                        className="w-full h-auto"
                        sizes="(max-width: 768px) 100vw, 1200px"
                        priority
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPgZZ9WwAAAABJRU5ErkJggg=="
                        itemProp="image"
                    />
                </div>

                {blog.metaDescription && (
                    <div className="relative bg-white p-6 rounded-xl mb-8 border border-purple-200 shadow-sm">
                        <div className="absolute -left-2 top-4 w-4 h-4 rotate-45 bg-purple-500"></div>
                        <p className="text-lg text-gray-800 font-medium leading-relaxed relative pl-6">
                            <span className="absolute left-0 top-0 text-4xl text-purple-400 font-serif">"</span>
                            {blog.metaDescription}
                        </p>
                    </div>
                )}

                {blog.shortDescriptions?.length > 0 && (
                    <div className="p-5 bg-gray-50/50 rounded-xl mb-8 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                        {blog.shortDescriptions.map((desc, index) => (
                            <p key={index} className="text-gray-700 mb-3 last:mb-0 leading-relaxed">
                                {desc}
                            </p>
                        ))}
                    </div>
                )}

                <div className="prose prose-lg max-w-none text-gray-800" itemProp="articleBody">
                    {blog.content?.map((item, index) => renderContent(item, index))}
                </div>

                {/* FAQ Section */}
                {blog.faqs && blog.faqs.length > 0 && (
                    <FAQAccordion faqs={blog.faqs} />
                )}

                {blog.keyPoints?.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl mt-10 border border-blue-200 shadow-sm">
                        <div className="flex items-center mb-4 pb-3 border-b border-blue-200">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Key Takeaways</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {blog.keyPoints.map((point, index) => (
                                <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-blue-100 shadow-xs hover:shadow-sm transition-shadow">
                                    <span className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-800 text-sm md:text-base">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {blog.tags?.length > 0 && (
                    <div className="mt-10 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                                <a
                                    key={index}
                                    href={`/blog/tag/${tag.toLowerCase()}`}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-full transition-colors duration-200 shadow-sm"
                                    rel="tag"
                                >
                                    #{tag}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Author Bio Section */}
                {blog.authorCredentials && (
                    <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">About the Author</h3>
                        <p className="text-gray-800 leading-relaxed">{blog.authorCredentials}</p>
                    </div>
                )}
            </article>
        </>
    );
}