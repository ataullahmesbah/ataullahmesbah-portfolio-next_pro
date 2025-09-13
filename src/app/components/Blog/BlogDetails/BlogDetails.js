// src/app/component/Blog/BlogDetails/BlogDetails.js

"use client";
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { FaAnglesRight } from "react-icons/fa6";
import UserLink from '../../Profile/ProfileLink/UserLink';
import { useEffect, useState } from 'react';

// FAQ Accordion Component
const FAQAccordion = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="flex justify-between items-center w-full text-left font-semibold text-gray-800 hover:text-blue-600 focus:outline-none"
                            aria-expanded={openIndex === index}
                        >
                            <span>{faq.question}</span>
                            <svg
                                className={`w-5 h-5 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
                        >
                            <p className="text-gray-700">{faq.answer}</p>
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
                className="text-blue-600 hover:text-blue-800"
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
                    <div key={index} className="my-4">
                        <Tag className={
                            isHeading
                                ? 'text-xl font-semibold mt-6 mb-4'
                                : 'text-gray-800 my-3'
                        }>
                            {renderMarkdownLinks(item.data)}
                        </Tag>
                        {item.bulletPoints?.length > 0 && (
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                {item.bulletPoints.map((point, i) => (
                                    <li key={i} className="text-gray-800">{renderMarkdownLinks(point)}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                );

            case 'image':
                return (
                    <div key={index} className="my-6">
                        <Image
                            src={item.data}
                            alt={item.alt || blog.title}
                            width={800}
                            height={600}
                            className="w-full max-w-[800px] h-auto rounded-lg shadow-md mx-auto"
                            sizes="(max-width: 768px) 100vw, 800px"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPgZZ9WwAAAABJRU5ErkJggg=="
                        />
                        {item.alt && (
                            <p className="text-center text-sm text-gray-600 mt-2">{item.alt}</p>
                        )}
                    </div>
                );

            case 'link':
                return (
                    <div key={index} className="my-4">
                        <a
                            href={item.href}
                            target={item.target || '_blank'}
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
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

            <article className="max-w-3xl mx-auto px-4 py-8" itemScope itemType="https://schema.org/BlogPosting">
                <meta itemProp="name" content={blog.title} />
                <meta itemProp="description" content={blog.metaDescription || blog.shortDescriptions.join(' ')} />
                <meta itemProp="image" content={blog.mainImage} />
                <meta itemProp="datePublished" content={new Date(blog.publishDate).toISOString()} />
                <meta itemProp="dateModified" content={new Date(blog.updatedAt || blog.publishDate).toISOString()} />
                <meta itemProp="author" content={blog.author} />

                <nav className="mb-6 flex items-center space-x-2 text-sm">
                    <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        Home
                    </a>
                    <FaAnglesRight className="text-gray-400" />
                    <a href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        Blog
                    </a>
                    <FaAnglesRight className="text-gray-400" />
                    <span className="text-gray-800 font-medium truncate max-w-[200px]" title={blog.title}>
                        {breadcrumbTitle}
                    </span>
                </nav>

                <div className="flex flex-wrap gap-2 mb-4">
                    {blog.categories?.map((category, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            itemProp="articleSection"
                        >
                            {category}
                        </span>
                    ))}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" itemProp="headline">
                    {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">
                    <span>By <UserLink author={blog.author} /></span>
                    <span>•</span>
                    <time dateTime={new Date(blog.publishDate).toISOString()} itemProp="datePublished">
                        {new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }).format(new Date(blog.publishDate))}
                    </time>
                    <span>•</span>
                    <span>{blog.readTime || 1} min read</span>
                    <span>•</span>
                    <span>{blog.views || 0} views</span>
                </div>

                <div className="mb-8">
                    <Image
                        src={blog.mainImage}
                        alt={blog.title}
                        width={1200}
                        height={628}
                        className="w-full max-w-[1200px] h-auto rounded-lg shadow-md mx-auto"
                        sizes="(max-width: 768px) 100vw, 1200px"
                        priority
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPgZZ9WwAAAABJRU5ErkJggg=="
                        itemProp="image"
                    />
                </div>

                {blog.metaDescription && (
                    <p className="text-lg text-gray-700 mb-6 font-medium" itemProp="description">
                        {blog.metaDescription}
                    </p>
                )}

                {blog.shortDescriptions?.length > 0 && (
                    <div className="p-4 rounded-lg mb-6">
                        {blog.shortDescriptions.map((desc, index) => (
                            <p key={index} className="text-gray-700 mb-2 last:mb-0">
                                {desc}
                            </p>
                        ))}
                    </div>
                )}

                <div className="prose max-w-none" itemProp="articleBody">
                    {blog.content?.map((item, index) => renderContent(item, index))}
                </div>

                {/* FAQ Section */}
                {blog.faqs && blog.faqs.length > 0 && (
                    <FAQAccordion faqs={blog.faqs} />
                )}

                {blog.keyPoints?.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
                        <ul className="space-y-2">
                            {blog.keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span className="text-gray-800">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {blog.tags?.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">TAGS</h3>
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                                <a
                                    key={index}
                                    href={`/blog/tag/${tag.toLowerCase()}`}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded"
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
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">About the Author</h3>
                        <p className="text-gray-800">{blog.authorCredentials}</p>
                    </div>
                )}
            </article>
        </>
    );
}