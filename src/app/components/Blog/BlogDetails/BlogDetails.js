// src/app/component/Blog/BlogDetails/BlogDetails.js

"use client";
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { FaAnglesRight } from "react-icons/fa6";
import UserLink from '../../Profile/ProfileLink/UserLink';

export default function BlogContent({ blog }) {
    const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.metaDescription || blog.shortDescriptions.join(' '),
        "image": blog.mainImage,
        "author": {
            "@type": "Person",
            "name": blog.author || 'Unknown Author',
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
        }
    };

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
                            {item.data}
                        </Tag>
                        {item.bulletPoints?.length > 0 && (
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                {item.bulletPoints.map((point, i) => (
                                    <li key={i} className="text-gray-800">{point}</li>
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
                            height={450}
                            className="w-full h-auto rounded-lg shadow-md"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPgZf9WwAAAABJRU5ErkJggg=="
                        />

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
            <Script
                id="schema-markup"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />
            <article className="max-w-3xl mx-auto px-4 py-8">
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
                        >
                            {category}
                        </span>
                    ))}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">



                    <span>By <UserLink author={blog.author} /></span>


                    <span>•</span>
                    <time dateTime={new Date(blog.publishDate).toISOString()}>
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
                        height={630}
                        className="w-full h-auto rounded-lg shadow-md"
                        priority
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPgZf9WwAAAABJRU5ErkJggg=="
                    />
                </div>

                {blog.metaDescription && (
                    <p className="text-lg text-gray-700 mb-6 font-medium">
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

                <div className="prose max-w-none">
                    {blog.content?.map((item, index) => renderContent(item, index))}
                </div>

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
                                >
                                    #{tag}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </>
    );
}