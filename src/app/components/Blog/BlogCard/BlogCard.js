// app/components/Blog/BlogCard.jsx (Responsive Version)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiEye, FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi';
import { useState } from 'react';

export default function BlogCard({ blog, index, priority = false }) {
    const [imageLoading, setImageLoading] = useState(true);

    const metaDescription = blog.metaDescription?.slice(0, 120) + (blog.metaDescription?.length > 120 ? '...' : '');
    const category = blog.categories?.[0] || 'Uncategorized';

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Recent';
        }
    };

    const readingTime = blog.readingTime || '5 min read';

    return (
        <article
            className="group bg-gray-800 rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-700 hover:border-purple-500/30 flex flex-col h-full"
            data-aos="fade-up"
            data-aos-delay={index * 100}
        >
            {/* Image Container */}
            <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                    src={blog.mainImage || '/images/blog-placeholder.jpg'}
                    alt={blog.title || 'Blog post'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={`object-cover transition-all duration-700 group-hover:scale-110 ${imageLoading ? 'blur-sm' : 'blur-0'
                        }`}
                    quality={85}
                    priority={priority}
                    onLoad={() => setImageLoading(false)}
                />

                {/* Loading Overlay */}
                {imageLoading && (
                    <div className="absolute inset-0 bg-gray-700 animate-pulse" />
                )}

                {/* Category Badge */}
                <div className="absolute top-2 lg:top-3 left-2 lg:left-3">
                    <span className="inline-block px-2 lg:px-3 py-1 text-xs bg-purple-600/90 text-white rounded-full backdrop-blur-sm border border-purple-400/20">
                        {category.length > 15 ? category.substring(0, 15) + '...' : category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 lg:p-4 xl:p-6 flex flex-col flex-grow">
                {/* Date and Reading Time */}
                <div className="flex items-center justify-between text-xs lg:text-sm text-gray-400 mb-2 lg:mb-3">
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        <div className="flex items-center">
                            <FiCalendar className="w-3 h-3 mr-1" />
                            <time dateTime={blog.publishDate} className="text-xs lg:text-sm">
                                {formatDate(blog.publishDate)}
                            </time>
                        </div>
                        <div className="flex items-center">
                            <FiClock className="w-3 h-3 mr-1" />
                            <span className="text-xs lg:text-sm">{readingTime}</span>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-base lg:text-lg xl:text-xl font-bold mb-2 lg:mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
                    <Link
                        href={`/blog/${blog.slug}`}
                        className="text-white hover:text-purple-300 transition-colors"
                        prefetch={false}
                    >
                        {blog.title || 'Untitled Blog'}
                    </Link>
                </h2>

                {/* Description */}
                <p className="text-gray-300 text-xs lg:text-sm mb-3 lg:mb-4 line-clamp-3 flex-grow">
                    {metaDescription || 'No description available.'}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center mt-auto pt-2 lg:pt-3 xl:pt-4 border-t border-gray-700">
                    <div className="flex items-center text-xs lg:text-sm text-gray-400">
                        <FiEye className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        <span>{blog.views || 0} views</span>
                    </div>
                    <Link
                        href={`/blog/${blog.slug}`}
                        className="flex items-center text-xs lg:text-sm font-medium text-purple-400 hover:text-purple-300 transition-all duration-300 group-hover:translate-x-1"
                        prefetch={false}
                    >
                        Read More
                        <FiArrowRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </article>
    );
}